import React from 'react';
import PropTypes from 'prop-types';
import { Gamepad2 } from 'lucide-react';
import { router } from '@inertiajs/react';

const JuegoNavButton = ({ 
    item, 
    icon: Icon = Gamepad2, 
    routePrefix = '/juegos',
    showId = true,
    subtitle,
    rightContent,
    extraBadge,
    className = ""
}) => {
    if (!item) return null;

    // Si pasamos un subtitle personalizado lo usamos, si no intentamos usar item.id
    const metaInfo = subtitle || (showId && item.id ? `ID: #${item.id}` : null);

    return (
        <button 
            type="button"
            onClick={() => item.id && router.visit(`${routePrefix}/${item.id}`)}
            className={`w-full flex items-center gap-4 p-3 bg-white/2 rounded-2xl border border-white/5 group hover:bg-white/5 hover:border-indigo-500/20 hover:scale-[1.01] transition-all cursor-pointer shadow-lg active:scale-95 text-left ${className}`}
        >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-black text-gray-300 truncate leading-tight group-hover:text-white transition-colors uppercase">
                    {item.titulo}
                </p>
                {metaInfo && (
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1 group-hover:text-indigo-400/50 transition-colors">
                            {metaInfo}
                        </span>
                    </div>
                )}
            </div>

            {(rightContent || extraBadge) && (
                <div className="flex flex-col items-end shrink-0 pl-4">
                    {rightContent && (
                        <span className="text-sm font-black text-emerald-500 flex items-center">
                            {rightContent}
                        </span>
                    )}
                    {extraBadge && (
                        <span className="text-[8px] font-black text-gray-700 uppercase">
                            {extraBadge}
                        </span>
                    )}
                </div>
            )}
        </button>
    );
};

JuegoNavButton.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        titulo: PropTypes.string.isRequired,
        precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        tipo: PropTypes.string,
    }).isRequired,
    icon: PropTypes.elementType,
    routePrefix: PropTypes.string,
    showId: PropTypes.bool,
    subtitle: PropTypes.node,
    rightContent: PropTypes.node,
    extraBadge: PropTypes.node,
    className: PropTypes.string,
};

export default JuegoNavButton;
