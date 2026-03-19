/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Ruler, 
  Weight, 
  Thermometer, 
  Droplets, 
  Square, 
  Zap, 
  Clock, 
  HardDrive, 
  Coins, 
  ArrowLeftRight, 
  Star, 
  History, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  X,
  Menu,
  Languages,
  Trash2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UnitCategory, Unit, Language, LANGUAGES, TRANSLATIONS, ConversionResult } from './types';
import { UNITS } from './constants';

const CATEGORIES: { id: UnitCategory; icon: any; color: string }[] = [
  { id: 'length', icon: Ruler, color: 'bg-blue-500' },
  { id: 'weight', icon: Weight, color: 'bg-orange-500' },
  { id: 'temperature', icon: Thermometer, color: 'bg-red-500' },
  { id: 'volume', icon: Droplets, color: 'bg-cyan-500' },
  { id: 'area', icon: Square, color: 'bg-emerald-500' },
  { id: 'speed', icon: Zap, color: 'bg-yellow-500' },
  { id: 'time', icon: Clock, color: 'bg-purple-500' },
  { id: 'digital', icon: HardDrive, color: 'bg-indigo-500' },
  { id: 'currency', icon: Coins, color: 'bg-green-500' },
];

export default function App() {
  const [lang, setLang] = useState<string>(() => localStorage.getItem('lang') || 'en');
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [value, setValue] = useState<string>('1');
  const [recent, setRecent] = useState<ConversionResult[]>(() => {
    const saved = localStorage.getItem('recent');
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [view, setView] = useState<'main' | 'settings' | 'history' | 'favorites' | 'privacy'>('main');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const t = (key: string) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key] || key;
  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = currentLang.dir;
  }, [lang, currentLang]);

  useEffect(() => {
    localStorage.setItem('recent', JSON.stringify(recent));
  }, [recent]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const units = UNITS[category];
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id || units[0].id);
  }, [category]);

  const result = useMemo(() => {
    const units = UNITS[category];
    const from = units.find(u => u.id === fromUnit);
    const to = units.find(u => u.id === toUnit);
    const val = parseFloat(value);

    if (!from || !to || isNaN(val)) return 0;

    if (category === 'temperature') {
      // Special handling for temperature
      let baseVal = 0;
      if (from.id === 'c') baseVal = val;
      else if (from.id === 'f') baseVal = (val - 32) * (5/9);
      else if (from.id === 'k') baseVal = val - 273.15;

      if (to.id === 'c') return baseVal;
      else if (to.id === 'f') return baseVal * (9/5) + 32;
      else if (to.id === 'k') return baseVal + 273.15;
      return 0;
    }

    // Standard conversion: val * fromFactor / toFactor
    // baseVal = val * fromFactor
    // result = baseVal / toFactor
    return (val * from.factor) / to.factor;
  }, [category, fromUnit, toUnit, value]);

  const handleConvert = () => {
    const newResult: ConversionResult = {
      from: fromUnit,
      to: toUnit,
      value: parseFloat(value),
      result,
      timestamp: Date.now(),
    };
    setRecent(prev => [newResult, ...prev.slice(0, 19)]);
  };

  const toggleFavorite = () => {
    const favId = `${category}:${fromUnit}:${toUnit}`;
    setFavorites(prev => 
      prev.includes(favId) ? prev.filter(f => f !== favId) : [...prev, favId]
    );
  };

  const isFavorite = favorites.includes(`${category}:${fromUnit}:${toUnit}`);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const renderFavorites = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-2">{t('favorites')}</h2>
      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Star size={48} className="mx-auto mb-4 opacity-20" />
          <p>{t('noFavorites')}</p>
        </div>
      ) : (
        favorites.map((fav, i) => {
          const [cat, from, to] = fav.split(':');
          const units = UNITS[cat as UnitCategory];
          const fromU = units.find(u => u.id === from);
          const toU = units.find(u => u.id === to);
          return (
            <button 
              key={i} 
              onClick={() => {
                setCategory(cat as UnitCategory);
                setFromUnit(from);
                setToUnit(to);
                setView('main');
              }}
              className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white ${CATEGORIES.find(c => c.id === cat)?.color}`}>
                  {React.createElement(CATEGORIES.find(c => c.id === cat)?.icon || Ruler, { size: 16 })}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">{t(cat)}</p>
                  <p className="font-bold text-gray-700">
                    {fromU?.symbol} → {toU?.symbol}
                  </p>
                </div>
              </div>
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
            </button>
          );
        })
      )}
    </div>
  );

  const renderMain = () => (
    <div className="flex flex-col h-full">
      {/* Conversion Card */}
      <div className="px-4 pt-4 flex-1">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <div className="space-y-6">
            {/* From */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{t('from')}</label>
              <div className="flex items-stretch gap-2">
                <div className="flex-[2] relative">
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full text-3xl font-black bg-gray-50 text-gray-900 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 border-2 border-transparent focus:border-blue-500/20 transition-all"
                  />
                </div>
                <div className="flex-1 relative">
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full h-full appearance-none bg-gray-100 text-gray-700 rounded-2xl px-4 pr-10 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 border-2 border-transparent transition-all cursor-pointer"
                  >
                    {UNITS[category].map(u => (
                      <option key={u.id} value={u.id}>{u.symbol} - {u.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10 gap-4">
              <button 
                onClick={swapUnits}
                className="bg-white border-4 border-gray-50 p-3 rounded-full shadow-lg hover:rotate-180 transition-transform duration-500 text-blue-600 active:scale-90"
              >
                <ArrowLeftRight size={20} />
              </button>
              <button 
                onClick={toggleFavorite}
                className={`bg-white border-4 border-gray-50 p-3 rounded-full shadow-lg transition-all active:scale-90 ${isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{t('to')}</label>
              <div className="flex items-stretch gap-2">
                <div className="flex-[2] relative">
                  <div className="w-full text-3xl font-black bg-blue-50 text-blue-600 rounded-2xl px-5 py-4 border-2 border-blue-100/50 overflow-hidden whitespace-nowrap text-ellipsis">
                    {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  </div>
                </div>
                <div className="flex-1 relative">
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full h-full appearance-none bg-blue-100/50 text-blue-700 rounded-2xl px-4 pr-10 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 border-2 border-transparent transition-all cursor-pointer"
                  >
                    {UNITS[category].map(u => (
                      <option key={u.id} value={u.id}>{u.symbol} - {u.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConvert}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
            >
              {t('convert')}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button 
            onClick={() => setView('history')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <History size={18} />
            </div>
            <span className="font-bold text-sm text-gray-700">{t('recent')}</span>
          </button>
          <button 
            onClick={() => setView('favorites')}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Star size={18} />
            </div>
            <span className="font-bold text-sm text-gray-700">{t('favorites')}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">{t('recent')}</h2>
        <button onClick={() => setRecent([])} className="text-gray-400 hover:text-red-500">
          <Trash2 size={20} />
        </button>
      </div>
      {recent.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <History size={48} className="mx-auto mb-4 opacity-20" />
          <p>{t('noRecent')}</p>
        </div>
      ) : (
        recent.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">{new Date(item.timestamp).toLocaleTimeString()}</p>
              <p className="font-bold text-gray-700">
                {item.value} {item.from} → {item.result.toFixed(4)} {item.to}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        ))
      )}
    </div>
  );

  const renderPrivacy = () => (
    <div className="p-4 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Lock size={28} fill="white" />
          </div>
          <div>
            <h2 className="text-xl font-black">Privacy Policy</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('title')}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          OmniConverter is a local-only web app. It does not collect or transmit your data—everything stays in your browser.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          The app stores recent conversions and favorites in localStorage. No analytics, ads, or tracking scripts are included.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          For the full policy, visit <a className="text-blue-600 hover:text-blue-800" href={`${import.meta.env.BASE_URL}privacy.html`}>this page</a>.
        </p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-4 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
            <Zap size={28} fill="white" />
          </div>
          <div>
            <h2 className="text-xl font-black">{t('title')}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v1.0.0.1</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{t('description')}</p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Languages size={14} />
          {t('language')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`p-3 rounded-xl border font-bold text-sm transition-all ${
                lang === l.code 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-600 border-gray-100'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={() => setView('privacy')}
          className="w-full text-left text-sm text-blue-600 font-semibold hover:text-blue-800"
        >
          Privacy Policy
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="px-6 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full bg-white text-gray-400 shadow-sm border border-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-black">{t('title')}</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{t(category)}</p>
            </div>
          </div>
          <button 
            onClick={() => setView(view === 'settings' ? 'main' : 'settings')}
            className={`p-2 rounded-full transition-colors ${view === 'settings' ? 'bg-black text-white' : 'bg-white text-gray-400 shadow-sm border border-gray-100'}`}
          >
            {view === 'settings' ? <X size={20} /> : <Settings size={20} />}
          </button>
        </header>

        {/* Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: currentLang.dir === 'rtl' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: currentLang.dir === 'rtl' ? '100%' : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`absolute top-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col ${currentLang.dir === 'rtl' ? 'right-0' : 'left-0'}`}
              >
                <div className="p-6 border-b border-gray-100 relative">
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Zap size={24} fill="white" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter">{t('title')}</h2>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed pr-8">{t('description')}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategory(cat.id);
                        setIsSidebarOpen(false);
                        setView('main');
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        category === cat.id 
                          ? `${cat.color} text-white shadow-lg` 
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <cat.icon size={20} />
                      <span className="font-bold">{t(cat.id)}</span>
                    </button>
                  ))}
                </div>
                <div className="p-6 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">OmniConverter v1.0</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {view === 'main' && renderMain()}
              {view === 'history' && renderHistory()}
              {view === 'settings' && renderSettings()}
              {view === 'favorites' && renderFavorites()}
              {view === 'privacy' && renderPrivacy()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Nav */}
        {view !== 'main' && (
          <div className="p-6">
            <button 
              onClick={() => setView('main')}
              className="w-full bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              {t('clear')}
            </button>
          </div>
        )}

        {/* Decorative Background Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
