import React, { useState } from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  MapPin, 
  CalendarClock, 
  Stethoscope, 
  FlaskConical, 
  PackageSearch, 
  Coins, 
  Bot, 
  CloudSun, 
  Droplets, 
  Download, 
  Upload, 
  RotateCcw, 
  Layers,
  Sparkles,
  Wifi,
  ChevronDown
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { exportToJsonFile } from '../utils/agriUtils';

interface HeaderNavbarProps {
  onOpenAgriBot: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({ onOpenAgriBot }) => {
  const { 
    activeTab, 
    setActiveTab, 
    telemetry, 
    blocks, 
    saprotan, 
    alsintan, 
    harvests, 
    transactions, 
    activities,
    resetToDefaults 
  } = useFarm();

  const [showBackupMenu, setShowBackupMenu] = useState(false);

  const activeIrrigationCount = blocks.filter(b => b.irrigationStatus === 'active').length;
  const totalArea = blocks.reduce((acc, b) => acc + b.areaHa, 0);

  const handleExportAll = () => {
    const fullBackup = {
      appName: 'AgriSmart Nusantara',
      backupDate: new Date().toISOString(),
      blocks,
      activities,
      saprotan,
      alsintan,
      harvests,
      transactions
    };
    exportToJsonFile(fullBackup, 'AgriSmart_Nusantara_Backup');
    setShowBackupMenu(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & IoT', icon: LayoutDashboard },
    { id: 'blocks', label: 'Blok & Zonasi Lahan', icon: MapPin, badge: `${blocks.length} Petak` },
    { id: 'lifecycle', label: 'Kalender & SOP', icon: CalendarClock },
    { id: 'clinic', label: 'Klinik AI & Hama', icon: Stethoscope, badge: 'AI Pro', isSpecial: true },
    { id: 'fertilizer', label: 'Nutrisi Presisi', icon: FlaskConical },
    { id: 'inventory', label: 'Saprotan & Alsintan', icon: PackageSearch },
    { id: 'harvest', label: 'Panen & Logistik', icon: Layers },
    { id: 'finance', label: 'Analisis Keuangan', icon: Coins }
  ];

  return (
    <header className="bg-stone-950/90 backdrop-blur-md border-b border-stone-800 sticky top-0 z-40">
      {/* Top Bar with Live Telemetry Ticker & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                AgriSmart <span className="text-emerald-400 font-semibold">Nusantara</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                v2.6 Terpadu
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Integrated Precision Agriculture & Farm Operations
            </p>
          </div>
        </div>

        {/* Live Telemetry Pill */}
        <div className="hidden md:flex items-center space-x-4 bg-stone-900/80 px-3.5 py-1.5 rounded-lg border border-stone-800/80 text-stone-300">
          <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
            <CloudSun className="w-3.5 h-3.5" />
            <span>{telemetry.airTempC}°C</span>
            <span className="text-stone-500">|</span>
            <span className="text-stone-400">{telemetry.humidityPct}% RH</span>
          </div>

          <div className="h-3 w-px bg-stone-800" />

          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Droplets className="w-3.5 h-3.5" />
            <span>Tanah: {telemetry.soilMoistureAvg}%</span>
          </div>

          <div className="h-3 w-px bg-stone-800" />

          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span>{activeIrrigationCount} Katup Aktif</span>
          </div>
        </div>

        {/* Action Controls & AI Bot Trigger */}
        <div className="flex items-center space-x-2">
          {/* AgriBot Assistant AI Button */}
          <button
            onClick={onOpenAgriBot}
            id="btn-open-agribot"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
            <span className="text-xs">Konsultan AI</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] bg-white/20 rounded font-mono">Gemini</span>
          </button>

          {/* Quick Clinic Scanner */}
          <button
            onClick={() => setActiveTab('clinic')}
            id="btn-quick-clinic"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs">Scan Tanaman</span>
          </button>

          {/* Backup & Tools Menu */}
          <div className="relative">
            <button
              onClick={() => setShowBackupMenu(!showBackupMenu)}
              className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 transition-colors flex items-center gap-1"
              title="Data & Cadangan"
            >
              <Download className="w-3.5 h-3.5" />
              <ChevronDown className="w-3 h-3" />
            </button>

            {showBackupMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl p-1.5 z-50 text-stone-200">
                <div className="px-3 py-2 border-b border-stone-800/80 text-[11px] text-stone-400">
                  Total Lahan: <strong className="text-white">{totalArea.toFixed(1)} Ha</strong> ({blocks.length} blok)
                </div>
                <button
                  onClick={handleExportAll}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-xs rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ekspor Backup JSON</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Kembalikan data ke contoh standar pertanian nusantara?')) {
                      resetToDefaults();
                      setShowBackupMenu(false);
                    }
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-xs rounded-lg hover:bg-rose-950/30 text-rose-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset Data Standar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto no-scrollbar border-t border-stone-800/60 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/50'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  item.isSpecial 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : isActive 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-stone-800 text-stone-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
