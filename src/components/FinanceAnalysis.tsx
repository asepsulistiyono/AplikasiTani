import React, { useState } from 'react';
import { 
  TrendingUp, 
  Coins, 
  Plus, 
  Download, 
  Trash2, 
  X, 
  Layers, 
  CheckCircle2, 
  Calculator, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Transaction } from '../types';
import { formatRupiah, formatNumber, formatDateIndo, calculateFinancialMetrics, exportFarmDataToJson, exportTransactionsToCsv } from '../utils/agriUtils';

export const FinanceAnalysis: React.FC = () => {
  const { blocks, activities, harvests, transactions, saprotan, alsintan, addTransaction, deleteTransaction } = useFarm();

  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');

  const [formData, setFormData] = useState({
    type: 'pengeluaran' as Transaction['type'],
    category: 'pupuk' as Transaction['category'],
    amount: 500000,
    date: new Date().toISOString().split('T')[0],
    description: '',
    blockId: blocks.length > 0 ? blocks[0].id : '',
    receiptNumber: `INV-${Date.now().toString().slice(-4)}`
  });

  const metrics = calculateFinancialMetrics(transactions, harvests);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || formData.amount <= 0) return;

    addTransaction(formData);
    setShowAddModal(false);
    setFormData({
      type: 'pengeluaran',
      category: 'pupuk',
      amount: 500000,
      date: new Date().toISOString().split('T')[0],
      description: '',
      blockId: blocks.length > 0 ? blocks[0].id : '',
      receiptNumber: `INV-${Date.now().toString().slice(-4)}`
    });
  };

  const handleExportJson = () => {
    exportFarmDataToJson(blocks, activities, harvests, transactions, saprotan, alsintan);
  };

  const handleExportCsv = () => {
    exportTransactionsToCsv(transactions);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 p-5 rounded-2xl border border-stone-800 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Analisis Keuangan Usahatani, HPP & Kelayakan Ekonomi
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Perhitungan Harga Pokok Produksi (HPP), R/C Ratio, B/C Ratio, Break Even Point (BEP), dan pembukuan kas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Cadangkan JSON</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            id="btn-add-transaction"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Kas</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Revenue, Expense, Net Profit, R/C Ratio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Total Pendapatan</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {formatRupiah(metrics.totalIncome)}
          </div>
          <span className="text-[10px] text-stone-500 block">Hasil penjualan gabah & komoditas</span>
        </div>

        <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Total Biaya Operasional</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono">
            {formatRupiah(metrics.totalExpense)}
          </div>
          <span className="text-[10px] text-stone-500 block">Saprotan, tenaga kerja, alsintan</span>
        </div>

        <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Laba Bersih (Net Profit)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className={`text-xl font-bold font-mono ${metrics.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatRupiah(metrics.netProfit)}
          </div>
          <span className="text-[10px] text-stone-500 block">Margin Keuntungan Bersih</span>
        </div>

        <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>R/C Ratio & HPP</span>
            <Calculator className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-cyan-300 font-mono">{metrics.rcRatio.toFixed(2)}</span>
            <span className="text-xs font-semibold text-emerald-400 font-mono">(Layak Usaha)</span>
          </div>
          <span className="text-[10px] text-stone-500 block">
            HPP: {formatRupiah(metrics.hppPerKg)} / Kg
          </span>
        </div>
      </div>

      {/* Two Column Layout: Cost Breakdown & Transactions Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Cost Category Breakdown & Break Even Point */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category Breakdown */}
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-stone-800/80 pb-3">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Struktur Alokasi Biaya Usahatani
            </h3>

            <div className="space-y-2.5">
              {Object.entries(metrics.expenseByCategory).map(([cat, amount]) => {
                const pct = metrics.totalExpense > 0 ? (amount / metrics.totalExpense) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-300 capitalize">{cat.replace('_', ' ')}</span>
                      <span className="font-mono text-stone-200">{formatRupiah(amount)} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-stone-950 h-1.5 rounded-full overflow-hidden border border-stone-800">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BEP Summary */}
            <div className="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span className="font-semibold">BEP Volume Produksi:</span>
                <span className="font-mono font-bold text-amber-400">{metrics.bepVolumeKg.toLocaleString('id-ID')} Kg</span>
              </div>
              <p className="text-[10px] text-stone-400 leading-relaxed">
                Volume minimum hasil panen yang harus dicapai agar usahatani berada pada titik impas (tidak rugi).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Financial Transactions Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
              <h3 className="font-bold text-sm text-white">Buku Kas & Riwayat Transaksi Lapangan</h3>
              
              <div className="flex items-center space-x-1.5 text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg ${filterType === 'all' ? 'bg-stone-800 text-white' : 'text-stone-400'}`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType('pemasukan')}
                  className={`px-2.5 py-1 rounded-lg ${filterType === 'pemasukan' ? 'bg-emerald-500/20 text-emerald-300' : 'text-stone-400'}`}
                >
                  Pemasukan
                </button>
                <button
                  onClick={() => setFilterType('pengeluaran')}
                  className={`px-2.5 py-1 rounded-lg ${filterType === 'pengeluaran' ? 'bg-rose-500/20 text-rose-300' : 'text-stone-400'}`}
                >
                  Pengeluaran
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-stone-950/60 hover:bg-stone-950 border border-stone-800/80 hover:border-stone-700 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        tx.type === 'pemasukan' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {tx.category.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-stone-200">{tx.description}</h4>
                    </div>
                    <div className="text-[11px] text-stone-400 flex items-center space-x-2">
                      <span>{formatDateIndo(tx.date)}</span>
                      <span>•</span>
                      <span className="font-mono text-stone-500">{tx.receiptNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className={`font-mono font-bold text-sm ${
                      tx.type === 'pemasukan' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.type === 'pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </span>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus transaksi ${tx.description}?`)) deleteTransaction(tx.id);
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
        </div>
      </div>

      {/* Modal: Add Transaction */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base text-white">Catat Transaksi Keuangan Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tipe Transaksi</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="pengeluaran">Pengeluaran (Biaya)</option>
                    <option value="pemasukan">Pemasukan (Penjualan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                  >
                    <option value="pupuk">Pupuk & Nutrisi</option>
                    <option value="benih">Benih / Bibit</option>
                    <option value="obat_pestisida">Pestisida / Obat HPT</option>
                    <option value="tenaga_kerja">Upah Tenaga Kerja</option>
                    <option value="alsintan_bbm">BBM / Sewa Alsintan</option>
                    <option value="irigasi_listrik">Listrik Pompa & Irigasi</option>
                    <option value="penjualan_panen">Penjualan Hasil Panen</option>
                    <option value="lainnya">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Keterangan / Uraian *</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Pembelian NPK Phonska Plus 10 Sak"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 font-mono"
                  />
                </div>
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
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
