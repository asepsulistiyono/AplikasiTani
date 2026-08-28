import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FarmBlock, 
  ActivityLog, 
  SaprotanItem, 
  AlsintanItem, 
  HarvestRecord, 
  FinanceTransaction, 
  IoTTelemetry, 
  WeatherForecastDay 
} from '../types';
import { 
  INITIAL_BLOCKS, 
  INITIAL_ACTIVITIES, 
  INITIAL_SAPROTAN, 
  INITIAL_ALSINTAN, 
  INITIAL_HARVESTS, 
  INITIAL_TRANSACTIONS, 
  CURRENT_TELEMETRY, 
  WEATHER_FORECAST 
} from '../data/mockData';

interface FarmContextType {
  blocks: FarmBlock[];
  activities: ActivityLog[];
  saprotan: SaprotanItem[];
  alsintan: AlsintanItem[];
  harvests: HarvestRecord[];
  transactions: FinanceTransaction[];
  telemetry: IoTTelemetry;
  weather: WeatherForecastDay[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  
  // Actions
  addBlock: (block: Omit<FarmBlock, 'id'>) => void;
  updateBlock: (id: string, updates: Partial<FarmBlock>) => void;
  deleteBlock: (id: string) => void;
  toggleIrrigation: (blockId: string) => void;
  
  addActivity: (activity: Omit<ActivityLog, 'id'>) => void;
  updateActivityStatus: (id: string, status: ActivityLog['status']) => void;
  deleteActivity: (id: string) => void;
  
  addSaprotan: (item: Omit<SaprotanItem, 'id'>) => void;
  updateSaprotanStock: (id: string, newStock: number) => void;
  
  addAlsintan: (item: Omit<AlsintanItem, 'id'>) => void;
  updateAlsintanStatus: (id: string, status: AlsintanItem['status']) => void;
  
  addHarvest: (harvest: Omit<HarvestRecord, 'id'>) => void;
  addTransaction: (transaction: Omit<FinanceTransaction, 'id'>) => void;
  
  refreshTelemetry: () => void;
  resetToDefaults: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<FarmBlock[]>(() => {
    const saved = localStorage.getItem('agrismart_blocks');
    return saved ? JSON.parse(saved) : INITIAL_BLOCKS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('agrismart_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [saprotan, setSaprotan] = useState<SaprotanItem[]>(() => {
    const saved = localStorage.getItem('agrismart_saprotan');
    return saved ? JSON.parse(saved) : INITIAL_SAPROTAN;
  });

  const [alsintan, setAlsintan] = useState<AlsintanItem[]>(() => {
    const saved = localStorage.getItem('agrismart_alsintan');
    return saved ? JSON.parse(saved) : INITIAL_ALSINTAN;
  });

  const [harvests, setHarvests] = useState<HarvestRecord[]>(() => {
    const saved = localStorage.getItem('agrismart_harvests');
    return saved ? JSON.parse(saved) : INITIAL_HARVESTS;
  });

  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => {
    const saved = localStorage.getItem('agrismart_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [telemetry, setTelemetry] = useState<IoTTelemetry>(CURRENT_TELEMETRY);
  const [weather] = useState<WeatherForecastDay[]>(WEATHER_FORECAST);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('agrismart_blocks', JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem('agrismart_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('agrismart_saprotan', JSON.stringify(saprotan));
  }, [saprotan]);

  useEffect(() => {
    localStorage.setItem('agrismart_alsintan', JSON.stringify(alsintan));
  }, [alsintan]);

  useEffect(() => {
    localStorage.setItem('agrismart_harvests', JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem('agrismart_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Simulation of live IoT sensor fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        timestamp: new Date().toISOString(),
        airTempC: +(prev.airTempC + (Math.random() * 0.4 - 0.2)).toFixed(1),
        humidityPct: Math.min(98, Math.max(50, Math.round(prev.humidityPct + (Math.random() * 2 - 1)))),
        solarRadiationWm2: Math.min(1100, Math.max(100, Math.round(prev.solarRadiationWm2 + (Math.random() * 20 - 10)))),
        soilMoistureAvg: +(prev.soilMoistureAvg + (Math.random() * 0.4 - 0.2)).toFixed(1)
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const addBlock = (block: Omit<FarmBlock, 'id'>) => {
    const newBlock: FarmBlock = {
      ...block,
      id: `block-${Date.now()}`
    };
    setBlocks(prev => [newBlock, ...prev]);
  };

  const updateBlock = (id: string, updates: Partial<FarmBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const toggleIrrigation = (blockId: string) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        const nextStatus = b.irrigationStatus === 'active' ? 'idle' : 'active';
        return {
          ...b,
          irrigationStatus: nextStatus,
          waterFlowRateLpm: nextStatus === 'active' ? (b.irrigationType === 'drip' ? 12 : 35) : 0,
          soilMoisturePct: nextStatus === 'active' ? Math.min(95, b.soilMoisturePct + 4) : b.soilMoisturePct
        };
      }
      return b;
    }));
  };

  const addActivity = (activity: Omit<ActivityLog, 'id'>) => {
    const newAct: ActivityLog = {
      ...activity,
      id: `act-${Date.now()}`
    };
    setActivities(prev => [newAct, ...prev]);

    // If cost > 0, auto record to finance transaction
    if (activity.cost > 0) {
      addTransaction({
        date: activity.date,
        type: 'pengeluaran',
        category: activity.type === 'pupuk' || activity.type === 'pestisida' ? 'saprotan' : 'tenaga_kerja',
        amount: activity.cost,
        description: `Biaya Aktivitas: ${activity.title} (${activity.blockName})`,
        blockId: activity.blockId,
        blockName: activity.blockName,
        paymentMethod: 'Tunai'
      });
    }
  };

  const updateActivityStatus = (id: string, status: ActivityLog['status']) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const addSaprotan = (item: Omit<SaprotanItem, 'id'>) => {
    const newItem: SaprotanItem = {
      ...item,
      id: `sap-${Date.now()}`
    };
    setSaprotan(prev => [newItem, ...prev]);
  };

  const updateSaprotanStock = (id: string, newStock: number) => {
    setSaprotan(prev => prev.map(s => s.id === id ? { ...s, stock: newStock } : s));
  };

  const addAlsintan = (item: Omit<AlsintanItem, 'id'>) => {
    const newItem: AlsintanItem = {
      ...item,
      id: `als-${Date.now()}`
    };
    setAlsintan(prev => [newItem, ...prev]);
  };

  const updateAlsintanStatus = (id: string, status: AlsintanItem['status']) => {
    setAlsintan(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const addHarvest = (harvest: Omit<HarvestRecord, 'id'>) => {
    const newHarvest: HarvestRecord = {
      ...harvest,
      id: `hrv-${Date.now()}`
    };
    setHarvests(prev => [newHarvest, ...prev]);

    // Auto record revenue transaction
    if (harvest.totalRevenue > 0) {
      addTransaction({
        date: harvest.harvestDate,
        type: 'pemasukan',
        category: 'penjualan_panen',
        amount: harvest.totalRevenue,
        description: `Hasil Panen: ${harvest.cropType} (${harvest.variety}) - ${harvest.totalWeightKg.toLocaleString('id-ID')} kg`,
        blockId: harvest.blockId,
        blockName: harvest.blockName,
        paymentMethod: 'Transfer Bank'
      });
    }
  };

  const addTransaction = (transaction: Omit<FinanceTransaction, 'id'>) => {
    const newTrx: FinanceTransaction = {
      ...transaction,
      id: `trx-${Date.now()}`
    };
    setTransactions(prev => [newTrx, ...prev]);
  };

  const refreshTelemetry = () => {
    setTelemetry({
      timestamp: new Date().toISOString(),
      airTempC: +(27 + Math.random() * 4).toFixed(1),
      humidityPct: Math.round(65 + Math.random() * 25),
      rainfallMm: Math.random() > 0.7 ? +(Math.random() * 5).toFixed(1) : 0,
      solarRadiationWm2: Math.round(450 + Math.random() * 400),
      windSpeedKmh: +(6 + Math.random() * 8).toFixed(1),
      uvIndex: +(5 + Math.random() * 4).toFixed(1),
      soilMoistureAvg: +(60 + Math.random() * 20).toFixed(1),
      soilPhAvg: +(6.2 + Math.random() * 0.6).toFixed(2),
      totalWaterUsedTodayLiters: Math.round(12000 + Math.random() * 4000),
      evapotranspirationMm: +(3.8 + Math.random() * 1.5).toFixed(1)
    });
  };

  const resetToDefaults = () => {
    setBlocks(INITIAL_BLOCKS);
    setActivities(INITIAL_ACTIVITIES);
    setSaprotan(INITIAL_SAPROTAN);
    setAlsintan(INITIAL_ALSINTAN);
    setHarvests(INITIAL_HARVESTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setTelemetry(CURRENT_TELEMETRY);
    localStorage.clear();
  };

  return (
    <FarmContext.Provider
      value={{
        blocks,
        activities,
        saprotan,
        alsintan,
        harvests,
        transactions,
        telemetry,
        weather,
        activeTab,
        setActiveTab,
        selectedBlockId,
        setSelectedBlockId,
        addBlock,
        updateBlock,
        deleteBlock,
        toggleIrrigation,
        addActivity,
        updateActivityStatus,
        deleteActivity,
        addSaprotan,
        updateSaprotanStock,
        addAlsintan,
        updateAlsintanStatus,
        addHarvest,
        addTransaction,
        refreshTelemetry,
        resetToDefaults
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
