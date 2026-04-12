import React from 'react';
import GenericTable from '@/Components/UI/GenericTable';
import { router } from '@inertiajs/react';
import { Receipt } from 'lucide-react';

export default function FacturasTable({ facturas = [], loading = false }) {
    // Formateador de fecha
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Renderiza badges de colores según el tipo de venta
    const renderTypeBadge = (tipo) => {
        if (!tipo) return null;
        if (tipo.toLowerCase() === 'primaria') {
            return <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20 capitalize">{tipo}</span>;
        }
        if (tipo.toLowerCase() === 'secundaria') {
            return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20 capitalize">{tipo}</span>;
        }
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium border border-amber-500/20 capitalize">{tipo}</span>;
    };

    const columns = [
        { header: 'Nº Factura' },
        { header: 'Fecha' },
        { header: 'Plataforma' },
        { header: 'Juego' },
        { header: 'Cliente' },
        { header: 'Tipo' },
        { header: 'Precio Venta', className: 'text-right' }
    ];

    const renderRow = (factura) => (
        <tr 
            key={factura.id} 
            onClick={() => router.visit(`/facturas/${factura.id}`)}
            className="group border-b border-white/5 hover:bg-white/2 transition-all cursor-pointer"
        >
            <td className="px-6 py-4 font-bold text-gray-500">#{factura.id}</td>
            <td className="px-6 py-4 text-gray-300 font-medium">{formatDate(factura.fecha)}</td>
            <td className="px-6 py-4 text-white font-medium">{factura.plataforma}</td>
            <td className="px-6 py-4 text-gray-300 font-medium">{factura.titulo_juego}</td>
            <td className="px-6 py-4 text-white font-bold">{factura.cliente}</td>
            <td className="px-6 py-4">
                {renderTypeBadge(factura.tipo)}
            </td>
            <td className="px-6 py-4 font-black text-white text-right">$ {factura.precioVenta}</td>
        </tr>
    );

    return (
        <GenericTable 
            columns={columns}
            data={facturas}
            loading={loading}
            emptyMessage="No hay facturas registradas"
            emptyIcon={<Receipt className="w-12 h-12 mb-4 opacity-20" />}
            renderRow={renderRow}
        />
    );
}
