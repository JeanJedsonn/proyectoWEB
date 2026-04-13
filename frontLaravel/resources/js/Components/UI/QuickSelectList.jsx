import React from 'react';

/**
 * QuickSelectList component for standardized selection lists (e.g., Buyers, Accounts).
 * Features a dynamic dot indicator and a secondary label/badge.
 */
export default function QuickSelectList({ 
    items = [], 
    selectedId = null, 
    onSelect, 
    getLabel = (item) => item.label || item.nombre || '', 
    getSublabel = (item) => item.sublabel || item.red || item.clave || '',
    emptyMessage = 'Sin coincidencias',
    height = 'h-44',
    sublabelClassName = ''
}) {
    return (
        <div className={`relative bg-[#161821] border border-white/5 rounded-xl overflow-hidden shadow-2xl transition-all`}>
            <div className={`w-full ${height} overflow-y-auto custom-scrollbar p-2`}>
                {items.length > 0 ? (
                    items.map((item) => {
                        const isSelected = String(selectedId) === String(item.id);
                        return (
                            <button 
                                key={item.id} 
                                type="button"
                                onClick={() => onSelect(item)}
                                className={`w-full text-left p-3 text-[11px] font-black transition-all mb-1 last:mb-0 rounded-lg flex items-center gap-3 border ${isSelected ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-white border-transparent'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-gray-800'}`}></div>
                                <span className="truncate flex-1">{getLabel(item)}</span>
                                <span className={`opacity-30 uppercase tracking-tighter shrink-0 ${sublabelClassName}`}>
                                    {getSublabel(item) || 'S/R'}
                                </span>
                            </button>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
