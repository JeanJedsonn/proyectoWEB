import React from 'react';
import PropTypes from 'prop-types';
import { Link, router } from '@inertiajs/react';
import { Mail, Phone, MessageSquare, ExternalLink, User } from 'lucide-react';

const getBadgeStyle = (red) => {
    const lowerRed = red?.toLowerCase() || '';
    if (lowerRed.includes('whatsapp') || lowerRed.includes('ws')) {
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (lowerRed.includes('instagram') || lowerRed.includes('ig')) {
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    }
    if (lowerRed.includes('facebook') || lowerRed.includes('fb')) {
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
    return 'bg-white/5 text-gray-300 border-white/10';
};

export default function ClienteCard({ cliente }) {
    const whatsappUrl = cliente.telefono?.replaceAll(/\D/g, '');

    return (
        <div className="bg-[#161821] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.15)] transition-all duration-500 group flex flex-col h-full relative">
            
            {/* Header: ID y Red */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
                <span className="text-[12px] font-mono text-gray-700 font-bold tracking-tighter">
                    #{String(cliente.id).padStart(3, '0')}
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-widest border ${getBadgeStyle(cliente.red)}`}>
                    {cliente.red || 'S/R'}
                </span>
            </div>

            {/* Content info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                    {/* Nombre */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/2 border border-white/5 flex items-center justify-center text-gray-700 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300">
                             <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black text-white line-clamp-1 leading-tight uppercase group-hover:text-indigo-400 transition-colors" title={cliente.nombre}>
                            {cliente.nombre}
                        </h3>
                    </div>

                    {/* Telefono y Correo */}
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[12px] font-bold text-gray-500">
                            <Phone className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-gray-300">{cliente.telefono || 'Sin Teléfono'}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[12px] font-bold text-gray-500">
                            <Mail className="w-3.5 h-3.5 text-gray-700" />
                            <span className="text-gray-400 truncate">{cliente.correo || 'N/R'}</span>
                        </div>
                    </div>
                    
                    {cliente.notas && (
                         <p className="text-[11px] text-gray-600 line-clamp-2 italic leading-relaxed pt-2">
                             "{cliente.notas}"
                         </p>
                    )}
                </div>

                {/* Footer: Bottom actions */}
                <div className="pt-6 border-t border-white/5 flex items-center gap-2 mt-auto">
                    <button
                        onClick={() => router.visit(`/clientes/${cliente.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/2 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all border border-white/5"
                    >
                        <ExternalLink className="w-3 h-3" />
                        Perfil
                    </button>
                    {whatsappUrl && (
                        <a 
                            href={`https://wa.me/${whatsappUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/20 transition-all active:scale-90"
                            title="WhatsApp"
                        >
                            <MessageSquare className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

ClienteCard.propTypes = {
    cliente: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        telefono: PropTypes.string,
        correo: PropTypes.string,
        red: PropTypes.string,
        notas: PropTypes.string,
    }).isRequired,
};
