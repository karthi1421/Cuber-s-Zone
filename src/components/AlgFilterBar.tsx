import React from 'react';
import { AlgCase } from '../data/cfopData';

export type SortOption = 'default' | 'group' | 'moves-asc' | 'moves-desc' | 'name-asc' | 'name-desc';

interface AlgFilterBarProps {
    cases: AlgCase[];
    selectedGroup: string;
    onSelectGroup: (group: string) => void;
    sortBy: SortOption;
    onChangeSortBy: (sort: SortOption) => void;
    searchQuery: string;
    onChangeSearchQuery: (q: string) => void;
    groupByCategory: boolean;
    onToggleGroupByCategory: () => void;
    groupLabel?: string;
}

export function getMoveCount(alg: string): number {
    if (!alg) return 0;
    // Remove brackets, rotations x, y, z if desired, or count all token turns
    return alg.trim().split(/\s+/).filter(Boolean).length;
}

export const AlgFilterBar: React.FC<AlgFilterBarProps> = ({
    cases,
    selectedGroup,
    onSelectGroup,
    sortBy,
    onChangeSortBy,
    searchQuery,
    onChangeSearchQuery,
    groupByCategory,
    onToggleGroupByCategory,
    groupLabel = 'Shape / Category'
}) => {
    // Extract unique groups and counts
    const groupCounts = React.useMemo(() => {
        const counts: Record<string, number> = {};
        cases.forEach(c => {
            const g = c.group || 'Other';
            counts[g] = (counts[g] || 0) + 1;
        });
        return counts;
    }, [cases]);

    const uniqueGroups = React.useMemo(() => {
        return Object.keys(groupCounts).sort();
    }, [groupCounts]);

    return (
        <div className="w-full bg-[#121418] border border-slate-800/80 rounded-2xl p-4 shadow-md flex flex-col gap-4">
            {/* Top Row: Search & Sort Dropdown & Group Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[200px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                        🔍
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onChangeSearchQuery(e.target.value)}
                        placeholder="Search by case name, group, or moves..."
                        className="w-full pl-9 pr-8 py-2 bg-[#0c0e12] border border-slate-800 focus:border-cyan-500/60 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-500 outline-none transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onChangeSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs w-5 h-5 flex items-center justify-center rounded-full"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-semibold whitespace-nowrap">
                        Sort by:
                    </span>
                    <select
                        value={sortBy}
                        onChange={(e) => onChangeSortBy(e.target.value as SortOption)}
                        className="bg-[#0c0e12] border border-slate-800 text-cyan-400 font-mono text-xs font-semibold px-3 py-2 rounded-xl outline-none hover:border-slate-700 transition-all cursor-pointer"
                    >
                        <option value="default">Default Order</option>
                        <option value="group">Group / Shape</option>
                        <option value="moves-asc">Move Count (Shortest)</option>
                        <option value="moves-desc">Move Count (Longest)</option>
                        <option value="name-asc">Name (A → Z)</option>
                        <option value="name-desc">Name (Z → A)</option>
                    </select>

                    {/* Group By Category Toggle */}
                    <button
                        onClick={onToggleGroupByCategory}
                        title="Group algorithms into category sections"
                        className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border ${
                            groupByCategory
                                ? 'bg-cyan-950/50 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-950'
                                : 'bg-[#0c0e12] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                    >
                        <span>📂</span>
                        <span className="hidden sm:inline">Group Sections</span>
                    </button>
                </div>
            </div>

            {/* Bottom Row: Shape / Category Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1">
                    {groupLabel}:
                </span>

                {/* "ALL" pill */}
                <button
                    onClick={() => onSelectGroup('ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        selectedGroup === 'ALL'
                            ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30 font-bold'
                            : 'bg-[#181b20] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <span>All</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedGroup === 'ALL' ? 'bg-cyan-900/30 text-slate-950' : 'bg-slate-900 text-slate-500'
                    }`}>
                        {cases.length}
                    </span>
                </button>

                {/* Individual Group Pills */}
                {uniqueGroups.map(group => (
                    <button
                        key={group}
                        onClick={() => onSelectGroup(group)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                            selectedGroup === group
                                ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30 font-bold'
                                : 'bg-[#181b20] text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <span>{group}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            selectedGroup === group ? 'bg-cyan-900/30 text-slate-950' : 'bg-slate-900 text-slate-500'
                        }`}>
                            {groupCounts[group]}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
