import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialization for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AgriSmart Nusantara Server' 
  });
});

// AI Crop Disease & Pest Diagnosis Endpoint
app.post('/api/ai/diagnose-crop', async (req, res) => {
  try {
    const { cropType, plantPart, symptomsDescription, imageBase64, mimeType } = req.body;
    const ai = getGenAI();

    const promptText = `Anda adalah Pakar Agronomi dan Perlindungan Tanaman (POPT) Senior Indonesia.
Tolong lakukan diagnosis mendalam terhadap kondisi/gejala tanaman berikut:
- Komoditas Tanaman: ${cropType || 'Tanaman Pertanian'}
- Bagian Tanaman Terdampak: ${plantPart || 'Daun / Batang / Buah'}
- Deskripsi Gejala Pengamatan Lapangan: ${symptomsDescription || 'Terlihat perubahan warna, bercak, atau kerusakan fisik'}

Analisis dengan teliti dan berikan rekomendasi pengendalian terpadu (PHT - Pengendalian Hama Terpadu) yang aman, aplikatif, dan sesuai kondisi agroklimat Indonesia (kombinasi hayati/organik + kimiawi tepat dosis).`;

    const contents: Array<any> = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: { parts: contents },
      config: {
        systemInstruction: 'Anda adalah pakar agronomi, dokter tanaman, dan ahli proteksi tanaman terpadu bersertifikat nasional Indonesia. Hasilkan keluaran analisis terstruktur dalam format JSON yang akurat, ilmiah, dan mudah dipraktikkan oleh petani maupun pengelola lahan modern.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING, description: 'Nama penyakit atau hama dalam Bahasa Indonesia umum' },
            scientificName: { type: Type.STRING, description: 'Nama ilmiah patogen / serangga (contoh: Xanthomonas oryzae, Colletotrichum capsici)' },
            cropType: { type: Type.STRING, description: 'Nama komoditas yang didiagnosis' },
            pathogenType: { type: Type.STRING, description: 'Kategori: Jamur / Fungi, Bakteri, Virus, Serangga Hama, Defisiensi Nutrisi, atau Gangguan Cuaca' },
            confidencePct: { type: Type.NUMBER, description: 'Tingkat keyakinan diagnosis (1-100)' },
            severity: { type: Type.STRING, description: 'Tingkat keparahan: Ringan (1-20%), Sedang (21-50%), Tinggi (51-80%), atau Sangat Kritis (>80%)' },
            symptomsSummary: { type: Type.STRING, description: 'Penjelasan ringkas gejala khas yang teridentifikasi di lapangan' },
            biologicalControl: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'Langkah pengendalian alami / agens hayati (Trichoderma, Beauveria, pestisida nabati, musuh alami)' 
            },
            chemicalTreatment: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  activeIngredient: { type: Type.STRING, description: 'Bahan aktif kimia rekomendasi' },
                  dosage: { type: Type.STRING, description: 'Dosis aplikasi tepat per liter atau per hektar' },
                  brandExamples: { type: Type.STRING, description: 'Contoh merek dagang terdaftar di Kementan' },
                  safetyPeriodDays: { type: Type.NUMBER, description: 'Masa tunggu panen aman (PHI) dalam hari' }
                }
              },
              description: 'Daftar intervensi kimiawi terukur jika serangan melampaui ambang ekonomi'
            },
            culturalPractices: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Kultur teknis perbaikan budidaya (sanitasi, drainase, pemangkasan tunas air, mulsa)'
            },
            preventiveTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Langkah pencegahan sekunder agar tidak menular ke petak/blok lain'
            },
            recommendationNote: { type: Type.STRING, description: 'Catatan penting agronomi dari dokter tanaman' }
          },
          required: [
            'diseaseName',
            'scientificName',
            'cropType',
            'pathogenType',
            'confidencePct',
            'severity',
            'symptomsSummary',
            'biologicalControl',
            'chemicalTreatment',
            'culturalPractices',
            'preventiveTips',
            'recommendationNote'
          ]
        }
      }
    });

    const diagnosis = JSON.parse(response.text || '{}');
    res.json({ success: true, data: diagnosis });
  } catch (error: any) {
    console.error('Error diagnosing crop:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Gagal melakukan diagnosa tanaman dengan AI' 
    });
  }
});

