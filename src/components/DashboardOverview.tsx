import React, { useState } from 'react';
import { 
  Sprout, 
  MapPin, 
  Droplets, 
  SunMedium, 
  Wind, 
  ThermometerSun, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Zap, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight, 
  BarChart3, 
  Sparkles, 
  Bot,
  Layers,
  Clock,
  Gauge
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { formatRupiah, formatNumber, formatDateIndo } from '../utils/agriUtils';

interface DashboardOverviewProps {
  onOpenAgriBot: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onOpenAgriBot }) => {
  const { 
    blocks, 
    activities, 
    harvests, 
    transactions, 
    telemetry, 
    weather, 
    setActiveTab, 
    setSelectedBlockId, 
    toggleIrrigation 
  } = useFarm();

  const [selectedWeatherDayIndex, setSelectedWeatherDayIndex] = useState(0);

  // Calculations
  const totalAreaHa = blocks.reduce((acc, b) => acc + b.areaHa, 0);
  const avgHealth = blocks.length ? Math.round(blocks.reduce((acc, b) => acc + b.healthScore, 0) / blocks.length) : 0;
  const activeIrrigation = blocks.filter(b => b.irrigationStatus === 'active');
  const targetYieldTotalTon = blocks.reduce((acc, b) => acc + b.targetYieldTon, 0);
  
  const totalIncome = transactions.filter(t => t.type === 'pemasukan').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'pengeluaran').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Alerts logic
  const alerts: Array<{ id: string; type: 'warning' | 'info' | 'success'; title: string; desc: string; actionTab?: string }> = [];

  // Check low soil moisture blocks
  const lowMoistureBlocks = blocks.filter(b => b.soilMoisturePct < 60);
  if (lowMoistureBlocks.length > 0) {
    alerts.push({
      id: 'alert-moisture',
      type: 'warning',
      title: `Kelembaban Tanah Rendah pada ${lowMoistureBlocks.length} Blok`,
      desc: `${lowMoistureBlocks.map(b => b.name).join(', ')} memiliki kadar lengas < 60%. Disarankan aktifkan fertigasi / irigasi tetes sore ini.`,
      actionTab: 'blocks'
    });
  }

  // Check ready harvest
  const readyHarvestBlocks = blocks.filter(b => b.growthStage === 'Siap Panen' || b.growthStage === 'Pematangan Bulir/Buah');
  if (readyHarvestBlocks.length > 0) {
    alerts.push({
      id: 'alert-harvest',
      type: 'success',
      title: `${readyHarvestBlocks.length} Blok Memasuki Fase Panen`,
      desc: `${readyHarvestBlocks.map(b => b.name).join(', ')} siap panen. Persiapkan tim pemetik, alsintan combine harvester, dan logistik gudang.`,
      actionTab: 'harvest'
    });
  }

  // Weather advisory alert
  if (weather[0]) {
    alerts.push({
      id: 'alert-weather',
      type: 'info',
      title: `Rekomendasi Agronomi Cuaca Hari Ini`,
      desc: weather[0].advisoryIndo,
      actionTab: 'lifecycle'
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border border-emerald-800/40 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Pusat Kendali Pertanian Presisi
              </span>
              <span className="text-stone-400 text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Live Sync IoT Lahan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Kondisi Pertanian Terpadu Nusantara
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl">
              Mengelola <strong className="text-emerald-400">{totalAreaHa.toFixed(1)} Hektar</strong> hamparan budidaya polikultur & hortikultura terintegrasi dengan sensor telemetri cuaca dan kecerdasan buatan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('clinic')}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 font-medium text-xs flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Diagnosa AI</span>
            </button>
            <button
              onClick={onOpenAgriBot}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950/50 border border-emerald-400/30 transition-transform active:scale-95"
            >
              <Bot className="w-4 h-4 text-emerald-200" />
              <span>Konsultasi Agronomis AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Luas Lahan & Blok */}
        <div 
          onClick={() => setActiveTab('blocks')}
          className="bg-stone-900/90 hover:bg-stone-850 p-4 rounded-xl border border-stone-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Total Luas Lahan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{totalAreaHa.toFixed(1)}</span>
            <span className="text-xs font-semibold text-stone-400">Hektar</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
            <span>{blocks.length} Blok Produktif</span>
            <span className="text-emerald-400 flex items-center">
              Lihat Zonasi <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Indeks Kesehatan Tanaman */}
        <div 
          onClick={() => setActiveTab('clinic')}
          className="bg-stone-900/90 hover:bg-stone-850 p-4 rounded-xl border border-stone-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Kesehatan Tanaman (NDVI)</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-teal-300">{avgHealth}%</span>
            <span className="text-xs text-emerald-400 font-medium">Optimal</span>
          </div>
          <div className="mt-1 w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full" 
              style={{ width: `${avgHealth}%` }}
            />
          </div>
        </div>

        {/* Card 3: Target Panen Musim Ini */}
        <div 
          onClick={() => setActiveTab('harvest')}
          className="bg-stone-900/90 hover:bg-stone-850 p-4 rounded-xl border border-stone-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Target Panen Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-amber-300">{targetYieldTotalTon.toFixed(1)}</span>
            <span className="text-xs font-semibold text-stone-400">Tonase</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
            <span>{harvests.length} Rekor Panen Tercatat</span>
            <span className="text-amber-400 flex items-center">
              Detail <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Net Usahatani / Profit */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="bg-stone-900/90 hover:bg-stone-850 p-4 rounded-xl border border-stone-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400">Arus Kas Bersih (Net)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatRupiah(netProfit)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-stone-400">
            <span>R/C: <strong className="text-white">{(totalExpense > 0 ? (totalIncome / totalExpense).toFixed(2) : 'N/A')}</strong></span>
            <span className="text-emerald-400 flex items-center">
              Laporan <ChevronRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Early Warning Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                alert.type === 'warning'
                  ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                  : alert.type === 'success'
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-cyan-950/30 border-cyan-800/60 text-cyan-200'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : alert.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold text-white text-xs">{alert.title}</h4>
                  <p className="text-stone-300 mt-0.5 text-[11px] leading-relaxed">{alert.desc}</p>
                </div>
              </div>
              {alert.actionTab && (
                <button
                  onClick={() => setActiveTab(alert.actionTab!)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700 text-[11px] font-medium transition-colors"
                >
                  Tinjau
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Two Column Layout: Realtime IoT Weather Station & Interactive Field Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): IoT Weather & Soil Telemetry Station */}
        <div className="lg:col-span-5 space-y-6">
          {/* Microclimate IoT Dashboard */}
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-bold text-sm text-white">Stasiun Cuaca & IoT Lahan</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                Stasiun Agro-01 Karawang
              </span>
            </div>

            {/* Weather Metric Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-center">
                <ThermometerSun className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-stone-400 block">Suhu Udara</span>
                <span className="text-base font-bold text-white">{telemetry.airTempC}°C</span>
              </div>

              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-center">
                <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-stone-400 block">Kelembaban Udara</span>
                <span className="text-base font-bold text-cyan-300">{telemetry.humidityPct}%</span>
              </div>

              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-center">
                <SunMedium className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <span className="text-[10px] text-stone-400 block">Radiasi Surya</span>
                <span className="text-base font-bold text-yellow-300">{telemetry.solarRadiationWm2} W/m²</span>
              </div>

              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-center">
                <Gauge className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-stone-400 block">Lengas Tanah</span>
                <span className="text-base font-bold text-emerald-300">{telemetry.soilMoistureAvg}%</span>
              </div>

              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-center">
                <Activity className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <span className="text-[10px] text-stone-400 block">pH Tanah Rata²</span>
                <span className="text-base font-bold text-indigo-300">{telemetry.soilPhAvg}</span>
              </div>

              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-center">
                <Wind className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                <span className="text-[10px] text-stone-400 block">Kec. Angin</span>
                <span className="text-base font-bold text-teal-300">{telemetry.windSpeedKmh} km/j</span>
              </div>
            </div>

            {/* Water Irrigation Usage Today */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-stone-950 to-stone-950 border border-cyan-800/30">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-stone-300 font-medium flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Konsumsi Air Irigasi Hari Ini
                </span>
                <span className="font-bold text-cyan-300">
                  {telemetry.totalWaterUsedTodayLiters.toLocaleString('id-ID')} Liter
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>Evapotranspirasi (ET0): {telemetry.evapotranspirationMm} mm/hari</span>
                <span className="text-emerald-400 font-medium">Efisiensi 94.2%</span>
              </div>
            </div>

            {/* 7-Day Micro Forecast */}
            <div className="space-y-2 pt-2 border-t border-stone-800/80">
              <span className="text-xs font-semibold text-stone-300 block">
                Prakiraan Agroklimat 7 Hari Ke Depan
              </span>
              <div className="grid grid-cols-7 gap-1 text-center">
                {weather.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedWeatherDayIndex(idx)}
                    className={`p-1.5 rounded-lg border text-[10px] transition-all ${
                      selectedWeatherDayIndex === idx
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-sm'
                        : 'bg-stone-950/40 border-stone-800 text-stone-400 hover:bg-stone-800'
                    }`}
                  >
                    <span className="block font-medium truncate">{day.day.split(' ')[0]}</span>
                    <span className="block text-xs my-0.5">
                      {day.condition === 'cerah' ? '☀️' : day.condition.includes('hujan') ? '🌧️' : '⛅'}
                    </span>
                    <span className="block font-bold text-stone-200">{day.tempMax}°</span>
                  </button>
                ))}
              </div>

              {/* Selected Day Advisory */}
              {weather[selectedWeatherDayIndex] && (
                <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs">
                  <div className="flex items-center justify-between font-semibold text-stone-200 mb-1">
                    <span>{weather[selectedWeatherDayIndex].day} ({weather[selectedWeatherDayIndex].date})</span>
                    <span className="text-cyan-400">Peluang Hujan {weather[selectedWeatherDayIndex].rainProbPct}%</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    💡 {weather[selectedWeatherDayIndex].advisoryIndo}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Field Blocks Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Peta Zonasi Petak Lahan Interaktif
                </h3>
                <p className="text-[11px] text-stone-400">
                  Status real-time HST, kelembaban, dan katup irigasi presisi per petak
                </p>
              </div>
              <button
                onClick={() => setActiveTab('blocks')}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <span>Kelola Blok</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Grid Representation of Farm Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="bg-stone-950/70 hover:bg-stone-950 rounded-xl p-3.5 border border-stone-800 hover:border-emerald-500/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span 
                          className="inline-block w-2.5 h-2.5 rounded-full mr-1.5" 
                          style={{ backgroundColor: block.color }}
                        />
                        <span className="font-semibold text-xs text-white">{block.name}</span>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {block.cropType} • <span className="text-emerald-400 font-mono">{block.cropVariety}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-900 text-stone-300 rounded border border-stone-700">
                        {block.areaHa} Ha
                      </span>
                    </div>

                    {/* Progress Stage & HST */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-stone-400">Fase: {block.growthStage}</span>
                        <span className="font-bold text-amber-400">{block.ageDays} HST</span>
                      </div>
                      <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                          style={{ width: `${Math.min(100, (block.ageDays / 110) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Sensor Soil Moisture & NPK Mini Stats */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-stone-300">
                      <div className="p-1.5 bg-stone-900/80 rounded border border-stone-800/80">
                        <span className="text-stone-500 block">Kadar Air</span>
                        <span className={`font-semibold ${block.soilMoisturePct < 60 ? 'text-amber-400' : 'text-cyan-300'}`}>
                          {block.soilMoisturePct}% ({block.soilMoisturePct < 60 ? 'Kering' : 'Cukup'})
                        </span>
                      </div>
                      <div className="p-1.5 bg-stone-900/80 rounded border border-stone-800/80">
                        <span className="text-stone-500 block">pH Tanah</span>
                        <span className="font-semibold text-indigo-300">{block.soilPh} (Netral)</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Irrigation Switch */}
                  <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedBlockId(block.id);
                        setActiveTab('blocks');
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      Detail Agronomi <ArrowUpRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => toggleIrrigation(block.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-all ${
                        block.irrigationStatus === 'active'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse-subtle'
                          : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      <Droplets className="w-3 h-3" />
                      <span>{block.irrigationStatus === 'active' ? 'Irigasi ON' : 'Irigasi OFF'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Farm Activities Timeline & Action Log */}
      <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Log Aktivitas & Penugasan Lapangan Terkini
            </h3>
            <p className="text-[11px] text-stone-400">
              Catatan harian pemupukan, penyemprotan HPT, olah tanah, dan panen
            </p>
          </div>
          <button
            onClick={() => setActiveTab('lifecycle')}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <span>Buka Kalender SOP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.slice(0, 6).map((act) => (
            <div 
              key={act.id}
              className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 hover:border-stone-700 transition-colors space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                  act.type === 'pupuk' ? 'bg-emerald-500/20 text-emerald-300' :
                  act.type === 'pestisida' ? 'bg-amber-500/20 text-amber-300' :
                  act.type === 'panen' ? 'bg-rose-500/20 text-rose-300' :
                  act.type === 'irigasi' ? 'bg-cyan-500/20 text-cyan-300' :
                  'bg-stone-800 text-stone-300'
                }`}>
                  {act.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">{formatDateIndo(act.date)}</span>
              </div>

              <h4 className="font-semibold text-stone-200 line-clamp-1">{act.title}</h4>
              <p className="text-stone-400 text-[11px] line-clamp-2">{act.notes}</p>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
                <span className="text-stone-300 font-medium truncate max-w-[140px]">👤 {act.operator}</span>
                {act.cost > 0 && (
                  <span className="font-mono text-emerald-400 font-semibold">{formatRupiah(act.cost)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
