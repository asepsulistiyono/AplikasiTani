import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Trash2, 
  X, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar,
  Layers,
  Coins,
  Scale
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { HarvestRecord, YieldPredictionResult } from '../types';
import { formatRupiah, formatNumber, formatDateIndo } from '../utils/agriUtils';

export const HarvestYieldManager: React.FC = () => {
  const { blocks, harvests, addHarvest, deleteHarvest, weather } = useFarm();

  const [showAddModal, setShowAddModal] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<YieldPredictionResult | null>(null);
  const [selectedBlockForPrediction, setSelectedBlockForPrediction] = useState<string>(blocks.length > 0 ? blocks[0].id : '');

  // Form
  const [formData, setFormData] = useState({
    blockId: blocks.length > 0 ? blocks[0].id : '',
    harvestDate: new Date().toISOString().split('T')[0],
    actualYieldKg: 6500,
    qualityGrade: 'A' as HarvestRecord['qualityGrade'],
    moistureContentPct: 14.0,
    unitPriceRupiah: 6800,
    buyerName: 'Bulog Divre Jabar',
    postHarvestProcess: 'Pengeringan Bed Dryer 14% KA',
    notes: 'Kualitas butir bening, rendemen giling 68%'
  });

  const totalHarvestKg = harvests.reduce((acc, h) => acc + h.actualYieldKg, 0);
  const totalRevenue = harvests.reduce((acc, h) => acc + (h.totalRevenue || (h.actualYieldKg * h.unitPriceRupiah)), 0);

  const handleCreateHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const b = blocks.find(x => x.id === formData.blockId);
    const cropType = b ? b.cropType : 'Padi Sawah';
    const cropVariety = b ? b.cropVariety : 'Inpari 32';
    const blockName = b ? b.name : 'Blok Sawah';

    addHarvest({
      blockId: formData.blockId,
      blockName,
      cropType,
      cropVariety,
      harvestDate: formData.harvestDate,
      actualYieldKg: formData.actualYieldKg,
      qualityGrade: formData.qualityGrade,
      moistureContentPct: formData.moistureContentPct,
      unitPriceRupiah: formData.unitPriceRupiah,
      totalRevenue: formData.actualYieldKg * formData.unitPriceRupiah,
      buyerName: formData.buyerName,
      postHarvestProcess: formData.postHarvestProcess,
      notes: formData.notes
    });

    setShowAddModal(false);
  };

  const handleRunAiPrediction = async () => {
    const targetBlock = blocks.find(b => b.id === selectedBlockForPrediction);
    if (!targetBlock) return;

    setIsPredicting(true);
    setPredictionResult(null);

    try {
      const res = await fetch('/api/ai/predict-yield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockName: targetBlock.name,
          cropType: targetBlock.cropType,
          cropVariety: targetBlock.cropVariety,
          areaHa: targetBlock.areaHa,
          ageDays: targetBlock.ageDays,
          healthScore: targetBlock.healthScore,
          soilPh: targetBlock.soilPh,
          soilMoisturePct: targetBlock.soilMoisturePct,
          weatherSummary: `Suhu ${weather[0]?.tempMax}°C, Cuaca ${weather[0]?.condition}, Peluang Hujan ${weather[0]?.rainProbPct}%`
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPredictionResult(json.data);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memprediksi hasil panen. Pastikan server aktif.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            Manajemen Panen, Pascapanen & Prediksi AI Tonase
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Rekam tonase realisasi, kadar air (KA), mutu rendemen giling, dan proyeksi hasil panen berbasis agrometeorologi
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-harvest"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Realisasi Panen</span>
        </button>
      </div>

      {/* KPI Cards for Harvests */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-medium">Total Akumulasi Panen</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{(totalHarvestKg / 1000).toFixed(2)}</span>
            <span className="text-xs font-semibold text-emerald-400">Tonase</span>
          </div>
          <p className="text-[11px] text-stone-500">{totalHarvestKg.toLocaleString('id-ID')} Kg komoditas dipanen</p>
        </div>

        <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-medium">Total Pendapatan Panen</span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-emerald-400">{formatRupiah(totalRevenue)}</span>
          </div>
          <p className="text-[11px] text-stone-500">Dari {harvests.length} transaksi penjualan hasil</p>
        </div>

        <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-1">
          <span className="text-xs text-stone-400 font-medium">Kadar Air Rata-rata</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-cyan-300">13.8%</span>
            <span className="text-xs text-emerald-400 font-semibold">Standar Kering Giling</span>
          </div>
          <p className="text-[11px] text-stone-500">Aman simpan silo & gudang</p>
        </div>
      </div>

      {/* AI Yield Forecaster Banner / Interactive Box */}
      <div className="bg-stone-900/90 rounded-2xl border border-emerald-800/40 p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Model Prediksi Hasil Panen & Harga Pasar AI</h3>
              <p className="text-[11px] text-stone-400">
                Analisis kombinasi sensor tanah, umur tanaman (HST), varietas, dan ramalan cuaca
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedBlockForPrediction}
              onChange={(e) => setSelectedBlockForPrediction(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200"
            >
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.cropType} - {b.ageDays} HST)</option>
              ))}
            </select>

            <button
              onClick={handleRunAiPrediction}
              disabled={isPredicting}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              {isPredicting ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Menghitung...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Prediksi AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prediction Results Box */}
        {predictionResult && (
          <div className="p-4 bg-stone-950 rounded-xl border border-emerald-800/50 space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Proyeksi Tonase</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  {predictionResult.estimatedYieldTon} Ton
                </span>
                <span className="text-[10px] text-stone-500 block">
                  ({predictionResult.estimatedYieldTonPerHa} Ton/Ha)
                </span>
              </div>

              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Tingkat Keyakinan</span>
                <span className="text-lg font-bold text-cyan-300 font-mono">
                  {predictionResult.confidencePct}%
                </span>
                <span className="text-[10px] text-emerald-400 block">Tinggi</span>
              </div>

              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Jendela Panen Ideal</span>
                <span className="text-xs font-bold text-amber-300 font-mono block mt-1">
                  {predictionResult.optimalHarvestWindow}
                </span>
              </div>

              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Proyeksi Nilai Pasar</span>
                <span className="text-xs font-bold text-emerald-300 font-mono block mt-1">
                  {predictionResult.marketPriceProjection}
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="font-semibold text-stone-300">Faktor Penentu & Risiko Agroklimat:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-stone-400">
                {predictionResult.riskFactors.map((r, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {predictionResult.postHarvestAdvice && (
              <div className="p-2.5 bg-stone-900 rounded-lg border border-stone-800 text-[11px] text-stone-300">
                💡 <strong className="text-emerald-400">Saran Pascapanen:</strong> {predictionResult.postHarvestAdvice}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Harvest Records List */}
      <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800/80 pb-3">
          <Scale className="w-4 h-4 text-emerald-400" />
          Daftar Rekam Realisasi Panen & Pascapanen
        </h3>

        <div className="space-y-3">
          {harvests.map((h) => (
            <div
              key={h.id}
              className="p-4 rounded-xl bg-stone-950/70 hover:bg-stone-950 border border-stone-800 hover:border-stone-700 transition-all space-y-2 text-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Grade {h.qualityGrade}
                  </span>
                  <h4 className="font-bold text-white text-sm">{h.blockName}</h4>
                  <span className="text-stone-400 text-[11px]">({h.cropType} - {h.cropVariety})</span>
                </div>
                <div className="text-[11px] text-stone-400 flex flex-wrap gap-2">
                  <span>📅 Tanggal: <strong className="text-stone-200">{formatDateIndo(h.harvestDate)}</strong></span>
                  <span>•</span>
                  <span>Kadar Air: <strong className="text-cyan-300">{h.moistureContentPct}%</strong></span>
                  <span>•</span>
                  <span>Pembeli: <strong className="text-stone-200">{h.buyerName}</strong></span>
                </div>
                <p className="text-[11px] text-stone-400 italic">{h.postHarvestProcess}. {h.notes}</p>
              </div>

              <div className="flex items-center space-x-4 shrink-0">
                <div className="text-right">
                  <span className="text-base font-bold text-white font-mono block">
                    {h.actualYieldKg.toLocaleString('id-ID')} Kg
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {formatRupiah(h.totalRevenue)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Hapus catatan panen ${h.blockName}?`)) deleteHarvest(h.id);
                  }}
                  className="p-1 text-stone-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Harvest */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base text-white">Catat Realisasi Panen Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHarvest} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Blok Lahan *</label>
                  <select
                    value={formData.blockId}
                    onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    {blocks.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.cropType})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tanggal Panen</label>
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Berat Total (Kg) *</label>
                  <input
                    type="number"
                    required
                    value={formData.actualYieldKg}
                    onChange={(e) => setFormData({ ...formData, actualYieldKg: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Mutu / Grade</label>
                  <select
                    value={formData.qualityGrade}
                    onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="Super">Super Premium</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Kadar Air (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.moistureContentPct}
                    onChange={(e) => setFormData({ ...formData, moistureContentPct: parseFloat(e.target.value) || 14 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Harga Jual per Kg (Rp)</label>
                  <input
                    type="number"
                    value={formData.unitPriceRupiah}
                    onChange={(e) => setFormData({ ...formData, unitPriceRupiah: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Pembeli / Mitra Serap</label>
                  <input
                    type="text"
                    placeholder="misal: Bulog / Pasar Induk"
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Metode Pascapanen & Penyimpanan</label>
                <input
                  type="text"
                  placeholder="misal: Pengeringan Bed Dryer 14% KA & Silo Hermetis"
                  value={formData.postHarvestProcess}
                  onChange={(e) => setFormData({ ...formData, postHarvestProcess: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Simpan Catatan Panen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
