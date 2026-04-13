import React from 'react';
import PropTypes from 'prop-types';
import { router } from '@inertiajs/react';
import { Mail, ExternalLink, Hash, Database } from 'lucide-react';

const getProviderIcon = (email) => {
    const lowerEmail = email?.toLowerCase() || '';
    if (lowerEmail.includes('outlook') || lowerEmail.includes('hotmail') || lowerEmail.includes('skiff')) {
        return <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20"><Mail className="w-5 h-5" /></div>;
    }
    if (lowerEmail.includes('gmail')) {
        return <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20"><Mail className="w-5 h-5" /></div>;
    }
    return <div className="p-2.5 bg-gray-500/10 rounded-xl text-gray-400 border border-white/5"><Mail className="w-5 h-5" /></div>;
};

export default function CorreoCard({ correo }) {
    const facturasCount = Number(correo.facturas) || 0;

    return (
        <div className="bg-[#161821] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.15)] transition-all duration-500 group flex flex-col h-full relative">
            
            {/* Top Bar: ID and Status */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
                {/* ID */}
                <div className="flex items-center gap-2">
                    <Hash className="w-3 h-3 text-gray-700" />
                    <span className="text-[12px] font-mono text-gray-500 font-bold tracking-tighter">
                        #{String(correo.id).padStart(3, '0')}
                    </span>
                </div>

                {/* Facturas */}
                <div className={`px-2 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-widest border ${
                    facturasCount > 0 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/2 text-gray-700 border-white/5'
                }`}>
                    {facturasCount} {facturasCount === 1 ? 'Factura' : 'Facturas'}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="flex flex-col items-center text-center space-y-4 pt-2">
                    {getProviderIcon(correo.direccionCorreo)}
                    <h3 className="text-[13px] font-black text-white line-clamp-2 leading-snug uppercase group-hover:text-indigo-400 transition-colors" title={correo.direccionCorreo}>
                        {correo.direccionCorreo}
                    </h3>
                </div>

                <div className="pt-8 flex gap-3 mt-auto">
                    <button
                        onClick={() => router.visit(`/correos/${correo.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/2 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all border border-white/5 shadow-inner group/btn"
                    >
                        <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                        Gestionar Cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}

CorreoCard.propTypes = {
    correo: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        direccionCorreo: PropTypes.string.isRequired,
        facturas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};
