import { 
  FarmBlock, 
  ActivityLog, 
  SaprotanItem, 
  AlsintanItem, 
  HarvestRecord, 
  FinanceTransaction, 
  IoTTelemetry, 
  WeatherForecastDay,
  PestDiseaseLibraryItem 
} from '../types';

export const INITIAL_BLOCKS: FarmBlock[] = [
  {
    id: 'block-1',
    name: 'Blok Sawah Lemah Abang',
    code: 'BK-01-SW',
    areaHa: 2.5,
    cropType: 'Padi Sawah',
    cropVariety: 'Inpari 32 HDB',
    plantingDate: '2026-07-10',
    estimatedHarvestDate: '2026-10-25',
    growthStage: 'Generatif/Bunting',
    ageDays: 49,
    healthScore: 94,
    soilMoisturePct: 82,
    soilPh: 6.4,
    soilTemperatureC: 27.5,
    npkPpm: { nitrogen: 145, phosphorus: 38, potassium: 185 },
    irrigationStatus: 'active',
    irrigationType: 'smart_valve',
    irrigationSchedule: 'Setiap hari 06:00 & 16:30 (Macak-macak berkala)',
    waterFlowRateLpm: 45,
    locationName: 'Karawang Timur, Jawa Barat',
    targetYieldTon: 18.5,
    notes: 'Kondisi kanopi sangat rimbun, air diatur macak-macak untuk mencegah busuk pelepah.',
    color: '#10B981'
  },
  {
    id: 'block-2',
    name: 'Blok Hortikultura Cabai Merah',
    code: 'BK-02-CB',
    areaHa: 1.2,
    cropType: 'Cabai Merah Keriting',
    cropVariety: 'Kencana Prima F1',
    plantingDate: '2026-06-20',
    estimatedHarvestDate: '2026-09-30',
    growthStage: 'Pembungaan & Pembuahan',
    ageDays: 69,
    healthScore: 88,
    soilMoisturePct: 64,
    soilPh: 6.8,
    soilTemperatureC: 25.2,
    npkPpm: { nitrogen: 160, phosphorus: 52, potassium: 210 },
    irrigationStatus: 'scheduled',
    irrigationType: 'drip',
    irrigationSchedule: 'Fertigasi Drip otomatis 07:00 & 15:00',
    waterFlowRateLpm: 18,
    locationName: 'Garut Agro Highlands, Jabar',
    targetYieldTon: 14.4,
    notes: 'Mulai petik buah merah ke-3 minggu depan. Pasang perangkap kuning lalat buah.',
    color: '#EF4444'
  },
  {
    id: 'block-3',
    name: 'Ladang Jagung Hibrida Sentosa',
    code: 'BK-03-JG',
    areaHa: 3.0,
    cropType: 'Jagung Hibrida',
    cropVariety: 'Pioneer P35 Banteng',
    plantingDate: '2026-08-01',
    estimatedHarvestDate: '2026-11-15',
    growthStage: 'Vegetatif Aktif',
    ageDays: 27,
    healthScore: 92,
    soilMoisturePct: 58,
    soilPh: 6.2,
    soilTemperatureC: 29.1,
    npkPpm: { nitrogen: 130, phosphorus: 34, potassium: 155 },
    irrigationStatus: 'idle',
    irrigationType: 'sprinkler',
    irrigationSchedule: 'Sprinkler 2 hari sekali 17:00',
    waterFlowRateLpm: 0,
    locationName: 'Grobogan, Jawa Tengah',
    targetYieldTon: 27.0,
    notes: 'Pemupukan susulan 1 (Urea + NPK Phonska) telah selesai dengan tuntas.',
    color: '#F59E0B'
  },
  {
    id: 'block-4',
    name: 'Smart Greenhouse Tomat & Sayur',
    code: 'BK-04-GH',
    areaHa: 0.6,
    cropType: 'Tomat Sayur',
    cropVariety: 'Servo F1 Unggul',
    plantingDate: '2026-06-05',
    estimatedHarvestDate: '2026-09-10',
    growthStage: 'Pematangan Bulir/Buah',
    ageDays: 84,
    healthScore: 96,
    soilMoisturePct: 70,
    soilPh: 6.5,
    soilTemperatureC: 22.8,
    npkPpm: { nitrogen: 180, phosphorus: 65, potassium: 240 },
    irrigationStatus: 'active',
    irrigationType: 'drip',
    irrigationSchedule: 'Fertigasi Micro-drip tiap 3 jam',
    waterFlowRateLpm: 8,
    locationName: 'Lembang, Bandung Barat',
    targetYieldTon: 24.0,
    notes: 'Kualitas buah grade A mulus, kontrol suhu greenhouse otomatis dengan exhaust fan.',
    color: '#EC4899'
  },
  {
    id: 'block-5',
    name: 'Blok Bawang Merah Super Brebes',
    code: 'BK-05-BM',
    areaHa: 1.0,
    cropType: 'Bawang Merah',
    cropVariety: 'Bima Brebes Asli',
    plantingDate: '2026-07-28',
    estimatedHarvestDate: '2026-09-26',
    growthStage: 'Generatif/Bunting',
    ageDays: 31,
    healthScore: 85,
    soilMoisturePct: 62,
    soilPh: 6.6,
    soilTemperatureC: 28.3,
    npkPpm: { nitrogen: 110, phosphorus: 45, potassium: 190 },
    irrigationStatus: 'scheduled',
    irrigationType: 'sprinkler',
    irrigationSchedule: 'Pagi 06:00 siram kabut bilas embun upas',
    waterFlowRateLpm: 25,
    locationName: 'Larangan, Brebes, Jawa Tengah',
    targetYieldTon: 12.0,
    notes: 'Waspada serangan ulat grayak spodoptera pada malam hari, semprot feromon.',
    color: '#8B5CF6'
  },
  {
    id: 'block-6',
    name: 'Perkebunan Kopi Lereng Sindoro',
    code: 'BK-06-KP',
    areaHa: 2.0,
    cropType: 'Kopi Arabika',
    cropVariety: 'Typica & Kartika',
    plantingDate: '2023-11-10',
    estimatedHarvestDate: '2026-09-15',
    growthStage: 'Siap Panen',
    ageDays: 1022,
    healthScore: 97,
    soilMoisturePct: 68,
    soilPh: 5.9,
    soilTemperatureC: 20.4,
    npkPpm: { nitrogen: 140, phosphorus: 48, potassium: 175 },
    irrigationStatus: 'idle',
    irrigationType: 'flood',
    irrigationSchedule: 'Alami curah hujan pegunungan & rorak',
    waterFlowRateLpm: 0,
    locationName: 'Kledung, Temanggung, Jawa Tengah',
    targetYieldTon: 4.8,
    notes: 'Cherry merah sudah 80% matang pohon, siap pemetikan selektif manual (red cherry only).',
    color: '#D97706'
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-01',
    blockId: 'block-1',
    blockName: 'Blok Sawah Lemah Abang',
    type: 'monitoring_hama',
    title: 'Pemasangan Light Trap & Pengecekan Wereng',
    date: '2026-08-27',
    operator: 'Pak Sukardi & Tim POPT',
    cost: 150000,
    materialsUsed: [{ name: 'Lampu Perangkap Solar Cell', qty: 2, unit: 'Unit' }],
    status: 'selesai',
    notes: 'Populasi wereng coklat di bawah ambang batas ekonomi (0.2 ekor/rumpun). Aman.'
  },
  {
    id: 'act-02',
    blockId: 'block-2',
    blockName: 'Blok Hortikultura Cabai Merah',
    type: 'pupuk',
    title: 'Aplikasi Fertigasi Kalsium & Kalium Nitrat',
    date: '2026-08-26',
    operator: 'Kang Asep Supriatna',
    cost: 480000,
    materialsUsed: [
      { name: 'KNO3 Merah & Putih', qty: 15, unit: 'kg' },
      { name: 'Kalsium Nitrat (CN-G)', qty: 10, unit: 'kg' }
    ],
    status: 'selesai',
    notes: 'Mencegah busuk pantat buah (blossom end rot) dan meningkatkan bobot cabai.'
  },
  {
    id: 'act-03',
    blockId: 'block-3',
    blockName: 'Ladang Jagung Hibrida Sentosa',
    type: 'pestisida',
    title: 'Penyemprotan Preventif Ulat Grayak FAW via Drone',
    date: '2026-08-25',
    operator: 'Pilot Drone AgriTech Jaya',
    cost: 650000,
    materialsUsed: [{ name: 'Insektisida Emamektin Benzoat 50g/L', qty: 500, unit: 'ml' }],
    status: 'selesai',
    notes: 'Penyemprotan presisi drone 15 menit/hektar, liputan droplet merata di pucuk daun.'
  },
  {
    id: 'act-04',
    blockId: 'block-4',
    blockName: 'Smart Greenhouse Tomat & Sayur',
    type: 'panen',
    title: 'Petik Panen Perdana Tomat Servo Grade A',
    date: '2026-08-24',
    operator: 'Ibu Ningsih & 4 Pekerja',
    cost: 350000,
    materialsUsed: [{ name: 'Keranjang Panen Kontainer', qty: 30, unit: 'Buah' }],
    status: 'selesai',
    notes: 'Hasil panen 1.250 kg tomat grade A super, langsung disortir dan dipacking.'
  },
  {
    id: 'act-05',
    blockId: 'block-5',
    blockName: 'Blok Bawang Merah Super Brebes',
    type: 'irigasi',
    title: 'Siram Bilas Embun Pagi Otomatis',
    date: '2026-08-28',
    operator: 'Sistem Otomatisasi IoT Timer',
    cost: 45000,
    materialsUsed: [{ name: 'Air Sumur Bor Artesis', qty: 5000, unit: 'Liter' }],
    status: 'selesai',
    notes: 'Bilas embun asam pagi hari selesai tepat pukul 06:15 WIB.'
  },
  {
    id: 'act-06',
    blockId: 'block-6',
    blockName: 'Perkebunan Kopi Lereng Sindoro',
    type: 'inspeksi',
    title: 'Uji Kadar Gula Brics Cherry Kopi Siap Petik',
    date: '2026-08-28',
    operator: 'Mas Danang (Q-Grader)',
    cost: 100000,
    materialsUsed: [{ name: 'Refraktometer Digital Brics', qty: 1, unit: 'Alat' }],
    status: 'selesai',
    notes: 'Kadar brics rata-rata 22.4%, rasa manis optimal untuk proses Honey & Natural.'
  }
];

