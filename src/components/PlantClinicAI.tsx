import React, { useState, useRef } from 'react';
import { 
  Stethoscope, 
  Upload, 
  Camera, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Bug, 
  Leaf, 
  HelpCircle, 
  RotateCw, 
  Search, 
  BookOpen,
  FlaskConical,
  X
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { PEST_DISEASE_DATABASE } from '../data/mockData';
import { CropDiagnosisResult } from '../types';

export const PlantClinicAI: React.FC = () => {
  const { blocks } = useFarm();

  const [selectedCrop, setSelectedCrop] = useState<string>('Padi Sawah');
  const [plantPart, setPlantPart] = useState<string>('Daun & Batang');
  const [symptomText, setSymptomText] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<CropDiagnosisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Library Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<typeof PEST_DISEASE_DATABASE[0] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset fast samples
  const samplePresets = [
    {
      title: 'Gejala Kresek / Hawar Daun Padi',
      crop: 'Padi Sawah',
      part: 'Daun',
      desc: 'Tepi daun berwarna kuning pucat dan mengering bergelombang mulai dari ujung daun. Pagi hari terlihat embun bakteri kental.'
    },
    {
      title: 'Patek / Antraknosa Buah Cabai',
      crop: 'Cabai Merah Keriting',
      part: 'Buah Cabai',
      desc: 'Bercak cekung kehitaman melingkar pada buah cabai merah, spora oranye di tengah lesi, buah membusuk dan rontok.'
    },
    {
      title: 'Ulat Grayak Frugiperda (FAW) Jagung',
      crop: 'Jagung Hibrida',
      part: 'Pupus & Titik Tumbuh',
      desc: 'Daun muda compang-camping dan terdapat kotoran ulat seperti serbuk gergaji basah menumpuk di dalam pupus tanaman.'
    }
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setSelectedCrop(preset.crop);
    setPlantPart(preset.part);
    setSymptomText(preset.desc);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImageBase64(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunDiagnosis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!symptomText && !imageBase64) {
      alert('Mohon masukkan deskripsi gejala tanaman atau unggah foto sampel.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/diagnose-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: selectedCrop,
          plantPart,
          symptomsDescription: symptomText,
          imageBase64: imageBase64 || undefined
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setDiagnosisResult(json.data);
      } else {
        throw new Error(json.error || 'Respon AI tidak valid');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal melakukan diagnosis dengan AI. Pastikan server aktif.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLibrary = PEST_DISEASE_DATABASE.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.localName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.cropTarget.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Dokter Tanaman AI • Gemini 3.7 Flash
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            Klinik Tanaman & Diagnosa Hama/Penyakit Terpadu
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Analisis patogen cerdas, penentuan tingkat keparahan, rekomendasi agens hayati & perlakuan kimiawi terukur
          </p>
        </div>

        {/* Preset Samples */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-stone-400 font-medium">Contoh Gejala:</span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 text-[11px] transition-colors"
            >
              {preset.title.split('/')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input / Scanner (5 Cols) + AI Diagnosis Report (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Photo Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800/80 pb-3">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Input Pengamatan Gejala Lapangan
            </h3>

            <form onSubmit={handleRunDiagnosis} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Komoditas Tanaman</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Padi Sawah">Padi Sawah</option>
                    <option value="Cabai Merah Keriting">Cabai Merah Keriting</option>
                    <option value="Jagung Hibrida">Jagung Hibrida</option>
                    <option value="Tomat Sayur">Tomat Sayur</option>
                    <option value="Bawang Merah">Bawang Merah</option>
                    <option value="Kopi Arabika">Kopi Arabika</option>
                    <option value="Kelapa Sawit">Kelapa Sawit</option>
                    <option value="Kedelai">Kedelai</option>
                    <option value="Sayuran Hidroponik">Sayuran Hijau / Selada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Bagian Terdampak</label>
                  <select
                    value={plantPart}
                    onChange={(e) => setPlantPart(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Daun & Pucuk">Daun & Pucuk Muda</option>
                    <option value="Batang & Pangkal Batang">Batang & Pangkal Batang</option>
                    <option value="Buah & Bulir">Buah & Bulir</option>
                    <option value="Bunga & Tangkai">Bunga & Tangkai</option>
                    <option value="Akar & Tanah">Akar & Perakaran</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload Box */}
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Foto Sampel Daun / Batang / Buah (Opsional)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-stone-700 max-h-48 bg-black flex items-center justify-center">
                    <img src={imagePreview} alt="Sample preview" className="max-h-48 object-contain" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageBase64(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-800 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-stone-950/40"
                  >
                    <Camera className="w-6 h-6 mx-auto text-stone-500 mb-1" />
                    <span className="text-stone-300 font-medium block text-xs">Ambil Foto atau Unggah Gambar</span>
                    <span className="text-stone-500 text-[10px]">Mendukung format JPG, PNG, WEBP</span>
                  </div>
                )}
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Deskripsi Ciri-Ciri Gejala Pengamatan Lapangan *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ceritakan apa yang terlihat di lahan (misal: daun bawah menguning, bercak melingkar, daun bolong-bolong, ada ulat kecil di dalam pupus...)"
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                id="btn-run-diagnosis"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-white" />
                    <span>Menganalisis Patogen dengan Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Jalankan Diagnosa Cerdas AI</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: AI Diagnosis Detailed Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-start space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">Diagnosis Gagal</h4>
                <p className="text-[11px] text-rose-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {diagnosisResult ? (
            <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-xl space-y-5">
              {/* Header result */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-800/80 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {diagnosisResult.pathogenType}
                    </span>
                    <span className="text-stone-400 text-xs font-mono">
                      Akurasi: {diagnosisResult.confidencePct}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {diagnosisResult.diseaseName}
                  </h3>
                  <p className="text-xs text-emerald-400 italic font-serif">
                    {diagnosisResult.scientificName}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-center shrink-0">
                  <span className="text-[10px] text-stone-400 block">Tingkat Keparahan</span>
                  <span className="text-xs font-bold text-amber-400 block mt-0.5">
                    {diagnosisResult.severity}
                  </span>
                </div>
              </div>

              {/* Symptoms Summary */}
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs space-y-1">
                <span className="text-stone-400 font-semibold block">Ringkasan Gejala Klinis:</span>
                <p className="text-stone-200 leading-relaxed text-[11px]">
                  {diagnosisResult.symptomsSummary}
                </p>
              </div>

              {/* Two Column Actions: Biological Control vs Chemical Treatment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Pengendalian Hayati / Organik */}
                <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-800/40 space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <h4>Pengendalian Hayati & Organik</h4>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-stone-300">
                    {diagnosisResult.biologicalControl.map((item, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Pengendalian Kimiawi Tepat Dosis */}
                <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                    <FlaskConical className="w-4 h-4" />
                    <h4>Rekomendasi Kimiawi Terukur</h4>
                  </div>
                  <div className="space-y-2">
                    {diagnosisResult.chemicalTreatment.map((chem, i) => (
                      <div key={i} className="p-2 bg-stone-900/90 rounded-lg border border-stone-800/80 text-[11px]">
                        <div className="font-semibold text-stone-200">
                          {chem.activeIngredient} <span className="text-stone-400 font-normal">({chem.brandExamples})</span>
                        </div>
                        <div className="flex items-center justify-between text-stone-400 mt-1">
                          <span>Dosis: <strong className="text-amber-300">{chem.dosage}</strong></span>
                          <span>Masa Tunggu: <strong className="text-white">{chem.safetyPeriodDays} hari</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cultural Practices & Secondary Prevention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-semibold text-stone-300 block">Kultur Teknis Perbaikan Budidaya:</span>
                  <ul className="space-y-1 text-[11px] text-stone-400">
                    {diagnosisResult.culturalPractices.map((tip, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-stone-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-semibold text-stone-300 block">Pencegahan Penularan ke Blok Lain:</span>
                  <ul className="space-y-1 text-[11px] text-stone-400">
                    {diagnosisResult.preventiveTips.map((tip, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Agronomist Final Note */}
              {diagnosisResult.recommendationNote && (
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-300 leading-relaxed">
                  💡 <strong className="text-emerald-400">Pesan Dokter Tanaman:</strong> {diagnosisResult.recommendationNote}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-8 shadow-lg text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-bold text-base text-white">Sistem Diagnosa Hama & Penyakit Siap</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Masukkan gejala yang Anda temukan di lahan atau pilih salah satu contoh gejala di atas, lalu klik <strong>Jalankan Diagnosa Cerdas AI</strong> untuk mendapatkan penanganan terpadu.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Encyclopedia Library: Database HPT Nusantara */}
      <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Ensiklopedia HPT & Patogen Tanaman Nusantara</h3>
              <p className="text-[11px] text-stone-400">Referensi standar gejala dan cara pengendalian mandiri</p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari hama, kresek, patek, ulat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredLibrary.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedLibraryItem(item)}
              className="p-4 rounded-xl bg-stone-950/70 hover:bg-stone-950 border border-stone-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-2 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-900 text-stone-300 border border-stone-800">
                    {item.pathogenType}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">{item.cropTarget}</span>
                </div>
                <h4 className="font-bold text-white text-xs mt-2">{item.localName}</h4>
                <p className="text-[11px] text-stone-400 italic font-serif line-clamp-1">{item.name}</p>
                <p className="text-[11px] text-stone-300 mt-2 line-clamp-2">{item.symptoms[0]}</p>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-emerald-400 font-medium">
                <span>Solusi & Pencegahan</span>
                <span>Detail &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Library Item Detail Modal */}
      {selectedLibraryItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300">
                  {selectedLibraryItem.pathogenType} • {selectedLibraryItem.cropTarget}
                </span>
                <h3 className="font-bold text-base text-white mt-1">{selectedLibraryItem.localName}</h3>
                <p className="text-emerald-400 italic text-[11px]">{selectedLibraryItem.name}</p>
              </div>
              <button
                onClick={() => setSelectedLibraryItem(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-stone-200 mb-1">Gejala Khas Pengamatan:</h4>
                <ul className="space-y-1 text-stone-300 text-[11px]">
                  {selectedLibraryItem.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40">
                <h4 className="font-bold text-emerald-300 mb-1">Solusi Pengendalian Organik/Hayati:</h4>
                <ul className="space-y-1 text-stone-200 text-[11px]">
                  {selectedLibraryItem.organicSolution.map((s, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                <h4 className="font-bold text-amber-300 mb-1">Solusi Kimiawi Rekomendasi:</h4>
                <ul className="space-y-1 text-stone-200 text-[11px]">
                  {selectedLibraryItem.chemicalSolution.map((s, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                onClick={() => setSelectedLibraryItem(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
