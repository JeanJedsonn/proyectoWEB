import React from 'react';

/**
 * Card component for containers and panels.
 */
export default function Card({ 
    children, 
    title = '', 
    icon: Icon = null, 
    className = '', 
    variant = 'default',
    ...props
}) {
    const variants = {
        default: 'bg-[#161821] border-white/5 border-l-4 border-l-indigo-500 shadow-indigo-500/5',
        success: 'bg-[#161821] border-white/5 border-l-4 border-l-emerald-500 shadow-emerald-500/5',
        danger: 'bg-[#161821] border-white/5 border-l-4 border-l-red-500 shadow-red-500/5',
        ghost: 'bg-black/20 border-white/5 border-none shadow-none',
        outline: 'bg-transparent border-white/10 border shadow-none'
    };

    return (
        <div 
            className={`rounded-4xl p-10 shadow-2xl relative group border ${variants[variant] || variants.default} ${className}`}
            {...props}
        >
            {title && (
                <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-indigo-500" />}
                        {title}
                    </h2>
                </div>
            )}
            {children}
        </div>
    );
}
