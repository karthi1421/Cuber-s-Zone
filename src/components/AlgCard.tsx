import React from 'react';
import { Cube3D, CaseType } from './Cube3D';
import { AlgCase } from '../data/cfopData';

interface AlgCardProps {
    item: AlgCase;
    onClick?: () => void;
    caseType?: CaseType;
}

export const AlgCard: React.FC<AlgCardProps> = ({ item, onClick, caseType = 'other' }) => {
    return (
        <div
            onClick={onClick}
            className={`bg-[#121418] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/50 hover:bg-[#15181f] transition-all shadow-md group ${
                onClick ? 'cursor-pointer hover:shadow-cyan-950/30' : ''
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bison text-xl text-cyan-400 tracking-wide group-hover:text-cyan-300 transition-colors">
                    {item.name}
                </h3>
                <span className="text-xs font-memphis text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    {item.group || item.id}
                </span>
            </div>

            {/* Static Cube Visual (no animation — animation plays in modal on click) */}
            <div className="w-full h-48 bg-[#090a0c] rounded-xl overflow-hidden mb-3 border border-slate-900 flex items-center justify-center relative transition-all group-hover:opacity-75">
                <Cube3D alg={item.alg} setup={item.setup} height="180px" caseType={caseType} />
            </div>

            {/* Algorithm Formula */}
            <div className="bg-[#181b20] p-2.5 rounded-xl border border-slate-800/60 font-mono text-xs text-slate-200 text-center select-all tracking-wide group-hover:border-cyan-900/40 group-hover:text-cyan-200 transition-colors">
                {item.alg}
            </div>
        </div>
    );
};