export const INITIAL_SAPROTAN: SaprotanItem[] = [
  {
    id: 'sap-01',
    name: 'Benih Padi Inpari 32 HDB Bersertifikat',
    category: 'benih',
    stock: 125,
    unit: 'kg (5 sak @25kg)',
    minStockThreshold: 50,
    purchasePrice: 16500,
    supplier: 'PT Sang Hyang Seri Persero',
    expDate: '2027-02-15',
    location: 'Gudang Benih A1 - Rak 2',
    lastRestocked: '2026-06-15'
  },
  {
    id: 'sap-02',
    name: 'Pupuk NPK Mutiara 16-16-16 YARA',
    category: 'pupuk_anorganik',
    stock: 850,
    unit: 'kg (17 sak @50kg)',
    minStockThreshold: 300,
    purchasePrice: 15800,
    supplier: 'Distributor Pupuk Tani Makmur',
    expDate: '2028-12-01',
    location: 'Gudang Utama - Pallet B3',
    lastRestocked: '2026-07-02'
  },
  {
    id: 'sap-03',
    name: 'Pupuk Urea Granul Non-Subsidi Petrokimia',
    category: 'pupuk_anorganik',
    stock: 600,
    unit: 'kg (12 sak @50kg)',
    minStockThreshold: 200,
    purchasePrice: 9200,
    supplier: 'Koperasi Pertanian Jaya Makmur',
    expDate: '2028-06-30',
    location: 'Gudang Utama - Pallet B1',
    lastRestocked: '2026-07-10'
  },
  {
    id: 'sap-04',
    name: 'Pupuk Hayati Majemuk & Bio-Trichoderma',
    category: 'pupuk_organik',
    stock: 80,
    unit: 'Liter',
    minStockThreshold: 30,
    purchasePrice: 65000,
    supplier: 'Laboratorium BioAgri Nusantara',
    expDate: '2027-08-20',
    location: 'Ruang Kimia Sejuk - Lemari C',
    lastRestocked: '2026-06-01'
  },
  {
    id: 'sap-05',
    name: 'Insektisida Prevathon 50 SC (Klorantraniliprol)',
    category: 'pestisida',
    stock: 12,
    unit: 'Botol @250ml',
    minStockThreshold: 5,
    purchasePrice: 185000,
    supplier: 'FMC Indonesia Agriscience',
    expDate: '2027-11-10',
    location: 'Gudang Pestisida Terkunci B-4',
    lastRestocked: '2026-05-20'
  },
  {
    id: 'sap-06',
    name: 'Fungisida Score 250 EC (Difenokonazol)',
    category: 'fungisida',
    stock: 8,
    unit: 'Botol @250ml',
    minStockThreshold: 4,
    purchasePrice: 145000,
    supplier: 'Syngenta Indonesia',
    expDate: '2027-10-05',
    location: 'Gudang Pestisida Terkunci B-2',
    lastRestocked: '2026-06-18'
  },
  {
    id: 'sap-07',
    name: 'Kompos Organik Fermentasi Kohe Sapi Matang',
    category: 'pupuk_organik',
    stock: 3500,
    unit: 'kg (140 karung @25kg)',
    minStockThreshold: 1000,
    purchasePrice: 1200,
    supplier: 'Kelompok Ternak Lembu Berkah',
    expDate: '2028-01-01',
    location: 'Bungker Kompos Terbuka',
    lastRestocked: '2026-08-01'
  }
];

