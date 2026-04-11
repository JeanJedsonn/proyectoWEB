import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, Copy } from 'lucide-react';

/**
 * Toast notification component.
 * @param {boolean} show - Whether to show the toast.
 * @param {string} message - Message to display.
 * @param {string} variant - 'success', 'error', 'warning', 'info', 'copy'
 * @param {function} onClose - Function to call when the toast should close.
 * @param {number} duration - How long to show the toast in ms.
 */
export default function Toast({ 
    show, 
    message, 
    variant = 'success', 
    onClose, 
    duration = 3000 
}) {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-white" />,
        error: <XCircle className="w-5 h-5 text-white" />,
        warning: <AlertTriangle className="w-5 h-5 text-white" />,
        info: <Info className="w-5 h-5 text-white" />,
        copy: <Copy className="w-5 h-5 text-white" />
    };

    const variants = {
        success: 'bg-emerald-600',
        error: 'bg-red-600',
        warning: 'bg-amber-600',
        info: 'bg-blue-600',
        copy: 'bg-indigo-600'
    };

    return (
        <div className="fixed bottom-10 right-10 z-100 pointer-events-none">
            <div className={`${variants[variant] || variants.success} text-white px-8 py-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] font-black flex items-center gap-4 border border-white/10 uppercase text-xs tracking-widest italic animate-in fade-in slide-in-from-right-10 duration-300`}>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    {icons[variant] || icons.success}
                </div>
                <span>{message}</span>
            </div>
        </div>
    );
}
