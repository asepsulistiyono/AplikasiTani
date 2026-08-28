import { FertilizerCalculationInput, FertilizerPlan, CropType, FinanceTransaction, HarvestRecord, FarmBlock, ActivityLog, SaprotanItem, AlsintanItem } from '../types';

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0
  }).format(value);
};

export const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const calculateFertilizerPlan = (input: FertilizerCalculationInput): FertilizerPlan => {
  const { cropType, areaHa, targetYieldTonHa, soilCondition, soilPh, organicBaseApplied } = input;

  // Base multiplier based on soil condition
  let soilFactor = 1.0;
  if (soilCondition === 'Kurang Subur / Kritis') soilFactor = 1.25;
  if (soilCondition === 'Sangat Subur') soilFactor = 0.85;

  let baseUreaPerHa = 200;
  let baseNpkPerHa = 300;
  let baseSp36PerHa = 100;
  let baseKclPerHa = 100;
  let baseDolomitPerHa = 500;
  let baseOrganicPerHa = 2000;

  switch (cropType) {
    case 'Padi Sawah':
      baseUreaPerHa = 220;
      baseNpkPerHa = 300;
      baseSp36PerHa = 75;
      baseKclPerHa = 50;
      baseDolomitPerHa = soilPh < 6.0 ? 800 : 300;
      baseOrganicPerHa = 2000;
      break;
    case 'Jagung Hibrida':
      baseUreaPerHa = 350;
      baseNpkPerHa = 350;
      baseSp36PerHa = 100;
      baseKclPerHa = 75;
      baseDolomitPerHa = soilPh < 6.0 ? 1000 : 400;
      baseOrganicPerHa = 2500;
      break;
    case 'Cabai Merah Keriting':
      baseUreaPerHa = 150;
      baseNpkPerHa = 600;
      baseSp36PerHa = 150;
      baseKclPerHa = 200;
      baseDolomitPerHa = soilPh < 6.5 ? 1500 : 500;
      baseOrganicPerHa = 5000;
      break;
    case 'Bawang Merah':
      baseUreaPerHa = 180;
      baseNpkPerHa = 450;
      baseSp36PerHa = 120;
      baseKclPerHa = 150;
      baseDolomitPerHa = 800;
      baseOrganicPerHa = 4000;
      break;
    case 'Tomat Sayur':
      baseUreaPerHa = 120;
      baseNpkPerHa = 500;
      baseSp36PerHa = 150;
      baseKclPerHa = 180;
      baseDolomitPerHa = 1200;
      baseOrganicPerHa = 4500;
      break;
    case 'Kopi Arabika':
      baseUreaPerHa = 200;
      baseNpkPerHa = 300;
      baseSp36PerHa = 100;
      baseKclPerHa = 150;
      baseDolomitPerHa = 600;
      baseOrganicPerHa = 3000;
      break;
    default:
      baseUreaPerHa = 200;
      baseNpkPerHa = 300;
      baseSp36PerHa = 100;
      baseKclPerHa = 100;
      baseDolomitPerHa = 600;
      baseOrganicPerHa = 2000;
  }

  // Adjust by target yield
  const yieldRatio = Math.max(0.7, targetYieldTonHa / 8.0);
  
  const totalUreaKg = Math.round(baseUreaPerHa * areaHa * soilFactor * yieldRatio);
  const totalNpkKg = Math.round(baseNpkPerHa * areaHa * soilFactor * yieldRatio);
  const totalSp36Kg = Math.round(baseSp36PerHa * areaHa * soilFactor);
  const totalKclKg = Math.round(baseKclPerHa * areaHa * soilFactor * yieldRatio);
  const totalDolomitKg = soilPh < 6.0 ? Math.round(baseDolomitPerHa * areaHa * 1.5) : Math.round(baseDolomitPerHa * areaHa);
  const totalOrganicKg = organicBaseApplied ? Math.round(baseOrganicPerHa * areaHa * 0.6) : Math.round(baseOrganicPerHa * areaHa);

  // Price estimate
  const estimatedCostRupiah = (totalUreaKg * 9000) + (totalNpkKg * 15000) + (totalSp36Kg * 11000) + (totalKclKg * 14000) + (totalDolomitKg * 1500) + (totalOrganicKg * 1200);

  const schedules = [
    {
      timing: 'Fase Dasar (0 HST - Olah Tanah)',
      fertilizers: [
        { name: 'Pupuk Organik Matang / Kohe', amountKg: totalOrganicKg },
        { name: 'Dolomit / Kapur Pertanian', amountKg: totalDolomitKg },
        { name: 'SP-36 (Fosfat Penuh)', amountKg: totalSp36Kg },
        { name: 'NPK Mutiara (30%)', amountKg: Math.round(totalNpkKg * 0.3) }
      ],
      applicationMethod: 'Tabur merata saat olah tanah akhir / campur pada bedengan 7 hari sebelum tanam.',
      notes: 'Memperbaiki struktur biologi tanah dan merangsang perakaran awal yang kokoh.'
    },
    {
      timing: 'Fase Susulan I (10 - 15 HST / Vegetatif Awal)',
      fertilizers: [
        { name: 'Urea (50%)', amountKg: Math.round(totalUreaKg * 0.5) },
        { name: 'NPK Majemuk (35%)', amountKg: Math.round(totalNpkKg * 0.35) }
      ],
      applicationMethod: 'Kocor larutan di pangkal batang atau tugal 5 cm di samping tanaman.',
      notes: 'Memacu pembentukan anakan produktif, tunas lateral, dan pembesaran daun.'
    },
    {
      timing: 'Fase Susulan II (25 - 35 HST / Primordia & Bunting)',
      fertilizers: [
        { name: 'Urea (50%)', amountKg: Math.round(totalUreaKg * 0.5) },
        { name: 'NPK Majemuk (35%)', amountKg: Math.round(totalNpkKg * 0.35) },
        { name: 'KCl / Kalium Murni (100%)', amountKg: totalKclKg }
      ],
      applicationMethod: 'Tabur saat kondisi tanah macak-macak lembab / fertigasi tetes.',
      notes: 'Meningkatkan bobot gabah/buah, mencegah kerontokan bunga, dan mempertebal kulit panenan.'
    }
  ];

  const agronomyTips = [
    `Nilai pH tanah terdeteksi ${soilPh.toFixed(1)}. ${soilPh < 6.0 ? 'Kondisi masam, pastikan aplikasi dolomit 2 minggu sebelum pupuk kimia.' : 'Kondisi pH relatif ideal untuk penyerapan hara makro primer.'}`,
    'Hindari mencampur pupuk Kalsium langsung dengan pupuk Fosfat atau Sulfat pekat karena dapat membentuk endapan.',
    'Aplikasi pupuk paling efektif dilakukan pagi hari (pukul 06:30 - 09:00) saat stomata daun terbuka sempurna.'
  ];

  return {
    totalUreaKg,
    totalNpkKg,
    totalSp36Kg,
    totalKclKg,
    totalDolomitKg,
    totalOrganicKg,
    estimatedCostRupiah,
    schedules,
    agronomyTips
  };
};

