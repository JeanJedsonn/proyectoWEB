import React from 'react';
import { Loader2, Database } from 'lucide-react';

/**
 * Reusable generic table component.
 * Allows passing custom columns and render rows.
 * Maintains the requested styling (bg-white/5 for header, px-6 py-4 cells, no card wrapper).
 * 
 * @param {Array} columns - Array of objects { header: string, className: string }
 * @param {Array} data - Array of data objects
 * @param {boolean} loading - Loading state
 * @param {string} emptyMessage - Message to display when no data
 * @param {string} emptySubMessage - Submessage for empty state
 * @param {React.ReactNode} emptyIcon - Icon to display in empty state
 * @param {function} renderRow - Function that returns a <tr> element for each data item
 */
export default function GenericTable({ 
    columns = [], 
    data = [], 
    loading = false, 
    emptyMessage = "No hay registros",
    emptySubMessage = "",
    emptyIcon = <Database className="w-12 h-12 mb-4 opacity-20" />,
    renderRow
}) {
    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={columns.length} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                            <p className="text-gray-400 font-medium">Cargando directorio...</p>
                        </div>
                    </td>
                </tr>
            );
        }

        if (data.length === 0) {
            return (
                <tr>
                    <td colSpan={columns.length} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            {emptyIcon}
                            <p className="text-lg font-bold text-white/50">{emptyMessage}</p>
                            {emptySubMessage && <p className="text-sm">{emptySubMessage}</p>}
                        </div>
                    </td>
                </tr>
            );
        }

        return data.map(renderRow);
    };

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white/5">
                        {columns.map((col, index) => (
                            <th 
                                key={index} 
                                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {renderTableContent()}
                </tbody>
            </table>
        </div>
    );
}
