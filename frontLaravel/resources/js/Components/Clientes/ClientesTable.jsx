import React from 'react';
import PropTypes from 'prop-types';
import { Link, router } from '@inertiajs/react';
import { Mail, Eye, Users } from 'lucide-react';
import GenericTable from '@/Components/UI/GenericTable';

/**
 * Reusable table component for Customers.
 * Uses GenericTable to match the requested styling.
 */
export default function ClientesTable({ clientes, loading }) {
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

    const columns = [
        { header: 'Código' },
        { header: 'Nombres / Alias' },
        { header: 'Contacto Directo (Tlf + Red)' },
        { header: 'Correo Electrónico' },
        { header: 'Notas del Cliente' },
        { header: 'Acciones', className: 'text-right' }
    ];

    const renderRow = (cliente) => (
        <tr 
            key={cliente.id} 
            className="group border-b border-white/5 hover:bg-white/2 transition-colors cursor-pointer"
            onClick={() => router.visit(`/clientes/${cliente.id}`)}
        >
            <td className="px-6 py-4 text-sm font-mono text-gray-500">
                #{String(cliente.id).padStart(3, '0')}
            </td>
            <td className="px-6 py-4">
                <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {cliente.nombre}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(cliente.red)}`}>
                        {cliente.red || 'Sin Red'}
                    </span>
                    <span className="text-sm text-gray-300 font-medium">{cliente.telefono}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-3.5 h-3.5 text-gray-600" />
                    {cliente.correo || '-'}
                </div>
            </td>
            <td className="px-6 py-4 max-w-[200px]">
                <p className="text-xs text-gray-500 truncate" title={cliente.notas}>
                    {cliente.notas || 'Sin notas adicionales.'}
                </p>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center gap-2 justify-end text-right">
                    <Link 
                        onClick={(e) => e.stopPropagation()}
                        href={`/clientes/${cliente.id}`}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/5"
                        title="Ver detalles"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                </div>
            </td>
        </tr>
    );

    return (
        <GenericTable 
            columns={columns}
            data={clientes}
            loading={loading}
            emptyMessage="No hay clientes registrados"
            emptySubMessage="Comienza agregando un nuevo contacto al directorio."
            emptyIcon={<Users className="w-12 h-12 mb-4 opacity-20 text-gray-500" />}
            renderRow={renderRow}
        />
    );
}

ClientesTable.propTypes = {
    clientes: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
};
