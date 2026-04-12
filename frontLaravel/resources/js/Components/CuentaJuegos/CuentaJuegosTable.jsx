import React from 'react';
import { Link, router } from '@inertiajs/react';
import { ExternalLink, Gamepad2, Monitor, LayoutGrid, Smartphone, Key, Database } from 'lucide-react';
import GenericTable from '@/Components/UI/GenericTable';

/**
 * Reusable table component for CuentaJuegos.
 * Uses GenericTable to match the requested styling.
 */
export default function CuentaJuegosTable({ cuentas, loading, onCopy }) {
    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p.includes('xbox')) return <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20"><Gamepad2 className="w-4 h-4" /></div>;
        if (p.includes('playstation') || p.includes('psn') || p.includes('ps4') || p.includes('ps5')) return <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Monitor className="w-4 h-4" /></div>;
        if (p.includes('steam') || p.includes('pc')) return <div className="p-2 bg-gray-500/10 rounded-lg text-gray-400 border border-gray-500/20"><LayoutGrid className="w-4 h-4" /></div>;
        if (p.includes('nintendo') || p.includes('switch')) return <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20"><Smartphone className="w-4 h-4" /></div>;
        return <div className="p-2 bg-gray-500/10 rounded-lg text-gray-500 border border-gray-500/20"><Gamepad2 className="w-4 h-4" /></div>;
    };

    const columns = [
        { header: 'Correo Matriz (Ref)' },
        { header: 'Clave' },
        { header: 'Códigos 2FA' },
        { header: 'Plataforma' },
        { header: 'Juegos Asignados' },
        { header: 'Tipo (Fact.)', className: 'text-center' },
        { header: 'Acciones', className: 'text-right' }
    ];

    const renderRow = (cuenta) => (
        <tr 
            key={cuenta.id} 
            className="group border-b border-white/5 hover:bg-white/2 transition-all cursor-pointer"
            onClick={() => router.visit(`/cuentas_juego/${cuenta.id}`)}
        >
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${cuenta.codigos2FA ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                    <div className="flex flex-col">
                        <span 
                            className="text-sm font-bold text-white hover:text-indigo-400 transition-colors block leading-none mb-1 cursor-pointer"
                            title="Haz clic para copiar el Correo"
                            onClick={(e) => onCopy && onCopy(e, cuenta.direccionCorreo, 'Correo copiado al portapapeles')}
                        >
                            {cuenta.direccionCorreo}
                        </span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">ID #{String(cuenta.id).padStart(4, '0')}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <button 
                    type="button"
                    onClick={(e) => onCopy && onCopy(e, cuenta.clave, 'Contraseña copiada')}
                    className="flex items-center gap-2 group/key p-0 bg-transparent border-none focus:outline-none cursor-pointer"
                    title="Haz clic para copiar Clave"
                >
                    <Key className="w-3.5 h-3.5 text-gray-700 group-hover/key:text-indigo-400 transition-colors" />
                    <span className="text-xs font-mono text-gray-500 group-hover/key:text-white transition-colors">
                        {cuenta.clave}
                    </span>
                </button>
            </td>
            <td className="px-6 py-5">
                <span 
                    className={`text-[10px] font-black uppercase tracking-tighter ${cuenta.codigos2FA ? 'text-gray-300 cursor-pointer hover:text-indigo-400 transition-colors' : 'text-gray-700 italic'}`}
                    title={cuenta.codigos2FA ? "Haz clic para copiar códigos 2FA" : ""}
                    onClick={(e) => cuenta.codigos2FA && onCopy && onCopy(e, cuenta.codigos2FA, 'Códigos 2FA copiados')}
                >
                    {cuenta.codigos2FA || '- Ninguno -'}
                </span>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center gap-2.5">
                    {getPlatformIcon(cuenta.plataforma)}
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{cuenta.plataforma}</span>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex flex-wrap gap-1.5">
                    {cuenta.juegos?.length > 0 ? (
                        <>
                            <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-indigo-400 border border-white/5">
                                {cuenta.juegos.length} Títulos
                            </span>
                            {cuenta.juegos.length > 0 && (
                                <span className="px-2 py-1 bg-black/40 rounded-lg text-[10px] font-black text-gray-600 border border-white/5 uppercase">
                                    ID {cuenta.juegos[0]}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="text-[10px] text-gray-700 italic">Vacia</span>
                    )}
                </div>
            </td>
            <td className="px-6 py-5 text-center">
                {cuenta.facturas?.length > 0 ? (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        {cuenta.facturas[0]}
                    </span>
                ) : (
                    <span className="text-[10px] text-gray-700 uppercase font-black">Stock</span>
                )}
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>

                    <Link 
                        href={`/cuentas_juego/${cuenta.id}`}
                        className="p-3 bg-white/2 hover:bg-white/10 rounded-2xl text-gray-600 hover:text-white transition-all border border-white/5"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>
            </td>
        </tr>
    );

    return (
        <GenericTable 
            columns={columns}
            data={cuentas}
            loading={loading}
            emptyMessage="Sin Cuentas Registradas"
            emptyIcon={<Database className="w-12 h-12 mb-4 opacity-20 text-gray-500" />}
            renderRow={renderRow}
        />
    );
}
