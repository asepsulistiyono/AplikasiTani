import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { HeaderNavbar } from './components/HeaderNavbar';
import { DashboardOverview } from './components/DashboardOverview';
import { FieldBlockManager } from './components/FieldBlockManager';
import { CropLifecycleManager } from './components/CropLifecycleManager';
import { PlantClinicAI } from './components/PlantClinicAI';
import { SmartFertilizerCalculator } from './components/SmartFertilizerCalculator';
import { InventoryManager } from './components/InventoryManager';
import { HarvestYieldManager } from './components/HarvestYieldManager';
import { FinanceAnalysis } from './components/FinanceAnalysis';
import { AgriAdvisorChatModal } from './components/AgriAdvisorChatModal';
import { Bot, Sparkles, Sprout, Heart } from 'lucide-react';

const FarmAppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useFarm();
  const [isAgriBotOpen, setIsAgriBotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0f0d] text-stone-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Header & Navigation */}
      <HeaderNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview onOpenAgriBot={() => setIsAgriBotOpen(true)} />
        )}
        {activeTab === 'blocks' && <FieldBlockManager />}
        {activeTab === 'lifecycle' && <CropLifecycleManager />}
        {activeTab === 'clinic' && <PlantClinicAI />}
        {activeTab === 'fertilizer' && <SmartFertilizerCalculator />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'harvest' && <HarvestYieldManager />}
        {activeTab === 'finance' && <FinanceAnalysis />}
      </main>

      {/* Global Floating AI Agronomist Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAgriBotOpen(true)}
          id="btn-floating-agribot"
          className="group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-bold text-xs shadow-2xl shadow-emerald-950/80 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95 hover:shadow-emerald-500/20"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-stone-900" />
          </div>
          <span className="tracking-wide">Tanya Agronomis AI</span>
          <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Slide-over / Modal AI Chatbot */}
      <AgriAdvisorChatModal
        isOpen={isAgriBotOpen}
        onClose={() => setIsAgriBotOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-[#080b09] py-6 mt-12 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-stone-200">AgriSmart Nusantara</span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400 text-[11px]">Sistem Pertanian Presisi Terpadu Berbasis AI</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-stone-400">
            <span>Standar GAP & Kementan RI</span>
            <span>•</span>
            <span>Gemini 3.7 Flash Engine</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">IoT Telemetri Aktif</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <FarmProvider>
      <FarmAppContent />
    </FarmProvider>
  );
}

export default App;
