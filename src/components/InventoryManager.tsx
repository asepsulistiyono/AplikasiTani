import React, { useState } from 'react';
import { 
  Boxes, 
  Tractor, 
  Package, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  X, 
  Search, 
  Wrench, 
  BatteryCharging, 
  Fuel, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { SaprotanItem, AlsintanItem } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/agriUtils';

export const InventoryManager: React.FC = () => {
  const { saprotan, alsintan, addSaprotan, addAlsintan, updateSaprotanStock, deleteSaprotan, deleteAlsintan } = useFarm();

  const [activeSubTab, setActiveSubTab] = useState<'saprotan' | 'alsintan'>('saprotan');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showAddSaprotanModal, setShowAddSaprotanModal] = useState(false);
  const [showAddAlsintanModal, setShowAddAlsintanModal] = useState(false);

  // Saprotan Form
  const [saprotanForm, setSaprotanForm] = useState({
    name: '',
    category: 'pupuk' as SaprotanItem['category'],
    brand: '',
    stockQty: 100,
    minStockThreshold: 20,
    unit: 'kg',
    pricePerUnit: 12000,
    activeIngredient: '',
    expiryDate: '2026-12-31',
    storageLocation: 'Gudang Utama A'
  });

  // Alsintan Form
  const [alsintanForm, setAlsintanForm] = useState({
    name: '',
    type: 'Traktor Roda 4',
    brandModel: '',
    serialNumber: `ALS-${Date.now().toString().slice(-4)}`,
    status: 'baik' as AlsintanItem['status'],
    operatingHours: 10,
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    nextMaintenanceDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    fuelConsumptionLitersPerHour: 4.5,
    assignedOperator: 'Pak Sukardi',
    notes: 'Kondisi prima siap operasional lapangan'
  });

  const handleCreateSaprotan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saprotanForm.name) return;
    addSaprotan(saprotanForm);
    setShowAddSaprotanModal(false);
    setSaprotanForm({
      name: '',
      category: 'pupuk',
      brand: '',
      stockQty: 100,
      minStockThreshold: 20,
      unit: 'kg',
      pricePerUnit: 12000,
      activeIngredient: '',
      expiryDate: '2026-12-31',
      storageLocation: 'Gudang Utama A'
    });
  };

  const handleCreateAlsintan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alsintanForm.name) return;
    addAlsintan(alsintanForm);
    setShowAddAlsintanModal(false);
    setAlsintanForm({
      name: '',
      type: 'Traktor Roda 4',
      brandModel: '',
      serialNumber: `ALS-${Date.now().toString().slice(-4)}`,
      status: 'baik',
      operatingHours: 10,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      nextMaintenanceDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      fuelConsumptionLitersPerHour: 4.5,
      assignedOperator: 'Pak Sukardi',
      notes: 'Kondisi prima siap operasional lapangan'
    });
  };

  const filteredSaprotan = saprotan.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlsintan = alsintan.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = saprotan.filter(s => s.stockQty <= s.minStockThreshold).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            Inventaris Saprotan & Manajemen Alsintan
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Pengawasan stok pupuk, benih, pestisida, serta rekam pemeliharaan mesin pertanian modern
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab === 'saprotan' ? (
            <button
              onClick={() => setShowAddSaprotanModal(true)}
              id="btn-add-saprotan"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Stok Saprotan</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddAlsintanModal(true)}
              id="btn-add-alsintan"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Registrasi Alsintan Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 bg-stone-900/80 p-1 rounded-xl border border-stone-800 self-start">
          <button
            onClick={() => setActiveSubTab('saprotan')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeSubTab === 'saprotan'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Saprotan ({saprotan.length})</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-stone-950 text-[10px] font-bold rounded-full">
                {lowStockCount} Menipis
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('alsintan')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeSubTab === 'alsintan'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>Alsintan & Drone ({alsintan.length})</span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari barang / merk / nomor seri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-emerald-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* View: Saprotan Grid */}
      {activeSubTab === 'saprotan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSaprotan.map((item) => {
            const isLowStock = item.stockQty <= item.minStockThreshold;
            return (
              <div
                key={item.id}
                className={`bg-stone-900/90 rounded-2xl p-4 border transition-all space-y-3 shadow-md flex flex-col justify-between ${
                  isLowStock ? 'border-amber-800/80 bg-amber-950/10' : 'border-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        item.category === 'pupuk' ? 'bg-emerald-500/20 text-emerald-300' :
                        item.category === 'benih' ? 'bg-amber-500/20 text-amber-300' :
                        item.category === 'pestisida' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {item.category}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1.5">{item.name}</h4>
                      <p className="text-[11px] text-stone-400">{item.brand} • {item.storageLocation}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus ${item.name}?`)) deleteSaprotan(item.id);
                      }}
                      className="p-1 rounded text-stone-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.activeIngredient && (
                    <div className="mt-2 text-[10px] text-stone-400 bg-stone-950/60 p-1.5 rounded-lg border border-stone-800/80">
                      Bahan Aktif: <span className="text-stone-300 font-medium">{item.activeIngredient}</span>
                    </div>
                  )}

                  {/* Stock counter */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block">Sisa Stok Fisik</span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className={`text-xl font-bold font-mono ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {item.stockQty}
                        </span>
                        <span className="text-xs text-stone-400">{item.unit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Harga Satuan</span>
                      <span className="text-xs font-mono font-bold text-stone-200">{formatRupiah(item.pricePerUnit)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Restock / Adjust */}
                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-500">Exp: {item.expiryDate}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateSaprotanStock(item.id, Math.max(0, item.stockQty - 5))}
                      className="px-2 py-0.5 rounded bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-700 font-mono"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => updateSaprotanStock(item.id, item.stockQty + 10)}
                      className="px-2 py-0.5 rounded bg-stone-950 hover:bg-stone-800 text-emerald-400 border border-stone-700 font-mono"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Alsintan Grid */}
      {activeSubTab === 'alsintan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlsintan.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 hover:border-stone-700 transition-all space-y-3 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      item.status === 'baik' ? 'bg-emerald-500/20 text-emerald-300' :
                      item.status === 'perlu_servis' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-rose-500/20 text-rose-300'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                    <h4 className="font-bold text-sm text-white mt-1.5">{item.name}</h4>
                    <p className="text-[11px] text-stone-400">{item.brandModel} • S/N: {item.serialNumber}</p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus alsintan ${item.name}?`)) deleteAlsintan(item.id);
                    }}
                    className="p-1 rounded text-stone-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-stone-950/60 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-400 block flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-400" /> Konsumsi BBM
                    </span>
                    <span className="font-bold font-mono text-stone-200">
                      {item.fuelConsumptionLitersPerHour} L / Jam
                    </span>
                  </div>

                  <div className="p-2 bg-stone-950/60 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-400 block flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-400" /> Jam Kerja
                    </span>
                    <span className="font-bold font-mono text-emerald-400">
                      {item.operatingHours} Jam
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-stone-300 bg-stone-950/40 p-2 rounded-lg border border-stone-800/60">
                  <div>Operator: <strong className="text-white">{item.assignedOperator}</strong></div>
                  <div className="text-stone-400 text-[10px] mt-0.5">Servis Berikutnya: {item.nextMaintenanceDate}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-stone-400 line-clamp-1">{item.notes}</span>
                <button
                  onClick={() => alert(`Log servis tercatat untuk ${item.name}`)}
                  className="px-2.5 py-1 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-700 text-[11px] flex items-center gap-1 shrink-0"
                >
                  <Wrench className="w-3 h-3 text-amber-400" />
                  <span>Servis</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Saprotan */}
      {showAddSaprotanModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base text-white">Tambah Data Stok Saprotan</h3>
              <button onClick={() => setShowAddSaprotanModal(false)} className="p-1 rounded text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSaprotan} className="space-y-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Nama Produk / Saprotan *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: NPK Mutiara 16-16-16"
                  value={saprotanForm.name}
                  onChange={(e) => setSaprotanForm({ ...saprotanForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Kategori</label>
                  <select
                    value={saprotanForm.category}
                    onChange={(e) => setSaprotanForm({ ...saprotanForm, category: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="pupuk">Pupuk Organik / Kimia</option>
                    <option value="benih">Benih / Bibit Unggul</option>
                    <option value="pestisida">Pestisida / Fungisida</option>
                    <option value="suplemen">ZPT / Asam Amino</option>
                    <option value="peralatan">Peralatan Habis Pakai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Merk / Pabrik</label>
                  <input
                    type="text"
                    placeholder="misal: Petrokimia Gresik"
                    value={saprotanForm.brand}
                    onChange={(e) => setSaprotanForm({ ...saprotanForm, brand: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Stok Fisik</label>
                  <input
                    type="number"
                    value={saprotanForm.stockQty}
                    onChange={(e) => setSaprotanForm({ ...saprotanForm, stockQty: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Satuan</label>
                  <input
                    type="text"
                    value={saprotanForm.unit}
                    onChange={(e) => setSaprotanForm({ ...saprotanForm, unit: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 text-center"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Harga / Satuan (Rp)</label>
                  <input
                    type="number"
                    value={saprotanForm.pricePerUnit}
                    onChange={(e) => setSaprotanForm({ ...saprotanForm, pricePerUnit: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Lokasi Gudang Penyimpanan</label>
                <input
                  type="text"
                  placeholder="Gudang A - Rak 2"
                  value={saprotanForm.storageLocation}
                  onChange={(e) => setSaprotanForm({ ...saprotanForm, storageLocation: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSaprotanModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Simpan Saprotan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Alsintan */}
      {showAddAlsintanModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base text-white">Registrasi Alat Mesin Pertanian (Alsintan)</h3>
              <button onClick={() => setShowAddAlsintanModal(false)} className="p-1 rounded text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlsintan} className="space-y-3">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Nama Alsintan *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Drone Semprot Agras T40"
                  value={alsintanForm.name}
                  onChange={(e) => setAlsintanForm({ ...alsintanForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Jenis / Tipe</label>
                  <input
                    type="text"
                    placeholder="Drone Spray / Traktor"
                    value={alsintanForm.type}
                    onChange={(e) => setAlsintanForm({ ...alsintanForm, type: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Merk / Model</label>
                  <input
                    type="text"
                    placeholder="Kubota L4018 / DJI"
                    value={alsintanForm.brandModel}
                    onChange={(e) => setAlsintanForm({ ...alsintanForm, brandModel: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Operator Penanggung Jawab</label>
                  <input
                    type="text"
                    value={alsintanForm.assignedOperator}
                    onChange={(e) => setAlsintanForm({ ...alsintanForm, assignedOperator: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Konsumsi Bahan Bakar (L/Jam)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={alsintanForm.fuelConsumptionLitersPerHour}
                    onChange={(e) => setAlsintanForm({ ...alsintanForm, fuelConsumptionLitersPerHour: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddAlsintanModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Simpan Alsintan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