// AI Smart Agronomist Consultation Chat
app.post('/api/ai/agri-advisor', async (req, res) => {
  try {
    const { message, chatHistory, farmContext } = req.body;
    const ai = getGenAI();

    const farmSummary = farmContext ? `
Konteks Pertanian Saat Ini:
- Total Blok Lahan: ${farmContext.totalBlocks || 6}
- Total Luas: ${farmContext.totalAreaHa || 10.3} Ha
- Komoditas Dominan: Padi, Cabai Merah, Jagung Hibrida, Tomat, Kopi Arabika, Bawang Merah
- Rata-rata Kelembaban Tanah: ${farmContext.soilMoistureAvg || '68%'}
- Cuaca Hari Ini: Cerah Berawan, Suhu 28.4°C
` : '';

    const systemPrompt = `Anda adalah "AgriBot Nusantara", asisten agronomis kecerdasan buatan terpadu untuk pengelola dan petani modern di Indonesia.
Anda memiliki keahlian luas dalam:
1. Agronomi, fisiologi tanaman tropis, dan pola tanam nusantara (tumpangsari, mina padi, agroforestri, hidroponik/greenhouse).
2. Manajemen pemupukan presisi, formulasi NPK, pupuk hayati, dan pengapuran tanah masam/gambut.
3. Perlindungan tanaman terpadu (PHT), monitoring hama wereng, ulat grayak, lalat buah, antraknosa, blas padi.
4. Smart irrigation, sensor IoT lahan, dan mitigasi cuaca El Nino / La Nina.
5. Analisis finansial agribisnis, perhitungan HPP, margin keuntungan, dan rantai pasok pemasaran hasil panen.

Gunakan bahasa Indonesia yang santun, profesional, lugas, berbasis data ilmiah praktis, dan menyemangati. Berikan formatting poin-poin tebal agar mudah dibaca di smartphone saat di lapangan.`;

    const chatMessages: Array<any> = [];

    if (Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        chatMessages.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }
    }

    const currentPrompt = `${farmSummary}\n\nPertanyaan Petani/Pengelola: ${message}`;
    chatMessages.push({
      role: 'user',
      parts: [{ text: currentPrompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: chatMessages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    res.json({
      success: true,
      reply: response.text || 'Maaf, saya tidak dapat memproses jawaban saat ini.'
    });
  } catch (error: any) {
    console.error('Error in agri advisor:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Gagal berkomunikasi dengan asisten agronomis AI' 
    });
  }
});

// AI Yield & Market Optimization Advice
app.post('/api/ai/harvest-yield-prediction', async (req, res) => {
  try {
    const { blockData, weatherData } = req.body;
    const ai = getGenAI();

    const prompt = `Analisis data blok pertanian berikut dan berikan proyeksi estimasi hasil panen, potensi risiko cuaca, serta rekomendasi timing panen dan strategi penjualan pasar terbaik:
Blok: ${JSON.stringify(blockData || {})}
Cuaca: ${JSON.stringify(weatherData || {})}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah konsultan hasil panen dan agribisnis pasar komoditas Indonesia. Berikan estimasi realistis, perbandingan terhadap rata-rata nasional, dan tips pascapanen.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projectedYieldTonHa: { type: Type.NUMBER, description: 'Estimasi hasil panen ton per hektar' },
            variancePct: { type: Type.NUMBER, description: 'Persentase deviasi dari target (misal +8% atau -5%)' },
            optimalHarvestWindow: { type: Type.STRING, description: 'Rentang tanggal panen paling ideal' },
            marketPriceOutlook: { type: Type.STRING, description: 'Prediksi tren harga komoditas (Stabil, Naik, Fluktuatif)' },
            recommendedChannel: { type: Type.STRING, description: 'Saluran penjualan yang paling menguntungkan' },
            criticalActionPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Langkah kunci yang harus dilakukan 14 hari sebelum panen'
            },
            postHarvestRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Prosedur pengeringan, sortasi, dan penyimpanan'
            }
          },
          required: [
            'projectedYieldTonHa',
            'variancePct',
            'optimalHarvestWindow',
            'marketPriceOutlook',
            'recommendedChannel',
            'criticalActionPoints',
            'postHarvestRecommendations'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error in yield prediction:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Gagal menghitung prediksi panen AI' 
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriSmart Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