export const INITIAL_ALSINTAN: AlsintanItem[] = [
  {
    id: 'als-01',
    name: 'Traktor Roda 4 Kubota L4018 (40 HP)',
    type: 'traktor',
    serialNumber: 'KBT-4018-ID-2024-889',
    status: 'tersedia',
    fuelLevelPct: 85,
    lastMaintenance: '2026-08-10',
    nextMaintenance: '2026-10-10',
    operatorAssigned: 'Pak Slamet Riyadi',
    operatingHours: 420.5,
    maintenanceCostTotal: 1850000
  },
  {
    id: 'als-02',
    name: 'Drone Sprayer Pertanian DJI Agras T40',
    type: 'drone_sprayer',
    serialNumber: 'DJI-T40-AGRI-99321',
    status: 'tersedia',
    fuelLevelPct: 100,
    batteryPct: 98,
    lastMaintenance: '2026-08-20',
    nextMaintenance: '2026-09-20',
    operatorAssigned: 'Reza Pratama (Lisensi FASI/DJI)',
    operatingHours: 112.0,
    maintenanceCostTotal: 950000
  },
  {
    id: 'als-03',
    name: 'Combine Harvester Padi Yanmar AW70V',
    type: 'combine_harvester',
    serialNumber: 'YNR-AW70-ID-2025-104',
    status: 'tersedia',
    fuelLevelPct: 70,
    lastMaintenance: '2026-07-28',
    nextMaintenance: '2026-09-28',
    operatorAssigned: 'Pak Joko Subagyo',
    operatingHours: 285.3,
    maintenanceCostTotal: 3200000
  },
  {
    id: 'als-04',
    name: 'Pompa Irigasi Submersible Tenaga Surya 5.5 HP',
    type: 'pompa_air',
    serialNumber: 'SOLAR-PUMP-55HP-441',
    status: 'digunakan',
    fuelLevelPct: 100,
    lastMaintenance: '2026-06-15',
    nextMaintenance: '2026-12-15',
    operatorAssigned: 'Sistem Otomatis PLC',
    operatingHours: 1840.0,
    maintenanceCostTotal: 450000
  },
  {
    id: 'als-05',
    name: 'Power Cultivator Quick Cakar Baja SP',
    type: 'cultivator',
    serialNumber: 'QCK-CB-2024-771',
    status: 'tersedia',
    fuelLevelPct: 60,
    lastMaintenance: '2026-08-05',
    nextMaintenance: '2026-10-05',
    operatorAssigned: 'Pak Dedi Sutisna',
    operatingHours: 165.8,
    maintenanceCostTotal: 380000
  }
];

