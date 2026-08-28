import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  Droplets, 
  Sprout, 
  Sparkles, 
  FlaskConical, 
  CalendarPlus, 
  Trash2, 
  Edit3, 
  X, 
  Layers, 
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { FarmBlock, CropType, GrowthStage } from '../types';
import { formatNumber, formatDateIndo } from '../utils/agriUtils';

export const FieldBlockManager: React.FC = () => {
  const { 
    blocks, 
    addBlock, 
    updateBlock, 
    deleteBlock, 
    toggleIrrigation, 
    selectedBlockId, 
    setSelectedBlockId, 
    setActiveTab 
  } = useFarm();

  const [filterCrop, setFilterCrop] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<FarmBlock | null>(null);

  // Form State for new block
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    areaHa: 1.0,
    cropType: 'Padi Sawah' as CropType,
    cropVariety: '',
    plantingDate: new Date().toISOString().split('T')[0],
    estimatedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    growthStage: 'Vegetatif Awal' as GrowthStage,
    ageDays: 14,
    healthScore: 90,
    soilMoisturePct: 70,
    soilPh: 6.5,
    soilTemperatureC: 26.5,
    npkPpm: { nitrogen: 140, phosphorus: 40, potassium: 180 },
    irrigationStatus: 'idle' as 'active' | 'scheduled' | 'idle',
    irrigationType: 'drip' as 'drip' | 'sprinkler' | 'flood' | 'smart_valve',
    irrigationSchedule: 'Setiap hari 07:00 & 16:00',
    waterFlowRateLpm: 0,
    locationName: 'Karawang, Jawa Barat',
    targetYieldTon: 10.0,
    notes: '',
    color: '#10B981'
  });

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || (blocks.length > 0 ? blocks[0] : null);

  const filteredBlocks = filterCrop === 'all' 
    ? blocks 
    : blocks.filter(b => b.cropType === filterCrop);

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cropVariety) {
      alert('Mohon lengkapi nama blok dan varietas tanaman.');
      return;
    }

    addBlock({
      ...formData,
      code: formData.code || `BK-${String(blocks.length + 1).padStart(2, '0')}`
    });

    setShowAddModal(false);
    // Reset form
    setFormData({
      name: '',
      code: '',
      areaHa: 1.0,
      cropType: 'Padi Sawah',
      cropVariety: '',
      plantingDate: new Date().toISOString().split('T')[0],
      estimatedHarvestDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      growthStage: 'Vegetatif Awal',
      ageDays: 14,
      healthScore: 90,
      soilMoisturePct: 70,
      soilPh: 6.5,
      soilTemperatureC: 26.5,
      npkPpm: { nitrogen: 140, phosphorus: 40, potassium: 180 },
      irrigationStatus: 'idle',
      irrigationType: 'drip',
      irrigationSchedule: 'Setiap hari 07:00 & 16:00',
      waterFlowRateLpm: 0,
      locationName: 'Karawang, Jawa Barat',
      targetYieldTon: 10.0,
      notes: '',
      color: '#10B981'
    });
  };

  const handleUpdateBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlock) return;
    updateBlock(editingBlock.id, editingBlock);
    setEditingBlock(null);
  };

  const cropOptions: CropType[] = [
    'Padi Sawah',
    'Jagung Hibrida',
    'Cabai Merah Keriting',
    'Bawang Merah',
    'Tomat Sayur',
    'Kelapa Sawit',
    'Kopi Arabika',
    'Kedelai',
    'Melon Golden',
    'Sayuran Hidroponik'
  ];

  const stageOptions: GrowthStage[] = [
    'Pengolahan Lahan',
    'Persemaian',
    'Vegetatif Awal',
    'Vegetatif Aktif',
    'Generatif/Bunting',
    'Pembungaan & Pembuahan',
    'Pematangan Bulir/Buah',
    'Siap Panen',
    'Masa Bera/Istirahat'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Manajemen Blok & Pemetaan Zonasi Lahan
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Total {blocks.length} blok petak lahan terdaftar • {blocks.reduce((a, b) => a + b.areaHa, 0).toFixed(1)} Hektar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Crop Filter */}
          <select
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Komoditas ({blocks.length})</option>
            {cropOptions.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>

          {/* Add Block Button */}
          <button
            onClick={() => setShowAddModal(true)}
            id="btn-add-block"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Blok Lahan</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Left Grid of Blocks + Right Detailed Agronomy Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Grid of Plots (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBlocks.map((block) => {
              const isSelected = selectedBlock?.id === block.id;
              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-stone-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl shadow-emerald-950/40'
                      : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-3.5 h-3.5 rounded-md shadow-sm" 
                          style={{ backgroundColor: block.color }}
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">{block.name}</h4>
                          <span className="text-[10px] text-stone-400 font-mono">{block.code}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800 font-mono">
                        {block.areaHa} Ha
                      </span>
                    </div>

                    {/* Commodity info */}
                    <div className="mt-3 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 text-xs">
                      <div className="flex items-center justify-between text-stone-300">
                        <span className="font-medium">{block.cropType}</span>
                        <span className="text-emerald-400 font-mono font-semibold">{block.cropVariety}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
                        <span>Fase: {block.growthStage}</span>
                        <span className="text-amber-400 font-bold">{block.ageDays} HST</span>
                      </div>
                    </div>

                    {/* Sensor Soil Gauges */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-stone-950/40 border border-stone-800/60">
                        <span className="text-stone-500 text-[10px] block">Kelembaban</span>
                        <span className={`font-bold ${block.soilMoisturePct < 60 ? 'text-amber-400' : 'text-cyan-300'}`}>
                          {block.soilMoisturePct}% Lengas
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-950/40 border border-stone-800/60">
                        <span className="text-stone-500 text-[10px] block">Target Hasil</span>
                        <span className="font-bold text-stone-200">
                          {block.targetYieldTon} Ton
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Irrigation toggle bar */}
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-medium truncate max-w-[140px]">
                      📍 {block.locationName.split(',')[0]}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleIrrigation(block.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-all ${
                        block.irrigationStatus === 'active'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      <Droplets className="w-3 h-3" />
                      <span>{block.irrigationStatus === 'active' ? 'Katup ON' : 'Katup OFF'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Block Agronomy Detail & Controls (5 Cols) */}
        <div className="lg:col-span-5">
          {selectedBlock ? (
            <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-xl sticky top-24 space-y-5">
              {/* Header Details */}
              <div className="flex items-start justify-between border-b border-stone-800/80 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: selectedBlock.color }}
                    />
                    <h3 className="font-bold text-base text-white">{selectedBlock.name}</h3>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Kode: <span className="font-mono text-emerald-400">{selectedBlock.code}</span> • Lokasi: {selectedBlock.locationName}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setEditingBlock(selectedBlock)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors"
                    title="Edit Data Blok"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus data ${selectedBlock.name}?`)) {
                        deleteBlock(selectedBlock.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 border border-stone-700 transition-colors"
                    title="Hapus Blok"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Crop & Lifecycle Card */}
              <div className="bg-stone-950/80 rounded-xl p-3.5 border border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Komoditas & Varietas:</span>
                  <span className="font-semibold text-white">{selectedBlock.cropType} ({selectedBlock.cropVariety})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Tanggal Tanam:</span>
                  <span className="text-stone-200 font-mono">{formatDateIndo(selectedBlock.plantingDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Estimasi Panen:</span>
                  <span className="text-amber-300 font-mono font-semibold">{formatDateIndo(selectedBlock.estimatedHarvestDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Umur Tanaman (HST):</span>
                  <span className="font-bold text-emerald-400">{selectedBlock.ageDays} Hari Setelah Tanam</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Target Panen:</span>
                  <span className="text-stone-200 font-bold">{selectedBlock.targetYieldTon} Ton ({(selectedBlock.targetYieldTon / selectedBlock.areaHa).toFixed(1)} Ton/Ha)</span>
                </div>
              </div>

              {/* Soil & NPK Nutrition Matrix */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-stone-300 block">
                  Telemetri Kimia & Fisika Tanah (Sensor Lahan)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Nitrogen (N)</span>
                    <span className="font-bold text-emerald-400 font-mono">{selectedBlock.npkPpm.nitrogen} ppm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Fosfor (P)</span>
                    <span className="font-bold text-amber-400 font-mono">{selectedBlock.npkPpm.phosphorus} ppm</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Kalium (K)</span>
                    <span className="font-bold text-cyan-400 font-mono">{selectedBlock.npkPpm.potassium} ppm</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Derajat Keasaman (pH)</span>
                    <span className="font-bold text-indigo-300 font-mono">{selectedBlock.soilPh} (Netral Ideal)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Suhu Tanah</span>
                    <span className="font-bold text-rose-300 font-mono">{selectedBlock.soilTemperatureC}°C</span>
                  </div>
                </div>
              </div>

              {/* Irrigation System Details */}
              <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    Sistem Pengairan:
                  </span>
                  <span className="font-semibold text-cyan-300 uppercase tracking-wider text-[11px]">
                    {selectedBlock.irrigationType.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Jadwal: <span className="text-stone-300">{selectedBlock.irrigationSchedule}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-stone-400">Debit Aliran:</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedBlock.waterFlowRateLpm} Liter / Menit</span>
                </div>
              </div>

              {/* Quick Agronomic Operations Links */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => setActiveTab('clinic')}
                  className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scan Penyakit</span>
                </button>
                <button
                  onClick={() => setActiveTab('fertilizer')}
                  className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hitung Dosis Pupuk</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-900/60 rounded-2xl border border-stone-800 text-stone-400">
              <Sprout className="w-10 h-10 mx-auto text-stone-600 mb-2" />
              <p className="text-sm">Pilih salah satu blok lahan di samping untuk melihat rincian agronomi.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Blok Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-lg text-white">Tambah Petak / Blok Lahan Baru</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Nama Blok *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Blok Sawah Utara 2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Luas Lahan (Hektar) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.areaHa}
                    onChange={(e) => setFormData({ ...formData, areaHa: parseFloat(e.target.value) || 0.1 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Komoditas Tanaman</label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value as CropType })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500"
                  >
                    {cropOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Varietas Benih / Bibit *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Inpari 32 HDB / Pioneer P35"
                    value={formData.cropVariety}
                    onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Fase Pertumbuhan</label>
                  <select
                    value={formData.growthStage}
                    onChange={(e) => setFormData({ ...formData, growthStage: e.target.value as GrowthStage })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500"
                  >
                    {stageOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Umur Tanaman (HST)</label>
                  <input
                    type="number"
                    value={formData.ageDays}
                    onChange={(e) => setFormData({ ...formData, ageDays: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Metode Irigasi</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="drip">Drip / Tetes Presisi</option>
                    <option value="sprinkler">Sprinkler / Kabut</option>
                    <option value="smart_valve">Smart Valve Sawah</option>
                    <option value="flood">Genangan / Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Target Panen (Ton)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.targetYieldTon}
                    onChange={(e) => setFormData({ ...formData, targetYieldTon: parseFloat(e.target.value) || 1 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Lokasi Lahan</label>
                <input
                  type="text"
                  placeholder="misal: Karawang Barat, Jawa Barat"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950/40"
                >
                  Simpan Blok Lahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Blok */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-lg text-white">Edit Data Blok: {editingBlock.name}</h3>
              <button 
                onClick={() => setEditingBlock(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBlockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Nama Blok</label>
                <input
                  type="text"
                  required
                  value={editingBlock.name}
                  onChange={(e) => setEditingBlock({ ...editingBlock, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Fase Pertumbuhan</label>
                  <select
                    value={editingBlock.growthStage}
                    onChange={(e) => setEditingBlock({ ...editingBlock, growthStage: e.target.value as GrowthStage })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    {stageOptions.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Umur Tanaman (HST)</label>
                  <input
                    type="number"
                    value={editingBlock.ageDays}
                    onChange={(e) => setEditingBlock({ ...editingBlock, ageDays: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Kelembaban (%)</label>
                  <input
                    type="number"
                    value={editingBlock.soilMoisturePct}
                    onChange={(e) => setEditingBlock({ ...editingBlock, soilMoisturePct: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">pH Tanah</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingBlock.soilPh}
                    onChange={(e) => setEditingBlock({ ...editingBlock, soilPh: parseFloat(e.target.value) || 6.5 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Skor Kesehatan</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingBlock.healthScore}
                    onChange={(e) => setEditingBlock({ ...editingBlock, healthScore: parseInt(e.target.value) || 90 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Catatan Lapangan</label>
                <textarea
                  rows={2}
                  value={editingBlock.notes}
                  onChange={(e) => setEditingBlock({ ...editingBlock, notes: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Perbarui Blok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
