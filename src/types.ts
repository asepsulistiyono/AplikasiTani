export type CropType = 
  | 'Padi Sawah'
  | 'Jagung Hibrida'
  | 'Cabai Merah Keriting'
  | 'Bawang Merah'
  | 'Tomat Sayur'
  | 'Kelapa Sawit'
  | 'Kopi Arabika'
  | 'Kedelai'
  | 'Melon Golden'
  | 'Sayuran Hidroponik';

export type GrowthStage = 
  | 'Pengolahan Lahan'
  | 'Persemaian'
  | 'Vegetatif Awal'
  | 'Vegetatif Aktif'
  | 'Generatif/Bunting'
  | 'Pembungaan & Pembuahan'
  | 'Pematangan Bulir/Buah'
  | 'Siap Panen'
  | 'Masa Bera/Istirahat';

export interface FarmBlock {
  id: string;
  name: string;
  code: string;
  areaHa: number;
  cropType: CropType;
  cropVariety: string;
  plantingDate: string;
  estimatedHarvestDate: string;
  growthStage: GrowthStage;
  ageDays: number; // Hari Setelah Tanam (HST)
  healthScore: number; // 0 - 100
  soilMoisturePct: number; // 0 - 100%
  soilPh: number;
  soilTemperatureC: number;
  npkPpm: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  irrigationStatus: 'active' | 'scheduled' | 'idle';
  irrigationType: 'drip' | 'sprinkler' | 'flood' | 'smart_valve';
  irrigationSchedule: string;
  waterFlowRateLpm: number;
  locationName: string;
  targetYieldTon: number;
  notes: string;
  color: string;
}

export interface ActivityLog {
  id: string;
  blockId: string;
  blockName: string;
  type: 'tanam' | 'pupuk' | 'pestisida' | 'irigasi' | 'panen' | 'olah_tanah' | 'pemangkasan' | 'inspeksi' | 'monitoring_hama';
  title: string;
  date: string;
  operator: string;
  cost: number;
  materialsUsed: Array<{
    name: string;
    qty: number;
    unit: string;
  }>;
  status: 'selesai' | 'terjadwal' | 'tertunda';
  notes: string;
}

export interface SaprotanItem {
  id: string;
  name: string;
  category: 'benih' | 'pupuk_anorganik' | 'pupuk_organik' | 'pestisida' | 'herbisida' | 'fungisida' | 'alat_bantu';
  stock: number;
  unit: string;
  minStockThreshold: number;
  purchasePrice: number;
  supplier: string;
  expDate: string;
  location: string;
  lastRestocked: string;
}

export interface AlsintanItem {
  id: string;
  name: string;
  type: 'traktor' | 'combine_harvester' | 'transplanter' | 'drone_sprayer' | 'pompa_air' | 'cultivator' | 'mist_blower';
  serialNumber: string;
  status: 'tersedia' | 'digunakan' | 'perawatan' | 'rusak';
  fuelLevelPct: number;
  batteryPct?: number;
  lastMaintenance: string;
  nextMaintenance: string;
  operatorAssigned: string;
  operatingHours: number;
  maintenanceCostTotal: number;
}

export interface HarvestRecord {
  id: string;
  blockId: string;
  blockName: string;
  cropType: CropType;
  variety: string;
  harvestDate: string;
  totalWeightKg: number;
  yieldPerHaTon: number;
  targetYieldPerHaTon: number;
  qualityGrade: 'Grade A Super' | 'Grade B Standar' | 'Grade C' | 'Premium Ekspor';
  buyerName: string;
  salePricePerKg: number;
  totalRevenue: number;
  moistureLossPct: number;
  storageWarehouse: string;
  status: 'gudang' | 'terjual' | 'dikirim';
  notes?: string;
}

export interface FinanceTransaction {
  id: string;
  date: string;
  type: 'pemasukan' | 'pengeluaran';
  category: 
    | 'penjualan_panen'
    | 'saprotan'
    | 'tenaga_kerja'
    | 'perawatan_alsintan'
    | 'sewa_lahan'
    | 'listrik_bbm'
    | 'logistik_distribusi'
    | 'subsidi_hibah'
    | 'lainnya';
  amount: number;
  description: string;
  blockId?: string;
  blockName?: string;
  paymentMethod: 'Transfer Bank' | 'Tunai' | 'Tempo / Hutang Dagang' | 'QRIS / Dompet Digital';
  referenceNo?: string;
}

export interface IoTTelemetry {
  timestamp: string;
  airTempC: number;
  humidityPct: number;
  rainfallMm: number;
  solarRadiationWm2: number;
  windSpeedKmh: number;
  uvIndex: number;
  soilMoistureAvg: number;
  soilPhAvg: number;
  totalWaterUsedTodayLiters: number;
  evapotranspirationMm: number;
}

export interface WeatherForecastDay {
  day: string;
  date: string;
  condition: 'cerah' | 'berawan' | 'hujan_ringan' | 'hujan_sedang' | 'hujan_lebat' | 'badai';
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainProbPct: number;
  windSpeedKmh: number;
  et0Mm: number; // Evapotranspiration
  advisoryIndo: string;
}

export interface PestDiseaseLibraryItem {
  id: string;
  name: string;
  localName: string;
  cropTarget: string;
  pathogenType: 'Jamur / Fungi' | 'Bakteri' | 'Virus' | 'Serangga Hama' | 'Nematoda' | 'Fisiologis';
  imagePlaceholderColor: string;
  symptoms: string[];
  organicSolution: string[];
  chemicalSolution: string[];
  prevention: string[];
}

export interface YieldPredictionResult {
  estimatedYieldTon: number;
  estimatedYieldTonPerHa: number;
  confidencePct: number;
  optimalHarvestWindow: string;
  marketPriceProjection: string;
  riskFactors: string[];
  postHarvestAdvice: string;
}

export type Transaction = FinanceTransaction;

export interface CropDiagnosisResult {
  diseaseName: string;
  scientificName: string;
  cropType: string;
  pathogenType: string;
  confidencePct: number;
  severity: 'Ringan (1-20%)' | 'Sedang (21-50%)' | 'Tinggi (51-80%)' | 'Sangat Kritis (>80%)';
  symptomsSummary: string;
  biologicalControl: string[];
  chemicalTreatment: Array<{
    activeIngredient: string;
    dosage: string;
    brandExamples: string;
    safetyPeriodDays: number;
  }>;
  culturalPractices: string[];
  preventiveTips: string[];
  recommendationNote: string;
}

export interface FertilizerCalculationInput {
  cropType: CropType;
  areaHa: number;
  targetYieldTonHa: number;
  soilCondition: 'Sangat Subur' | 'Sedang / Normal' | 'Kurang Subur / Kritis';
  soilPh: number;
  irrigationType: 'Irigasi Teknis' | 'Tadah Hujan' | 'Tetes / Fertigasi' | 'Sprinkler';
  organicBaseApplied: boolean;
}

export interface FertilizerPlan {
  totalUreaKg: number;
  totalNpkKg: number;
  totalSp36Kg: number;
  totalKclKg: number;
  totalDolomitKg: number;
  totalOrganicKg: number;
  estimatedCostRupiah: number;
  schedules: Array<{
    timing: string; // e.g. '0 HST (Dasar)', '14 HST (Susulan 1)', '30 HST (Susulan 2)'
    fertilizers: Array<{ name: string; amountKg: number }>;
    applicationMethod: string;
    notes: string;
  }>;
  agronomyTips: string[];
}
