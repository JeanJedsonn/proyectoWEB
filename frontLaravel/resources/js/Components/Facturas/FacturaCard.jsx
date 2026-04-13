import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@inertiajs/react';
import { FileText, Calendar, DollarSign, Wallet, Monitor, Gamepad2, Smartphone, LayoutGrid, User } from 'lucide-react';

const getPlatformIcon = (platform) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('xbox')) return <Gamepad2 className="w-3.5 h-3.5 text-emerald-500" />;
    if (p.includes('playstation') || p.includes('psn')) return <Monitor className="w-3.5 h-3.5 text-blue-400" />;
    if (p.includes('nintendo') || p.includes('switch')) return <Smartphone className="w-3.5 h-3.5 text-red-500" />;
    return <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />;
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
};

export default function FacturaCard({ factura, variant = 'default' }) {
    const isPrimaria = factura.tipo?.toLowerCase().includes('primaria');
    
    // Fallbacks para consistencia entre diferentes endpoints de la API (Incluyendo Dashboard)
    const tituloFactura = factura.titulo_juego || factura.titulo || factura.juego || 'Sin título';
    const fechaFactura = factura.fecha || factura.fechaVenta;
    const precioFactura = factura.precioVenta || factura.precio || factura.monto;

    // Estilos según variante
    const bgStyles = variant === 'dark' 
        ? 'bg-[#0b0d12] hover:bg-black/40' 
        : 'bg-[#161821] hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.15)]';

    return (
        <div className={`${bgStyles} border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 group flex flex-col relative h-full`}>
            {/* Header / Tipo */}
            <div className="p-5 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <FileText className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-[12px] font-black text-gray-600 uppercase tracking-widest block leading-none mb-1">Factura</span>
                        <span className="text-[11px] font-bold text-gray-300 font-mono">#{String(factura.id).padStart(4, '0')}</span>
                    </div>
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    isPrimaria ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}>
                    {factura.tipo}
                </span>
            </div>

            {/* Contenido */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                    {/* Titulo de la factura */}
                    <h3 className="text-xs font-black text-white line-clamp-2 leading-tight uppercase group-hover:text-indigo-400 transition-colors" title={tituloFactura}>
                        {tituloFactura}
                    </h3>
                    
                    {/* Cliente */}
                    <div className="grid grid-cols-1 gap-2.5">
                        {/* Nombre del cliente */}
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                            <User className="w-3.5 h-3.5 text-indigo-400/50" />
                            <span className="text-gray-300 truncate">{factura.cliente || 'Desconocido'}</span>
                        </div>

                        {/* Fecha de la factura */}
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-gray-700" />
                            <span>{formatDate(fechaFactura)}</span>
                        </div>

                        {/* Plataforma */}
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                            {getPlatformIcon(factura.plataforma)}
                            <span className="uppercase">{factura.plataforma}</span>
                        </div>
                    </div>
                </div>

                {/* Precio */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">Total Pagado</span>
                        <div className="flex items-center text-lg font-black text-emerald-400 tracking-tighter">
                            <DollarSign className="w-4 h-4" />
                            {precioFactura}
                        </div>
                    </div>
                    
                    <Link 
                        href={`/facturas/${factura.id}`}
                        className="p-2.5 bg-white/2 hover:bg-indigo-600 rounded-xl text-gray-600 hover:text-white transition-all border border-white/5 shadow-lg active:scale-90"
                        title="Ver detalles de factura"
                    >
                        <Wallet className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

FacturaCard.propTypes = {
    factura: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        titulo: PropTypes.string,
        titulo_juego: PropTypes.string,
        juego: PropTypes.string,
        cliente: PropTypes.string,
        tipo: PropTypes.string,
        fecha: PropTypes.string,
        fechaVenta: PropTypes.string,
        precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        precioVenta: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        monto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        plataforma: PropTypes.string,
    }).isRequired,
    variant: PropTypes.oneOf(['default', 'dark']),
};
