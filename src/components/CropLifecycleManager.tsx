import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  X, 
  Filter, 
  Sparkles,
  ClipboardCheck,
  User,
  Layers,
  Coins
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { ActivityLog } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/agriUtils';

export const CropLifecycleManager: React.FC = () => {
  const { blocks, activities, addActivity, updateActivityStatus, deleteActivity } = useFarm();

  const [filterBlockId, setFilterBlockId] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    blockId: blocks.length > 0 ? blocks[0].id : '',
    type: 'pupuk' as ActivityLog['type'],
    title: '',
    date: new Date().toISOString().split('T')[0],
    operator: '',
    cost: 0,
    materialsUsed: [{ name: '', qty: 0, unit: 'kg' }],
    status: 'terjadwal' as ActivityLog['status'],
    notes: ''
  });

  // GAP Checklist State
  const [gapChecklist, setGapChecklist] = useState([
    { id: 'gap-1', text: 'Sanitasi sisa tanaman musim lalu & pengolahan tanah sempurna', done: true },
    { id: 'gap-2', text: 'Perlakuan benih (Seed Treatment) dengan agens hayati sebelum semai', done: true },
    { id: 'gap-3', text: 'Pemupukan dasar berimbang (Organik matang + Fosfat) sebelum tanam', done: true },
    { id: 'gap-4', text: 'Pemasangan refugia & perangkap kuning (Yellow Sticky Trap)', done: false },
    { id: 'gap-5', text: 'Monitoring PHT mingguan & rotasi bahan aktif pestisida', done: true },
    { id: 'gap-6', text: 'Pembersihan dan sterilisasi alsintan sebelum masuk blok lain', done: false }
  ]);

  const toggleGap = (id: string) => {
    setGapChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const filteredActivities = activities.filter(act => {
    const matchBlock = filterBlockId === 'all' || act.blockId === filterBlockId;
    const matchType = filterType === 'all' || act.type === filterType;
    return matchBlock && matchType;
  });

  const handleAddMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materialsUsed: [...prev.materialsUsed, { name: '', qty: 0, unit: 'kg' }]
    }));
  };

  const handleMaterialChange = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const updated = [...prev.materialsUsed];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, materialsUsed: updated };
    });
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materialsUsed: prev.materialsUsed.filter((_, i) => i !== index)
    }));
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.operator) {
      alert('Mohon isi judul kegiatan dan operator pelaksana.');
      return;
    }

    const targetBlock = blocks.find(b => b.id === formData.blockId);
    const blockName = targetBlock ? targetBlock.name : 'Semua Blok';

    const validMaterials = formData.materialsUsed.filter(m => m.name.trim() !== '');

    addActivity({
      blockId: formData.blockId,
      blockName,
      type: formData.type,
      title: formData.title,
      date: formData.date,
      operator: formData.operator,
      cost: formData.cost,
      materialsUsed: validMaterials,
      status: formData.status,
      notes: formData.notes
    });

    setShowAddModal(false);
    // Reset
    setFormData({
      blockId: blocks.length > 0 ? blocks[0].id : '',
      type: 'pupuk',
      title: '',
      date: new Date().toISOString().split('T')[0],
      operator: '',
      cost: 0,
      materialsUsed: [{ name: '', qty: 0, unit: 'kg' }],
      status: 'terjadwal',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-400" />
            Jadwal Kalender Tanam & Log Budidaya (SOP GAP)
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manajemen siklus budidaya harian, riwayat aplikasi pupuk & pestisida, serta kepatuhan SOP pertanian
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-activity"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Log / Jadwal Baru</span>
        </button>
      </div>

      {/* Main Grid: Left Timeline Activities (8 Cols) + Right GAP SOP Checklist (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter and Activity Timeline */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-stone-900/70 p-3 rounded-xl border border-stone-800 text-xs">
            <Filter className="w-4 h-4 text-stone-400 mr-1" />
            <select
              value={filterBlockId}
              onChange={(e) => setFilterBlockId(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-200"
            >
              <option value="all">Semua Blok Lahan</option>
              {blocks.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-200"
            >
              <option value="all">Semua Jenis Kegiatan</option>
              <option value="pupuk">Pemupukan</option>
              <option value="pestisida">Penyemprotan HPT</option>
              <option value="irigasi">Pengairan</option>
              <option value="tanam">Penanaman</option>
              <option value="olah_tanah">Pengolahan Lahan</option>
              <option value="panen">Panen</option>
              <option value="monitoring_hama">Monitoring PHT</option>
              <option value="inspeksi">Inspeksi & Uji</option>
            </select>

            <span className="text-stone-400 ml-auto font-mono text-[11px]">
              {filteredActivities.length} Catatan Ditemukan
            </span>
          </div>

          {/* Activity Cards List */}
          <div className="space-y-3">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="bg-stone-900/90 hover:bg-stone-850 rounded-2xl p-4 border border-stone-800 hover:border-stone-700 transition-all space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      act.type === 'pupuk' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      act.type === 'pestisida' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      act.type === 'panen' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      act.type === 'irigasi' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-stone-800 text-stone-300 border border-stone-700'
                    }`}>
                      {act.type.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{act.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                        <span className="text-emerald-400 font-medium">📍 {act.blockName}</span>
                        <span>•</span>
                        <span className="font-mono">📅 {formatDateIndo(act.date)}</span>
                        <span>•</span>
                        <span>👤 {act.operator}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges & Toggle */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => updateActivityStatus(act.id, act.status === 'selesai' ? 'terjadwal' : 'selesai')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        act.status === 'selesai'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {act.status === 'selesai' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Selesai</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Terjadwal</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus catatan ${act.title}?`)) {
                          deleteActivity(act.id);
                        }
                      }}
                      className="p-1 rounded-lg text-stone-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notes & Materials */}
                {act.notes && (
                  <p className="text-xs text-stone-300 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/80 leading-relaxed">
                    {act.notes}
                  </p>
                )}

                {/* Materials & Cost Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/60 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 text-stone-400 text-[11px]">
                    {act.materialsUsed && act.materialsUsed.length > 0 ? (
                      <>
                        <span className="text-stone-500">Bahan:</span>
                        {act.materialsUsed.map((mat, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800">
                            {mat.name} ({mat.qty} {mat.unit})
                          </span>
                        ))}
                      </>
                    ) : (
                      <span className="text-stone-500">Tanpa penggunaan bahan habis pakai</span>
                    )}
                  </div>

                  {act.cost > 0 && (
                    <div className="font-mono text-emerald-400 font-bold text-xs">
                      Biaya: {formatRupiah(act.cost)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Good Agricultural Practices (GAP) SOP Checklist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-800/80 pb-3">
              <ClipboardCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Checklist Kepatuhan SOP GAP</h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Standar Operasional Prosedur Good Agricultural Practices untuk memastikan mutu hasil panen ramah lingkungan dan bersertifikasi.
            </p>

            <div className="space-y-2.5">
              {gapChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleGap(item.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                    item.done
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-stone-200'
                      : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-stone-900 border-stone-700 cursor-pointer"
                  />
                  <span className={item.done ? 'text-stone-200' : 'text-stone-400'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Progres Kepatuhan SOP:</span>
              <span className="font-bold text-emerald-400">
                {Math.round((gapChecklist.filter(g => g.done).length / gapChecklist.length) * 100)}% Lengkap
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Tambah Log Aktivitas Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-lg text-white">Catat Log & Jadwal Aktivitas Lahan</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Target Blok Lahan *</label>
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
                  <label className="block text-stone-300 font-medium mb-1">Kategori Aktivitas</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="pupuk">Pemupukan</option>
                    <option value="pestisida">Penyemprotan HPT / Fungisida</option>
                    <option value="irigasi">Pengairan / Irigasi</option>
                    <option value="tanam">Penanaman / Semai</option>
                    <option value="olah_tanah">Pengolahan Lahan</option>
                    <option value="panen">Panen</option>
                    <option value="monitoring_hama">Monitoring Wereng / Hama</option>
                    <option value="inspeksi">Inspeksi & Uji Agronomi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Judul / Uraian Pekerjaan *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Aplikasi Pupuk Susulan 1 & Asam Amino"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Operator / Petugas *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Pak Sukardi & Tim 3 Orang"
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              {/* Materials Used Dynamic Fields */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-medium">Bahan Saprotan yang Digunakan</label>
                  <button
                    type="button"
                    onClick={handleAddMaterial}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah Bahan
                  </button>
                </div>

                {formData.materialsUsed.map((mat, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Nama Bahan (misal NPK Phonska)"
                      value={mat.name}
                      onChange={(e) => handleMaterialChange(idx, 'name', e.target.value)}
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-200"
                    />
                    <input
                      type="number"
                      placeholder="Jumlah"
                      value={mat.qty || ''}
                      onChange={(e) => handleMaterialChange(idx, 'qty', parseFloat(e.target.value) || 0)}
                      className="w-20 bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-stone-200 font-mono text-center"
                    />
                    <input
                      type="text"
                      placeholder="Satuan"
                      value={mat.unit}
                      onChange={(e) => handleMaterialChange(idx, 'unit', e.target.value)}
                      className="w-16 bg-stone-950 border border-stone-800 rounded-lg px-2 py-1.5 text-stone-200 text-center"
                    />
                    {formData.materialsUsed.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(idx)}
                        className="p-1.5 text-stone-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Total Biaya Operasional (Rp)</label>
                  <input
                    type="number"
                    value={formData.cost || ''}
                    onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) || 0 })}
                    placeholder="misal: 350000"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Status Kegiatan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="selesai">Selesai Dikerjakan</option>
                    <option value="terjadwal">Terjadwal</option>
                    <option value="tertunda">Tertunda</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Catatan Hasil & Evaluasi</label>
                <textarea
                  rows={2}
                  placeholder="Catatan teknis lapangan..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md"
                >
                  Simpan Catatan Aktivitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