export const INITIAL_HARVESTS: HarvestRecord[] = [
  {
    id: 'hrv-01',
    blockId: 'block-4',
    blockName: 'Smart Greenhouse Tomat & Sayur',
    cropType: 'Tomat Sayur',
    variety: 'Servo F1',
    harvestDate: '2026-08-24',
    totalWeightKg: 1250,
    yieldPerHaTon: 40.0,
    targetYieldPerHaTon: 38.0,
    qualityGrade: 'Grade A Super',
    buyerName: 'Supermarket Segar Nusantara & Mitra Hotel',
    salePricePerKg: 14500,
    totalRevenue: 18125000,
    moistureLossPct: 1.2,
    storageWarehouse: 'Cold Storage Room 1 (Suhu 12°C)',
    status: 'terjual',
    notes: 'Ukuran buah seragam 90-110g, tingkat kematangan 85% merah mulus.'
  },
  {
    id: 'hrv-02',
    blockId: 'block-1',
    blockName: 'Blok Sawah Lemah Abang',
    cropType: 'Padi Sawah',
    variety: 'Inpari 32 HDB (Musim Lalu)',
    harvestDate: '2026-04-18',
    totalWeightKg: 17800,
    yieldPerHaTon: 7.12,
    targetYieldPerHaTon: 7.0,
    qualityGrade: 'Grade A Super',
    buyerName: 'Perum BULOG Sub-Divre Karawang',
    salePricePerKg: 7400,
    totalRevenue: 131720000,
    moistureLossPct: 3.5,
    storageWarehouse: 'Silo Pengeringan Gabah Kering Giling (GKG)',
    status: 'terjual',
    notes: 'Kadar air pasca panen 23%, setelah dryer menjadi 13.8% standar Bulog.'
  },
  {
    id: 'hrv-03',
    blockId: 'block-2',
    blockName: 'Blok Hortikultura Cabai Merah',
    cropType: 'Cabai Merah Keriting',
    variety: 'Kencana Prima F1 (Petik 1 & 2)',
    harvestDate: '2026-08-15',
    totalWeightKg: 820,
    yieldPerHaTon: 11.5,
    targetYieldPerHaTon: 12.0,
    qualityGrade: 'Grade A Super',
    buyerName: 'Pasar Induk Kramat Jati & Offtaker Industri Sambal',
    salePricePerKg: 42000,
    totalRevenue: 34440000,
    moistureLossPct: 2.0,
    storageWarehouse: 'Gudang Sortasi Horti Garut',
    status: 'terjual',
    notes: 'Harga jual sedang sangat baik di pasar induk karena pasokan minim.'
  }
];

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'trx-01',
    date: '2026-08-24',
    type: 'pemasukan',
    category: 'penjualan_panen',
    amount: 18125000,
    description: 'Pelunasan Penjualan Tomat Servo Grade A (1.250 kg)',
    blockId: 'block-4',
    blockName: 'Smart Greenhouse Tomat & Sayur',
    paymentMethod: 'Transfer Bank',
    referenceNo: 'INV-2026-08-TOM-01'
  },
  {
    id: 'trx-02',
    date: '2026-08-20',
    type: 'pengeluaran',
    category: 'saprotan',
    amount: 3850000,
    description: 'Pembelian Pupuk NPK YARA & Kalsium Nitrat',
    paymentMethod: 'Transfer Bank',
    referenceNo: 'TRF-BCA-99381'
  },
  {
    id: 'trx-03',
    date: '2026-08-18',
    type: 'pengeluaran',
    category: 'tenaga_kerja',
    amount: 2400000,
    description: 'Upah Mingguan 6 Petani & Operator Lahan (11-17 Agt)',
    paymentMethod: 'Tunai',
    referenceNo: 'KWT-LABOR-08-W3'
  },
  {
    id: 'trx-04',
    date: '2026-08-15',
    type: 'pemasukan',
    category: 'penjualan_panen',
    amount: 34440000,
    description: 'Hasil Penjualan Cabai Merah Keriting Petik 1 & 2',
    blockId: 'block-2',
    blockName: 'Blok Hortikultura Cabai Merah',
    paymentMethod: 'Transfer Bank',
    referenceNo: 'INV-CB-2026-08-15'
  },
  {
    id: 'trx-05',
    date: '2026-08-12',
    type: 'pengeluaran',
    category: 'listrik_bbm',
    amount: 780000,
    description: 'Tagihan Listrik PLN Greenhouse & Solar Inverter Backup',
    paymentMethod: 'Transfer Bank',
    referenceNo: 'PLN-LEMBANG-0826'
  },
  {
    id: 'trx-06',
    date: '2026-08-10',
    type: 'pengeluaran',
    category: 'perawatan_alsintan',
    amount: 1850000,
    description: 'Ganti Oli Hidrolik & Filter Traktor Kubota L4018',
    paymentMethod: 'Transfer Bank',
    referenceNo: 'SRV-KUBOTA-4401'
  }
];

