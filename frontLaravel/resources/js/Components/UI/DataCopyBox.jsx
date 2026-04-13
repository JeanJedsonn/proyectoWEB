import React from 'react';
import PropTypes from 'prop-types';
import { Copy } from 'lucide-react';

/**
 * DataCopyBox component for displaying read-only data with a quick copy action.
 * Standardized for sensitive info like emails, passwords, or keys.
 */
export default function DataCopyBox({ 
    label = '', 
    value = '', 
    icon: Icon = null, 
    onCopy = null, 
    placeholder = 'Sin datos...',
    variant = 'emerald', // emerald | indigo | gray
    mono = false,
    className = ''
}) {
    const variantClasses = {
        emerald: 'text-emerald-400/90 selection:bg-emerald-500/30',
        indigo: 'text-indigo-400/90 selection:bg-indigo-500/30',
        gray: 'text-gray-400/90 selection:bg-white/20'
    };

    const fontClass = mono ? 'font-mono tracking-widest text-[13px]' : 'font-medium';

    const handleCopyAction = () => {
        if (value && onCopy) {
            onCopy(value);
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                    {Icon && <Icon className="w-3 h-3" />} {label}
                </label>
            )}
            <div className="relative group/copy">
                <div className={`w-full bg-[#0b0d12] border border-white/5 rounded-xl px-5 py-4 text-sm break-all min-h-[54px] flex items-center transition-all ${fontClass} ${variantClasses[variant] || variantClasses.emerald}`}>
                    {value || (
                        <span className="text-gray-700 italic font-normal">{placeholder}</span>
                    )}
                </div>
                
                {value && onCopy && (
                    <button 
                        type="button"
                        onClick={handleCopyAction}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 opacity-0 group-hover/copy:opacity-100 transition-all focus:opacity-100 outline-none"
                        title={`Copiar ${label}`}
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

DataCopyBox.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    icon: PropTypes.elementType,
    onCopy: PropTypes.func,
    placeholder: PropTypes.string,
    variant: PropTypes.oneOf(['emerald', 'indigo', 'gray']),
    mono: PropTypes.bool,
    className: PropTypes.string
};
