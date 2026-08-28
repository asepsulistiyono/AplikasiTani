import React, { useState } from 'react';
import { 
  FlaskConical, 
  Sparkles, 
  CalendarPlus, 
  CheckCircle2, 
  Info, 
  Coins, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Droplets
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { CropType, FertilizerCalculationInput, FertilizerPlan } from '../types';
import { calculateFertilizerPlan, formatRupiah, formatNumber } from '../utils/agriUtils';

export const SmartFertilizerCalculator: React.FC = () => {
  const { blocks, addActivity, setActiveTab } = useFarm();

  const [selectedBlockId, setSelectedBlockId] = useState<string>(blocks.length > 0 ? blocks[0].id : 'custom');

  const [inputData, setInputData] = useState<FertilizerCalculationInput>({
    cropType: 'Padi Sawah',
    areaHa: 1.0,
    targetYieldTonHa: 7.0,
    soilCondition: 'Sedang / Normal',
    soilPh: 6.5,
    irrigationType: 'Irigasi Teknis',
    organicBaseApplied: true
  });

  const [activePlan, setActivePlan] = useState<FertilizerPlan>(() => calculateFertilizerPlan(inputData));
  const [scheduledSuccess, setScheduledSuccess] = useState(false);

  // When block selection changes
  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
    if (blockId !== 'custom') {
      const b = blocks.find(x => x.id === blockId);
      if (b) {
        const newInput: FertilizerCalculationInput = {
          cropType: b.cropType,
          areaHa: b.areaHa,
          targetYieldTonHa: +(b.targetYieldTon / b.areaHa).toFixed(1),
          soilCondition: b.soilPh < 6.0 ? 'Kurang Subur / Kritis' : 'Sedang / Normal',
          soilPh: b.soilPh,
          irrigationType: b.irrigationType === 'drip' ? 'Tetes / Fertigasi' : 'Irigasi Teknis',
          organicBaseApplied: true
        };
        setInputData(newInput);
        setActivePlan(calculateFertilizerPlan(newInput));
      }
    }
  };

  const handleRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = calculateFertilizerPlan(inputData);
    setActivePlan(plan);
    setScheduledSuccess(false);
  };

  const handlePushToCalendar = () => {
    const targetBlock = blocks.find(b => b.id === selectedBlockId);
    const blockName = targetBlock ? targetBlock.name : `Blok Mandiri ${inputData.cropType}`;
    const blockId = targetBlock ? targetBlock.id : `custom-${Date.now()}`;

    const now = new Date();

    activePlan.schedules.forEach((sch, idx) => {
      const scheduleDate = new Date(now.getTime() + (idx * 14) * 86400000).toISOString().split('T')[0];
      const materials = sch.fertilizers.map(f => ({
        name: f.name,
        qty: f.amountKg,
        unit: 'kg'
      }));

      addActivity({
        blockId,
        blockName,
        type: 'pupuk',
        title: `Pemupukan Presisi: ${sch.timing}`,
        date: scheduleDate,
        operator: 'Tim Pemupukan Presisi',
        cost: Math.round(activePlan.estimatedCostRupiah / activePlan.schedules.length),
        materialsUsed: materials,
        status: idx === 0 ? 'selesai' : 'terjadwal',
        notes: `${sch.applicationMethod}. ${sch.notes}`
      });
    });

    setScheduledSuccess(true);
    setTimeout(() => {
      setScheduledSuccess(false);
    }, 4000);
  };

  const cropOptions: CropType[] = [
    'Padi Sawah',
    'Jagung Hibrida',
    'Cabai Merah Keriting',
    'Bawang Merah',
    'Tomat Sayur',
    'Kopi Arabika',
    'Kelapa Sawit',
    'Kedelai'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Presisi 5T (Tepat Dosis, Tepat Jenis, Tepat Waktu, Tepat Cara, Tepat Sasaran)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            Kalkulator & Manajemen Nutrisi Pemupukan Presisi
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Formulasi pupuk makro & mikro berdasarkan target panen, luas areal, dan uji pH tanah lapangan
          </p>
        </div>

        {/* Sync with existing block dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-stone-400">Pilih Lahan:</span>
          <select
            value={selectedBlockId}
            onChange={(e) => handleBlockSelect(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="custom">Kustom / Lahan Baru</option>
            {blocks.map(b => (
              <option key={b.id} value={b.id}>{b.name} ({b.cropType})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Input Parameters (5 Cols) + Plan Recommendation (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Parameters */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800/80 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Parameter Agroklimat & Target Panen
            </h3>

            <form onSubmit={handleRecalculate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Komoditas</label>
                  <select
                    value={inputData.cropType}
                    onChange={(e) => setInputData({ ...inputData, cropType: e.target.value as CropType })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    {cropOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Luas Lahan (Ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={inputData.areaHa}
                    onChange={(e) => setInputData({ ...inputData, areaHa: parseFloat(e.target.value) || 0.1 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Target Hasil (Ton/Ha)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={inputData.targetYieldTonHa}
                    onChange={(e) => setInputData({ ...inputData, targetYieldTonHa: parseFloat(e.target.value) || 1 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Kondisi Kesuburan Tanah</label>
                  <select
                    value={inputData.soilCondition}
                    onChange={(e) => setInputData({ ...inputData, soilCondition: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="Sangat Subur">Sangat Subur (Bekas Legum/Kompos)</option>
                    <option value="Sedang / Normal">Sedang / Normal</option>
                    <option value="Kurang Subur / Kritis">Kurang Subur / Kritis Masam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">pH Tanah Aktual</label>
                  <input
                    type="number"
                    step="0.1"
                    min="4.0"
                    max="8.5"
                    value={inputData.soilPh}
                    onChange={(e) => setInputData({ ...inputData, soilPh: parseFloat(e.target.value) || 6.5 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Sistem Pengairan</label>
                  <select
                    value={inputData.irrigationType}
                    onChange={(e) => setInputData({ ...inputData, irrigationType: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="Irigasi Teknis">Irigasi Teknis Sawah</option>
                    <option value="Tetes / Fertigasi">Tetes / Fertigasi Presisi</option>
                    <option value="Sprinkler">Sprinkler / Kabut</option>
                    <option value="Tadah Hujan">Tadah Hujan</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="chk-organic"
                  checked={inputData.organicBaseApplied}
                  onChange={(e) => setInputData({ ...inputData, organicBaseApplied: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-0 bg-stone-900 border-stone-700"
                />
                <label htmlFor="chk-organic" className="text-stone-300 cursor-pointer">
                  Telah diaplikasikan pupuk kandang / kompos dasar
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-2 transition-colors shadow-md"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Hitung Ulang Rekomendasi Dosis</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Recommendation Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-xl space-y-5">
            {/* Header Totals */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-4">
              <div>
                <h3 className="font-bold text-base text-white">
                  Kebutuhan Nutrisi Total ({inputData.areaHa} Ha - {inputData.cropType})
                </h3>
                <p className="text-xs text-stone-400">
                  Target Panen: <strong className="text-amber-300">{(inputData.targetYieldTonHa * inputData.areaHa).toFixed(1)} Ton Total</strong>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">Estimasi Biaya Pupuk</span>
                <span className="text-base font-mono font-bold text-emerald-400">
                  {formatRupiah(activePlan.estimatedCostRupiah)}
                </span>
              </div>
            </div>

            {/* Metric Totals Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Urea (N)</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {activePlan.totalUreaKg.toLocaleString('id-ID')} kg
                </span>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">NPK Mutiara</span>
                <span className="text-sm font-bold text-teal-300 font-mono">
                  {activePlan.totalNpkKg.toLocaleString('id-ID')} kg
                </span>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">SP-36 (P)</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {activePlan.totalSp36Kg.toLocaleString('id-ID')} kg
                </span>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">KCl (K)</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  {activePlan.totalKclKg.toLocaleString('id-ID')} kg
                </span>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Dolomit (Ca/Mg)</span>
                <span className="text-sm font-bold text-indigo-300 font-mono">
                  {activePlan.totalDolomitKg.toLocaleString('id-ID')} kg
                </span>
              </div>

              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Kompos Matang</span>
                <span className="text-sm font-bold text-stone-200 font-mono">
                  {activePlan.totalOrganicKg.toLocaleString('id-ID')} kg
                </span>
              </div>
            </div>

            {/* Phased Application Schedules */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-white">Jadwal Tahapan Aplikasi Pupuk Berimbang:</h4>
              <div className="space-y-2.5">
                {activePlan.schedules.map((sch, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 text-xs">
                        Tahap {idx + 1}: {sch.timing}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {sch.fertilizers.reduce((a, b) => a + b.amountKg, 0)} kg total
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {sch.fertilizers.map((f, fIdx) => (
                        <span key={fIdx} className="px-2 py-0.5 rounded bg-stone-900 text-stone-200 border border-stone-700 text-[11px] font-mono">
                          {f.name}: <strong>{f.amountKg} kg</strong>
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-stone-300 leading-relaxed">
                      👉 <strong>Metode:</strong> {sch.applicationMethod}
                    </p>
                    <p className="text-[10px] text-stone-400 italic">
                      💡 {sch.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agronomy Tips */}
            <div className="p-3.5 bg-emerald-950/20 rounded-xl border border-emerald-800/40 text-[11px] text-stone-300 space-y-1">
              <span className="font-semibold text-emerald-300 block">Rekomendasi Agronomi Tanah:</span>
              <ul className="space-y-1">
                {activePlan.agronomyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action to Push to Calendar */}
            <div className="pt-2 flex items-center justify-between">
              {scheduledSuccess ? (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3 Tahap Pemupukan Berhasil Dijadwalkan ke Kalender!</span>
                </div>
              ) : (
                <div className="text-[11px] text-stone-400">
                  Sinkronisasikan rekomendasi ini langsung ke penugasan harian
                </div>
              )}

              <button
                onClick={handlePushToCalendar}
                id="btn-schedule-fertilizer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Jadwalkan ke SOP Kalender</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