export const CURRENT_TELEMETRY: IoTTelemetry = {
  timestamp: new Date().toISOString(),
  airTempC: 28.4,
  humidityPct: 74,
  rainfallMm: 0.0,
  solarRadiationWm2: 685,
  windSpeedKmh: 8.5,
  uvIndex: 7.2,
  soilMoistureAvg: 68.5,
  soilPhAvg: 6.45,
  totalWaterUsedTodayLiters: 14200,
  evapotranspirationMm: 4.6
};

export const WEATHER_FORECAST: WeatherForecastDay[] = [
  {
    day: 'Hari Ini',
    date: '28 Agt 2026',
    condition: 'cerah',
    tempMax: 32,
    tempMin: 23,
    humidity: 72,
    rainProbPct: 15,
    windSpeedKmh: 10,
    et0Mm: 4.8,
    advisoryIndo: 'Kondisi sangat ideal untuk penyemprotan pupuk daun dan penjemuran gabah/hasil panen.'
  },
  {
    day: 'Sabtu',
    date: '29 Agt 2026',
    condition: 'berawan',
    tempMax: 31,
    tempMin: 24,
    humidity: 78,
    rainProbPct: 30,
    windSpeedKmh: 12,
    et0Mm: 4.2,
    advisoryIndo: 'Cuaca teduh berawan, cocok untuk kegiatan olah tanah dan pindah tanam bibit.'
  },
  {
    day: 'Minggu',
    date: '30 Agt 2026',
    condition: 'hujan_ringan',
    tempMax: 29,
    tempMin: 22,
    humidity: 86,
    rainProbPct: 75,
    windSpeedKmh: 14,
    et0Mm: 3.1,
    advisoryIndo: 'Potensi hujan sore hari. Kurangi debit irigasi otomatis 40% untuk hemat energi.'
  },
  {
    day: 'Senin',
    date: '31 Agt 2026',
    condition: 'hujan_sedang',
    tempMax: 28,
    tempMin: 22,
    humidity: 90,
    rainProbPct: 85,
    windSpeedKmh: 16,
    et0Mm: 2.8,
    advisoryIndo: 'Waspada genangan air di bedengan cabai. Buka saluran pembuangan drainase.'
  },
  {
    day: 'Selasa',
    date: '01 Sep 2026',
    condition: 'berawan',
    tempMax: 30,
    tempMin: 23,
    humidity: 80,
    rainProbPct: 25,
    windSpeedKmh: 11,
    et0Mm: 4.0,
    advisoryIndo: 'Kondisi tanah lembab pasca hujan, waktu tepat aplikasi trichoderma/mikroba tanah.'
  },
  {
    day: 'Rabu',
    date: '02 Sep 2026',
    condition: 'cerah',
    tempMax: 32,
    tempMin: 24,
    humidity: 70,
    rainProbPct: 10,
    windSpeedKmh: 9,
    et0Mm: 5.0,
    advisoryIndo: 'Radiasi matahari tinggi, pastikan irigasi greenhouse aktif tepat waktu.'
  },
  {
    day: 'Kamis',
    date: '03 Sep 2026',
    condition: 'cerah',
    tempMax: 33,
    tempMin: 24,
    humidity: 68,
    rainProbPct: 10,
    windSpeedKmh: 8,
    et0Mm: 5.2,
    advisoryIndo: 'Penguapan tinggi, monitor kelembaban tanah sensor petak hortikultura.'
  }
];

