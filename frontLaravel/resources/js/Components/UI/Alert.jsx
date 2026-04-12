import React from 'react';
import { AlertCircle, CheckCircle2, Info, X, ShieldAlert, Save } from 'lucide-react';

/**
 * Reusable Alert component for feedback and notifications.
 * Variants: 'success', 'danger', 'info', 'warning'
 */
export default function Alert({ 
    variant = 'info', 
    message = '', 
    title = '',
    onClose = null, 
    className = '',
    icon: IconOverride = null
}) {
    const variants = {
        success: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
            icon: Save,
            iconBg: 'bg-emerald-500/20'
        },
        danger: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'text-red-400',
            icon: ShieldAlert,
            iconBg: 'bg-red-500/20'
        },
        warning: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            text: 'text-amber-400',
            icon: AlertCircle,
            iconBg: 'bg-amber-500/20'
        },
        info: {
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20',
            text: 'text-indigo-400',
            icon: Info,
            iconBg: 'bg-indigo-500/20'
        }
    };

    const config = variants[variant] || variants.info;
    const Icon = IconOverride || config.icon;

    return (
        <div className={`
            relatve flex items-center gap-4 p-5 rounded-2xl border 
            ${config.bg} ${config.border} ${config.text} 
            animate-in fade-in slide-in-from-top-4 duration-300 
            ${className}
        `}>
            {/* Icono con fondo circular */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.iconBg}`}>
                <Icon className="w-5 h-5" />
            </div>

            {/* Contenido del mensaje */}
            <div className="flex-1 min-w-0">
                {title && <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{title}</h4>}
                <p className="text-sm font-bold leading-relaxed">{message}</p>
            </div>

            {/* Botón de cierre opcional */}
            {onClose && (
                <button 
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-xl hover:bg-white/5 transition-colors text-current opacity-50 hover:opacity-100"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
