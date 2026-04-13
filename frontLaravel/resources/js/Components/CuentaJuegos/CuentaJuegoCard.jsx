import React from 'react';
import PropTypes from 'prop-types';
import { router } from '@inertiajs/react';
import { 
    Gamepad2, Monitor, LayoutGrid, Smartphone, Key, 
    ExternalLink, ShieldCheck, ShieldAlert, Hash 
} from 'lucide-react';

const getPlatformIcon = (platform) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('xbox')) return <Gamepad2 className="w-5 h-5 text-emerald-500" />;
    if (p.includes('playstation') || p.includes('psn') || p.includes('ps4') || p.includes('ps5')) 
        return <Monitor className="w-5 h-5 text-blue-400" />;
    if (p.includes('steam') || p.includes('pc')) 
        return <LayoutGrid className="w-5 h-5 text-gray-400" />;
    if (p.includes('nintendo') || p.includes('switch')) 
        return <Smartphone className="w-5 h-5 text-red-500" />;
    return <Gamepad2 className="w-5 h-5 text-gray-500" />;
};

export default function CuentaJuegoCard({ cuenta, onCopy }) {
    const has2FA = !!cuenta.codigos2FA;

    return (
        <div className="bg-[#161821] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.15)] transition-all duration-500 group flex flex-col h-full relative">
            
            {/* Header: Plataforma, ID y 2FA */}
            <div className="p-5 border-b border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    {/* ID & Platform */}
                    <div className="flex items-center gap-3">
                        {/* Icono de la plataforma */}
                        <div className="w-9 h-9 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center">
                            {getPlatformIcon(cuenta.plataforma)}
                        </div>

                        {/* ID & Plataforma Info */}
                        <div className="flex flex-col leading-none">
                            <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-1">{cuenta.plataforma}</span>
                            <div className="flex items-center gap-1">
                                <Hash className="w-3.5 h-3.5 text-gray-600" />
                                <span className="text-[13px] font-mono text-gray-600 font-bold tracking-tighter">
                                    {String(cuenta.id).padStart(3, '0')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 2FA Status */}
                    <div title={has2FA ? 'Protección 2FA Activa' : 'Sin 2FA'}>
                        {has2FA ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <ShieldAlert className="w-4 h-4 text-red-500 opacity-40" />
                        )}
                    </div>
                </div>

                {/* Factura Type Badges - Independent Line */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-white/2 mt-2 pt-4">
                    {cuenta.facturas?.length > 0 ? (
                        cuenta.facturas.map((tipo, idx) => (
                            <span key={`${tipo}-${idx}`} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[12px] font-black uppercase tracking-tighter whitespace-nowrap shadow-sm">
                                {tipo}
                            </span>
                        ))
                    ) : (
                        <span className="text-[12px] text-gray-700 uppercase font-black tracking-widest px-2.5 py-1 bg-white/2 border border-white/5 rounded-lg italic">
                            Stock
                        </span>
                    )}
                </div>
            </div>

            {/* Content info */}
            <div className="p-7 flex-1 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest leading-none">Dirección de Correo</span>
                        <button 
                            onClick={(e) => onCopy?.(e, cuenta.direccionCorreo)}
                            className="text-[14px] font-bold text-white hover:text-indigo-400 transition-colors text-left truncate leading-tight mt-1 bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                        >
                            {cuenta.direccionCorreo}
                        </button>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest leading-none">Contraseña Matriz</span>
                        <div className="flex items-center gap-2.5 group/key mt-1">
                            <Key className="w-4 h-4 text-indigo-400/50 group-hover/key:text-indigo-400 transition-colors" />
                            <button 
                                onClick={(e) => onCopy?.(e, cuenta.clave)}
                                className="text-[13px] font-mono text-gray-500 group-hover/key:text-white transition-colors bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                            >
                                {cuenta.clave}
                            </button>
                        </div>
                    </div>

                    {cuenta.codigos2FA && (
                        <div className="flex flex-col gap-1.5 pt-2">
                            <span className="text-[11px] font-black text-emerald-500/30 uppercase tracking-widest leading-none">Códigos 2FA de Respaldo</span>
                            <button 
                                onClick={(e) => onCopy?.(e, cuenta.codigos2FA)}
                                className="text-[12px] font-black uppercase tracking-tighter text-gray-400 hover:text-emerald-400 transition-colors bg-transparent border-none p-0 cursor-pointer focus:outline-none text-left line-clamp-1"
                            >
                                {cuenta.codigos2FA}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Metrics */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col max-w-[70%]">
                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1.5">Biblioteca de Títulos</span>
                        <div className="flex flex-col gap-0.5">
                            {cuenta.juegos?.length > 0 ? (
                                <>
                                    <div className="text-[14px] font-black text-white tracking-widest uppercase italic truncate" title={cuenta.juegos[0].titulo}>
                                        {cuenta.juegos[0].titulo}
                                    </div>
                                    {cuenta.juegos.length > 1 && (
                                        <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                                            + {cuenta.juegos.length - 1} títulos adicionales
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-[14px] font-black text-gray-700 tracking-widest uppercase italic">
                                    Sin Juegos
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button
                        onClick={() => router.visit(`/cuentas_juego/${cuenta.id}`)}
                        className="p-3 bg-white/2 hover:bg-indigo-600 rounded-xl text-gray-600 hover:text-white transition-all border border-white/5 shadow-lg active:scale-95 shrink-0"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

CuentaJuegoCard.propTypes = {
    cuenta: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        direccionCorreo: PropTypes.string.isRequired,
        clave: PropTypes.string,
        plataforma: PropTypes.string,
        codigos2FA: PropTypes.string,
        juegos: PropTypes.array,
        facturas: PropTypes.array,
    }).isRequired,
    onCopy: PropTypes.func
};
