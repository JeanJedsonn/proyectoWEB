import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Mail, Search, Filter, Loader2, ChevronLeft, ChevronRight, 
    Plus, History, ExternalLink, Copy, Eye, Lock
} from 'lucide-react';
import axios from 'axios';

export default function CorreosIndex() {
    const [correos, setCorreos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [showCopyMsg, setShowCopyMsg] = useState(false);

    useEffect(() => {
        const fetchCorreos = async () => {
            setLoading(true);
            try {
                // Endpoint: /correos/correos_por_pagina/{cantidad}/num_pagina/{indice}
                const res = await axios.get(`http://localhost:3000/correos/correos_por_pagina/${perPage}/num_pagina/${page}`);
                setCorreos(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando correos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCorreos();
    }, [page, perPage]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

    const getProviderIcon = (email) => {
        const lowerEmail = email?.toLowerCase() || '';
        if (lowerEmail.includes('outlook') || lowerEmail.includes('hotmail') || lowerEmail.includes('skiff')) {
            return <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Mail className="w-4 h-4" /></div>;
        }
        if (lowerEmail.includes('gmail')) {
            return <div className="p-2 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20"><Mail className="w-4 h-4" /></div>;
        }
        return <div className="p-2 bg-gray-500/10 rounded-lg text-gray-400 border border-gray-500/20"><Mail className="w-4 h-4" /></div>;
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="5" className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                            <p className="text-gray-400 font-medium">Cargando directorio de correos...</p>
                        </div>
                    </td>
                </tr>
            );
        }

        if (correos.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <Mail className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-xl font-black text-white/50 uppercase tracking-tighter">Directorio Vacío</p>
                            <p className="text-xs max-w-xs mt-2 italic">Aún no se han registrado direcciones de correo base en el sistema.</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return correos.map((correo) => (
            <tr 
                key={correo.id} 
                className="group border-b border-white/5 hover:bg-white/2 transition-all cursor-pointer"
                onClick={() => router.visit(`/correos/${correo.id}`)}
            >
                <td className="px-6 py-4 text-xs font-mono text-gray-500">
                    #{String(correo.id).padStart(3, '0')}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        {getProviderIcon(correo.direccionCorreo)}
                        <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {correo.direccionCorreo}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${correo.facturas > 0 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-gray-500 border-white/5'}`}>
                            {correo.facturas} {correo.facturas === 1 ? 'Factura' : 'Facturas'}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => handleCopy(correo.direccionCorreo)}
                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-indigo-400 transition-all border border-white/5"
                            title="Copiar dirección"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button 
                            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all border border-white/5"
                            title="Ver histórico"
                        >
                            <History className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <MainLayout>
            <Head title="Directorio de Correos" />
            
            {/* Header / Page Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-3">
                        <Mail className="w-4 h-4" />
                        <span>Correos Base</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                        Directorio de Correos
                    </h1>
                    <p className="text-gray-400 text-sm mt-3 font-medium italic">
                        Gestión centralizada de todas las direcciones de email registradas en la red.
                    </p>
                </div>
                <Link 
                    href="/correos/nuevo"
                    className="flex-items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-indigo-500/20 flex"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Correo Base
                </Link>
            </div>

            {/* Filtros Container */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Buscar por dirección o dominio..." 
                        className="w-full bg-[#161821] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 shadow-2xl transition-all"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select className="bg-[#161821] border border-white/5 rounded-2xl px-6 py-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all min-w-[200px] cursor-pointer appearance-none shadow-2xl font-bold">
                        <option value="">Proveedor (Todos)</option>
                        <option value="outlook">Outlook / Hotmail</option>
                        <option value="gmail">Gmail</option>
                        <option value="skiff">Skiff</option>
                    </select>
                    <button className="flex items-center justify-center px-5 bg-white/5 hover:bg-indigo-500 hover:text-white rounded-2xl text-gray-500 transition-all border border-white/5 shadow-2xl">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-[#161821] border border-white/5 rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/2 border-b border-white/5">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">ID</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Dirección (Unique)</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Cuentas Relacionadas</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Acciones Rápidas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {renderTableContent()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footnote */}
                <div className="px-8 py-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Mostrando <span className="text-white">{(page-1)*perPage + 1} - {Math.min(page*perPage, paginationInfo.total)}</span> de <span className="text-white font-black">{paginationInfo.total}</span> registros
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`p-3 rounded-2xl border border-white/5 shadow-lg transition-all ${page === 1 ? 'opacity-20 cursor-not-allowed text-gray-700 bg-white/2' : 'bg-white/5 text-gray-300 hover:bg-indigo-600 hover:text-white'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-2 px-6 py-3 bg-black/20 rounded-2xl border border-white/5">
                            <span className="text-sm font-black text-white">{page}</span>
                            <span className="text-gray-600 text-[10px] font-bold uppercase mx-1">/</span>
                            <span className="text-sm font-black text-gray-500">{paginationInfo.last_page}</span>
                        </div>

                        <button 
                            disabled={page === paginationInfo.last_page || paginationInfo.last_page === 0}
                            onClick={() => setPage(page + 1)}
                            className={`p-3 rounded-2xl border border-white/5 shadow-lg transition-all ${page === paginationInfo.last_page || paginationInfo.last_page === 0 ? 'opacity-20 cursor-not-allowed text-gray-700 bg-white/2' : 'bg-white/5 text-gray-300 hover:bg-indigo-600 hover:text-white'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {showCopyMsg && (
                <div className="fixed bottom-10 right-10 z-100 animate-in slide-in-from-right-10 fade-in duration-500">
                    <div className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(79,70,229,0.4)] font-black flex items-center gap-4 border border-white/10 uppercase text-xs tracking-widest">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Copy className="w-4 h-4 text-white" />
                        </div>
                        Copiado al Portapapeles
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