export const PEST_DISEASE_DATABASE: PestDiseaseLibraryItem[] = [
  {
    id: 'pest-01',
    name: 'Bacterial Leaf Blight (Hawar Daun Bakteri / Kresek)',
    localName: 'Penyakit Kresek Padi',
    cropTarget: 'Padi Sawah',
    pathogenType: 'Bakteri',
    imagePlaceholderColor: '#ca8a04',
    symptoms: [
      'Bercak kebasahan berwarna kuning pucat hingga abu-abu di tepi daun.',
      'Daun menggulung dan mengering mulai dari ujung daun (seperti terbakar).',
      'Keluar eksudat bakteri berupa cairan kental kekuningan saat pagi hari.'
    ],
    organicSolution: [
      'Semprotkan ekstrak daun mimba atau rimpang kunyit dan lengkuas.',
      'Aplikasi agen hayati bakteri antagonis Corynebacterium / Paenibacillus polymyxa.',
      'Pemberian abu sekam / silika (Si) untuk mempertebal dinding sel daun.'
    ],
    chemicalSolution: [
      'Bakterisida bahan aktif Oksitetrasiklin / Streptomisin sulfat (dosis 1-2 g/L).',
      'Fungisida & Bakterisida Tembaga Hidroksida (Kocide / Cuproxat) 1.5 g/L.'
    ],
    prevention: [
      'Gunakan varietas tahan (Inpari 32, Inpari 42, Ciherang Tahan Kresek).',
      'Hindari pemupukan Nitrogen (Urea) berlebihan saat musim hujan.',
      'Atur jarak tanam jajar legowo (2:1 atau 4:1) untuk sirkulasi udara optimal.'
    ]
  },
  {
    id: 'pest-02',
    name: 'Anthracnose (Colletotrichum spp. / Patek)',
    localName: 'Penyakit Antraknosa / Patek Buah',
    cropTarget: 'Cabai Merah Keriting & Tomat',
    pathogenType: 'Jamur / Fungi',
    imagePlaceholderColor: '#dc2626',
    symptoms: [
      'Bercak melingkar melekuk berwarna cokelat kehitaman pada kulit buah.',
      'Massa spora jamur berwarna merah muda oranye di tengah lesi.',
      'Buah membusuk, rontok prematur, atau mengering mengkerut seperti mumi.'
    ],
    organicSolution: [
      'Semprotkan biofungisida Trichoderma harzianum + Gliocladium secara rutin tiap 5 hari.',
      'Ekstrak fermentasi bawang putih dan lengkuas sebagai antijamur alami.',
      'Tingkatkan kalsium boron untuk memperkokoh kulit buah cabai.'
    ],
    chemicalSolution: [
      'Fungisida sistemik Difenokonazol + Azoksistrobin (Amistar Top) 0.5 - 1 ml/L.',
      'Fungisida kontak Mankozeb 80% / Klorotalonil (Daconil) 2 g/L.'
    ],
    prevention: [
      'Gunakan mulsa plastik hitam perak untuk mencegah percikan tanah ke buah.',
      'Petik dan bakar buah yang terinfeksi segera (jangan buang di selokan).',
      'Perlebar jarak tanam dan pangkas tunas air bawah (wiwil) agar kanopi tidak terlalu rapat.'
    ]
  },
  {
    id: 'pest-03',
    name: 'Fall Armyworm (Spodoptera frugiperda)',
    localName: 'Ulat Grayak Jagung FAW',
    cropTarget: 'Jagung Hibrida',
    pathogenType: 'Serangga Hama',
    imagePlaceholderColor: '#b45309',
    symptoms: [
      'Lubang gigitan besar compang-camping pada daun muda jagung.',
      'Kotoran ulat (frass) seperti serbuk gergaji basah menumpuk di pucuk daun (titik tumbuh).',
      'Ulat memiliki tanda khas huruf Y terbalik di kepala dan 4 titik di ujung abdomen.'
    ],
    organicSolution: [
      'Aplikasi biopestisida jamur entomopatogen Beauveria bassiana / Metarhizium.',
      'Pelepasan musuh alami parasitoid telur Trichogramma spp.',
      'Ekstrak daun tembakau + biji mahoni + sabun colek alami.'
    ],
    chemicalSolution: [
      'Insektisida Emamektin Benzoat 50 g/L (Proclaim) 0.5 g/L tepat ke dalam pupus daun.',
      'Insektisida Klorantraniliprol (Prevathon) 1.5 ml/L.'
    ],
    prevention: [
      'Tanam serentak dalam satu hamparan wilayah.',
      'Monitoring berkala mulai tanaman berumur 7 - 35 HST.',
      'Tanam tanaman refugia (bunga matahari, kenikir, jagung manis pinggir) untuk konservasi musuh alami.'
    ]
  },
  {
    id: 'pest-04',
    name: 'Blast Disease (Magnaporthe oryzae)',
    localName: 'Penyakit Blas Daun & Blas Leher Padi',
    cropTarget: 'Padi Sawah',
    pathogenType: 'Jamur / Fungi',
    imagePlaceholderColor: '#4d7c0f',
    symptoms: [
      'Bercak berbentuk belah ketupat (mata) dengan bagian tengah abu-abu dan tepi coklat kemerahan pada daun.',
      'Pangkal tangkai malai membusuk dan patah (blas leher / patah leher), bulir padi hampa.'
    ],
    organicSolution: [
      'Perlakuan benih (seed treatment) dengan agens hayati Pseudomonas fluorescens.',
      'Penyemprotan larutan silika cair organik dan asam humat.'
    ],
    chemicalSolution: [
      'Fungisida Trisiklazol (Filia / Beam) 1 - 1.5 g/L pada fase anakan dan bunting.',
      'Fungisida Isoprotiolan (Fujione) 1 - 2 ml/L.'
    ],
    prevention: [
      'Hindari penanaman satu varietas terus menerus sepanjang tahun.',
      'Imbangi pupuk Nitrogen dengan pupuk Kalium (KCl) dan Fosfat (SP-36) yang cukup.'
    ]
  }
];