export interface FinancialAnalysisMetrics {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  rcRatio: number;
  bcRatio: number;
  hppPerKg: number;
  bepVolumeKg: number;
  bepHargaPerKg: number;
  profitMarginPct: number;
  expenseByCategory: Record<string, number>;
  isFeasible: boolean;
}

export const calculateFinancialMetrics = (
  transactions: FinanceTransaction[],
  harvests: HarvestRecord[]
): FinancialAnalysisMetrics => {
  const totalIncome = transactions
    .filter(t => t.type === 'pemasukan')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'pengeluaran')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalHarvestKg = harvests.reduce((acc, h) => acc + (h.totalWeightKg || (h as any).actualYieldKg || 0), 0);

  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'pengeluaran')
    .forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const netProfit = totalIncome - totalExpense;
  const rcRatio = totalExpense > 0 ? totalIncome / totalExpense : (totalIncome > 0 ? 1 : 0);
  const bcRatio = totalExpense > 0 ? netProfit / totalExpense : 0;
  const hppPerKg = totalHarvestKg > 0 ? Math.round(totalExpense / totalHarvestKg) : 0;
  const averageSellingPricePerKg = totalHarvestKg > 0 ? Math.round(totalIncome / totalHarvestKg) : 0;
  const bepVolumeKg = averageSellingPricePerKg > 0 ? Math.round(totalExpense / averageSellingPricePerKg) : 0;
  const bepHargaPerKg = hppPerKg;
  const profitMarginPct = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return {
    totalIncome,
    totalExpense,
    netProfit,
    rcRatio,
    bcRatio,
    hppPerKg,
    bepVolumeKg,
    bepHargaPerKg,
    profitMarginPct,
    expenseByCategory,
    isFeasible: rcRatio >= 1.0
  };
};

export const exportToJsonFile = (data: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportFarmDataToJson = (
  blocks: FarmBlock[],
  activities: ActivityLog[],
  harvests: HarvestRecord[],
  transactions: FinanceTransaction[],
  saprotan: SaprotanItem[],
  alsintan: AlsintanItem[]
) => {
  const payload = {
    appName: 'AgriSmart Nusantara',
    exportDate: new Date().toISOString(),
    blocks,
    activities,
    harvests,
    transactions,
    saprotan,
    alsintan
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AgriSmart_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportTransactionsToCsv = (transactions: FinanceTransaction[]) => {
  if (!transactions.length) return;

  const headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Uraian', 'Nominal_Rp', 'Metode_Pembayaran', 'No_Referensi'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type,
    t.category,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.amount,
    t.paymentMethod,
    t.referenceNo || ''
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AgriSmart_Keuangan_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
