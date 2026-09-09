import React, { useState } from 'react';
import { F2L_DATA, OLL_DATA, PLL_DATA, AlgCase } from './data/cfopData';
import { CMLL_DATA, LSE_DATA, ROUX_STEPS } from './data/rouxData';
import { AlgCard } from './components/AlgCard';
import { AlgModal } from './components/AlgModal';
import { AlgFilterBar, SortOption, getMoveCount } from './components/AlgFilterBar';
import { CsTimer } from './components/CsTimer';
import { TrainAlgorithms } from './components/TrainAlgorithms';
import type { CaseType } from './components/Cube3D';

export type MainNavOption = '3x3' | 'timer' | 'train';
export type MethodType = 'CFOP' | 'ROUX';
export type CfopSubcategory = 'F2L' | 'OLL' | 'PLL';
export type RouxSubcategory = 'CMLL' | 'LSE' | 'STEPS';

export default function App() {
  const [activeNav, setActiveNav] = useState<MainNavOption>('3x3');
  const [selectedMethod, setSelectedMethod] = useState<MethodType | null>(null);
  const [selectedCfopCategory, setSelectedCfopCategory] = useState<CfopSubcategory | null>(null);
  const [selectedRouxCategory, setSelectedRouxCategory] = useState<RouxSubcategory | null>(null);

  // Sorting & Filtering State
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupByCategory, setGroupByCategory] = useState<boolean>(false);

  // Full Screen Modal State
  const [modalCase, setModalCase] = useState<AlgCase | null>(null);

  // Reset filter when category changes
  const handleSelectCfop = (cat: CfopSubcategory) => {
    setSelectedCfopCategory(cat);
    setSelectedGroupFilter('ALL');
    setSearchQuery('');
  };

  const handleSelectRoux = (cat: RouxSubcategory) => {
    setSelectedRouxCategory(cat);
    setSelectedGroupFilter('ALL');
    setSearchQuery('');
  };

  // Filter current raw CFOP cases
  const rawCfopCases: AlgCase[] = React.useMemo(() => {
    if (selectedCfopCategory === 'F2L') return F2L_DATA;
    if (selectedCfopCategory === 'OLL') return OLL_DATA;
    if (selectedCfopCategory === 'PLL') return PLL_DATA;
    return [];
  }, [selectedCfopCategory]);

  // Determine caseType for proper cube visualization masking
  const cfopCaseType: CaseType = selectedCfopCategory === 'OLL' ? 'oll' : selectedCfopCategory === 'PLL' ? 'pll' : selectedCfopCategory === 'F2L' ? 'f2l' : 'other';

  // Filter current raw Roux cases
  const rawRouxCases: AlgCase[] = React.useMemo(() => {
    if (selectedRouxCategory === 'CMLL') return CMLL_DATA;
    if (selectedRouxCategory === 'LSE') return LSE_DATA;
    return [];
  }, [selectedRouxCategory]);

  // Process sorting & filtering
  const processCases = (rawList: AlgCase[]) => {
    let result = rawList;

    // Filter by group/shape
    if (selectedGroupFilter !== 'ALL') {
      result = result.filter((c) => (c.group || 'Other') === selectedGroupFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.alg.toLowerCase().includes(q) ||
          (c.group && c.group.toLowerCase().includes(q)) ||
          c.id.toLowerCase().includes(q)
      );
    }

    // Sort cases
    result = [...result].sort((a, b) => {
      if (sortBy === 'group') {
        const gA = a.group || '';
        const gB = b.group || '';
        if (gA !== gB) return gA.localeCompare(gB);
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      }
      if (sortBy === 'moves-asc') {
        return getMoveCount(a.alg) - getMoveCount(b.alg);
      }
      if (sortBy === 'moves-desc') {
        return getMoveCount(b.alg) - getMoveCount(a.alg);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name, undefined, { numeric: true });
      }
      return 0; // default
    });

    return result;
  };

  const currentCfopCases = React.useMemo(() => processCases(rawCfopCases), [rawCfopCases, selectedGroupFilter, searchQuery, sortBy]);
  const currentRouxCases = React.useMemo(() => processCases(rawRouxCases), [rawRouxCases, selectedGroupFilter, searchQuery, sortBy]);

  // Grouped cases mapping for CFOP
  const groupedCfopCases = React.useMemo(() => {
    const groups: Record<string, AlgCase[]> = {};
    currentCfopCases.forEach((item) => {
      const g = item.group || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });
    return groups;
  }, [currentCfopCases]);

  // Grouped cases mapping for Roux
  const groupedRouxCases = React.useMemo(() => {
    const groups: Record<string, AlgCase[]> = {};
    currentRouxCases.forEach((item) => {
      const g = item.group || 'Other';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });
    return groups;
  }, [currentRouxCases]);

  // Current active list for next/prev navigation in modal
  const activeCasesList: AlgCase[] = React.useMemo(() => {
    if (selectedMethod === 'CFOP') return currentCfopCases;
    if (selectedMethod === 'ROUX') return currentRouxCases;
    return [];
  }, [selectedMethod, currentCfopCases, currentRouxCases]);

  const handleNextModal = () => {
    if (!modalCase || activeCasesList.length === 0) return;
    const currentIndex = activeCasesList.findIndex((c) => c.id === modalCase.id);
    const nextIndex = (currentIndex + 1) % activeCasesList.length;
    setModalCase(activeCasesList[nextIndex]);
  };

  const handlePrevModal = () => {
    if (!modalCase || activeCasesList.length === 0) return;
    const currentIndex = activeCasesList.findIndex((c) => c.id === modalCase.id);
    const prevIndex = (currentIndex - 1 + activeCasesList.length) % activeCasesList.length;
    setModalCase(activeCasesList[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-slate-100 flex flex-col font-sans w-full">
      {/* Top Header Bar */}
      <header className="px-6 py-3.5 bg-[#0d0f12] sticky top-0 z-30 border-b border-slate-800/80 flex items-center justify-between w-full shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-6">
          {/* Logo + Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNav('3x3')}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/50 flex items-center justify-center overflow-hidden p-1 shadow-inner">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <h1 className="font-bison text-3xl font-extrabold tracking-wider text-cyan-400">
              CUBER'S ZONE
            </h1>
          </div>

          {/* Primary Top Bar Navigation */}
          <nav className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveNav('3x3')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeNav === '3x3'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
            >
              <span>🎲</span> 3x3
            </button>

            <button
              onClick={() => setActiveNav('timer')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeNav === 'timer'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
            >
              <span>⏱</span> Timer
            </button>

            <button
              onClick={() => setActiveNav('train')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeNav === 'train'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
            >
              <span>⚡</span> Train Algorithms
            </button>
          </nav>
        </div>

        {/* Right Status Badge */}
        <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Speedcubing Hub
          </span>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* VIEW 1: 3x3 METHODS HUB */}
        {activeNav === '3x3' && (
          <div className="w-full flex flex-col gap-6">
            {/* Section Header */}
            <div>
              <h2 className="font-bison text-3xl text-slate-100 tracking-wider">
                3x3 Solving Methods
              </h2>
              <p className="text-sm text-slate-400 font-sans mt-0.5">
                Select a solving method below to get started.
              </p>
            </div>

            {/* SIDE BY SIDE: CFOP and ROUX (One beside the other) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {/* Method Card 1: CFOP */}
              <div
                onClick={() => {
                  setSelectedMethod('CFOP');
                  setSelectedCfopCategory(null); // Do not show cases yet until subcategory chosen
                }}
                className={`cursor-pointer rounded-2xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between shadow-xl ${selectedMethod === 'CFOP'
                    ? 'bg-gradient-to-br from-[#131b26] to-[#0e1218] border-cyan-500 shadow-cyan-950/50 ring-2 ring-cyan-500/40'
                    : 'bg-[#121418] border-slate-800/80 hover:border-slate-700 hover:bg-[#15181e]'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-0.5 rounded-md">
                      Speedcubing Standard
                    </span>
                    <h3 className="font-bison text-3xl text-slate-100 tracking-wide mt-2">
                      CFOP Method (Fridrich)
                    </h3>
                  </div>
                  <div className="text-3xl">⚡</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  The most popular world-record method. Built on 4 phases: <strong>Cross</strong>, <strong>F2L</strong> (First Two Layers), <strong>OLL</strong> (Orient Last Layer), and <strong>PLL</strong> (Permute Last Layer).
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs font-mono">
                  <span className="text-slate-400">119 Algorithms total</span>
                  <span className={`font-bold ${selectedMethod === 'CFOP' ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {selectedMethod === 'CFOP' ? '● Selected' : 'Click to Select →'}
                  </span>
                </div>
              </div>

              {/* Method Card 2: ROUX */}
              <div
                onClick={() => {
                  setSelectedMethod('ROUX');
                  setSelectedRouxCategory(null); // Do not show cases yet until subcategory chosen
                }}
                className={`cursor-pointer rounded-2xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between shadow-xl ${selectedMethod === 'ROUX'
                    ? 'bg-gradient-to-br from-[#1f1629] to-[#0e1218] border-purple-500 shadow-purple-950/50 ring-2 ring-purple-500/40'
                    : 'bg-[#121418] border-slate-800/80 hover:border-slate-700 hover:bg-[#15181e]'
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2.5 py-0.5 rounded-md">
                      Block Building
                    </span>
                    <h3 className="font-bison text-3xl text-slate-100 tracking-wide mt-2">
                      Roux Method
                    </h3>
                  </div>
                  <div className="text-3xl">🧩</div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  High-efficiency, rotationless method. Solves two 1x2x3 blocks, solves corners with <strong>CMLL</strong>, and completes the last 6 edges with intuitive <strong>M & U</strong> moves (LSE).
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs font-mono">
                  <span className="text-slate-400">Low move count (~48 moves)</span>
                  <span className={`font-bold ${selectedMethod === 'ROUX' ? 'text-purple-400' : 'text-slate-500'}`}>
                    {selectedMethod === 'ROUX' ? '● Selected' : 'Click to Select →'}
                  </span>
                </div>
              </div>
            </div>

            {/* IF NO METHOD SELECTED YET: Show gentle prompt, NO cases */}
            {!selectedMethod && (
              <div className="w-full bg-[#121418]/60 border border-slate-800/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2 mt-2">
                <span className="text-3xl">👆</span>
                <h3 className="font-bison text-2xl text-slate-200 tracking-wide">
                  Choose a method above
                </h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Click on either <strong>CFOP</strong> or <strong>Roux</strong> to view the algorithm subsets and step-by-step techniques.
                </p>
              </div>
            )}

            {/* 1. CFOP SELECTED */}
            {selectedMethod === 'CFOP' && (
              <div className="w-full flex flex-col gap-6 mt-2 animate-fadeIn">
                {/* 3 Buttons: F2L, OLL, PLL */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121418] p-4 rounded-2xl border border-slate-800/80 shadow-md">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Choose Stage:
                    </span>
                    <button
                      onClick={() => handleSelectCfop('F2L')}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCfopCategory === 'F2L'
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400'
                          : 'bg-[#16191e] text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      F2L ({F2L_DATA.length} Cases)
                    </button>
                    <button
                      onClick={() => handleSelectCfop('OLL')}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCfopCategory === 'OLL'
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400'
                          : 'bg-[#16191e] text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      OLL ({OLL_DATA.length} Cases)
                    </button>
                    <button
                      onClick={() => handleSelectCfop('PLL')}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCfopCategory === 'PLL'
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400'
                          : 'bg-[#16191e] text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      PLL ({PLL_DATA.length} Cases)
                    </button>
                  </div>

                  <span className="text-xs font-mono text-slate-500 hidden lg:block">
                    💡 Click any algorithm below to expand into full-screen 3D animation
                  </span>
                </div>

                {/* IF SUBSTAGE NOT CHOSEN YET: Don't show cases yet! */}
                {!selectedCfopCategory && (
                  <div className="w-full bg-[#121418]/60 border border-slate-800/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">✨</span>
                    <h3 className="font-bison text-2xl text-slate-200 tracking-wide">
                      Select F2L, OLL, or PLL
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md">
                      Pick one of the 3 buttons above to load all the algorithm cases and interactive 3D visualizers.
                    </p>
                  </div>
                )}

                {/* ONCE SUBSTAGE IS CHOSEN: Show Filter Bar & Sorted/Grouped Algorithms */}
                {selectedCfopCategory && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    {/* Filter & Sort Controls */}
                    <AlgFilterBar
                      cases={rawCfopCases}
                      selectedGroup={selectedGroupFilter}
                      onSelectGroup={setSelectedGroupFilter}
                      sortBy={sortBy}
                      onChangeSortBy={setSortBy}
                      searchQuery={searchQuery}
                      onChangeSearchQuery={setSearchQuery}
                      groupByCategory={groupByCategory}
                      onToggleGroupByCategory={() => setGroupByCategory(!groupByCategory)}
                      groupLabel={selectedCfopCategory === 'OLL' ? 'Shapes' : 'Categories'}
                    />

                    {/* No matching results alert */}
                    {currentCfopCases.length === 0 ? (
                      <div className="w-full bg-[#121418] border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                        <span className="text-2xl">🔍</span>
                        <p className="text-sm font-mono text-slate-400">
                          No algorithms match "{searchQuery}" in {selectedGroupFilter !== 'ALL' ? `group "${selectedGroupFilter}"` : 'this set'}.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedGroupFilter('ALL');
                            setSearchQuery('');
                          }}
                          className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : groupByCategory ? (
                      /* Grouped by Shape / Category View */
                      <div className="flex flex-col gap-8 animate-fadeIn">
                        {Object.entries(groupedCfopCases).map(([groupTitle, cases]) => (
                          <div key={groupTitle} className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-2">
                              <h3 className="font-bison text-2xl text-cyan-400 tracking-wide">
                                {groupTitle}
                              </h3>
                              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                                {cases.length} {cases.length === 1 ? 'Case' : 'Cases'}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {cases.map((item) => (
                                <AlgCard
                                  key={item.id}
                                  item={item}
                                  onClick={() => setModalCase(item)}
                                  caseType={cfopCaseType}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Flat Grid View */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                        {currentCfopCases.map((item) => (
                          <AlgCard
                            key={item.id}
                            item={item}
                            onClick={() => setModalCase(item)}
                            caseType={cfopCaseType}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. ROUX SELECTED */}
            {selectedMethod === 'ROUX' && (
              <div className="w-full flex flex-col gap-6 mt-2 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121418] p-4 rounded-2xl border border-slate-800/80 shadow-md">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Choose Step:
                    </span>
                    <button
                      onClick={() => handleSelectRoux('CMLL')}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedRouxCategory === 'CMLL'
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 ring-2 ring-purple-400'
                          : 'bg-[#16191e] text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      CMLL ({CMLL_DATA.length} Cases)
                    </button>
                    <button
                      onClick={() => handleSelectRoux('LSE')}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedRouxCategory === 'LSE'
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 ring-2 ring-purple-400'
                          : 'bg-[#16191e] text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      LSE Step 4 ({LSE_DATA.length} Cases)
                    </button>
                    <button
                      onClick={() => handleSelectRoux('STEPS')}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedRouxCategory === 'STEPS'
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 ring-2 ring-purple-400'
                          : 'bg-[#16191e] text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      4-Step Overview
                    </button>
                  </div>

                  <span className="text-xs font-mono text-slate-500 hidden lg:block">
                    💡 Click any algorithm below to expand into full-screen 3D animation
                  </span>
                </div>

                {!selectedRouxCategory && (
                  <div className="w-full bg-[#121418]/60 border border-slate-800/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">🧩</span>
                    <h3 className="font-bison text-2xl text-slate-200 tracking-wide">
                      Select a Roux Step
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md">
                      Choose CMLL, LSE, or the 4-Step Overview above to explore Roux methods.
                    </p>
                  </div>
                )}

                {/* CMLL Cases */}
                {selectedRouxCategory === 'CMLL' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <AlgFilterBar
                      cases={rawRouxCases}
                      selectedGroup={selectedGroupFilter}
                      onSelectGroup={setSelectedGroupFilter}
                      sortBy={sortBy}
                      onChangeSortBy={setSortBy}
                      searchQuery={searchQuery}
                      onChangeSearchQuery={setSearchQuery}
                      groupByCategory={groupByCategory}
                      onToggleGroupByCategory={() => setGroupByCategory(!groupByCategory)}
                      groupLabel="Corner Sets"
                    />

                    {currentRouxCases.length === 0 ? (
                      <div className="w-full bg-[#121418] border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3">
                        <span className="text-2xl">🔍</span>
                        <p className="text-sm font-mono text-slate-400">
                          No algorithms match your filter.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedGroupFilter('ALL');
                            setSearchQuery('');
                          }}
                          className="px-4 py-1.5 bg-purple-500 text-white font-bold rounded-xl text-xs"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : groupByCategory ? (
                      <div className="flex flex-col gap-8 animate-fadeIn">
                        {Object.entries(groupedRouxCases).map(([groupTitle, cases]) => (
                          <div key={groupTitle} className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 border-b border-slate-800/80 pb-2">
                              <h3 className="font-bison text-2xl text-purple-400 tracking-wide">
                                {groupTitle}
                              </h3>
                              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-md border border-slate-800">
                                {cases.length} Cases
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {cases.map((item) => (
                                <AlgCard
                                  key={item.id}
                                  item={item}
                                  onClick={() => setModalCase(item)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                        {currentRouxCases.map((item) => (
                          <AlgCard
                            key={item.id}
                            item={item}
                            onClick={() => setModalCase(item)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* LSE Cases */}
                {selectedRouxCategory === 'LSE' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <AlgFilterBar
                      cases={rawRouxCases}
                      selectedGroup={selectedGroupFilter}
                      onSelectGroup={setSelectedGroupFilter}
                      sortBy={sortBy}
                      onChangeSortBy={setSortBy}
                      searchQuery={searchQuery}
                      onChangeSearchQuery={setSearchQuery}
                      groupByCategory={groupByCategory}
                      onToggleGroupByCategory={() => setGroupByCategory(!groupByCategory)}
                      groupLabel="LSE Steps"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
                      {currentRouxCases.map((item) => (
                        <AlgCard
                          key={item.id}
                          item={item}
                          onClick={() => setModalCase(item)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 4-Step Guide */}
                {selectedRouxCategory === 'STEPS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                    {ROUX_STEPS.map((step) => (
                      <div
                        key={step.id}
                        className="bg-[#121418] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-800/40">
                              {step.stepNumber}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              {step.movecount}
                            </span>
                          </div>
                          <h4 className="font-bison text-2xl text-slate-100 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed mb-4">
                            {step.description}
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-3 border-t border-slate-800/60">
                          {step.features.map((feat, idx) => (
                            <div key={idx} className="text-xs font-mono text-slate-400 flex items-center gap-2">
                              <span className="text-purple-400">✓</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CUBING SPEED TIMER (csTimer Experience) */}
        {activeNav === 'timer' && (
          <div className="w-full animate-fadeIn">
            <CsTimer />
          </div>
        )}

        {/* VIEW 3: TRAIN ALGORITHMS */}
        {activeNav === 'train' && (
          <div className="w-full animate-fadeIn">
            <TrainAlgorithms />
          </div>
        )}
      </main>

      {/* FULL SCREEN 3D ANIMATION MODAL */}
      {modalCase && (
        <AlgModal
          item={modalCase}
          onClose={() => setModalCase(null)}
          onNext={handleNextModal}
          onPrev={handlePrevModal}
        />
      )}
    </div>
  );
}