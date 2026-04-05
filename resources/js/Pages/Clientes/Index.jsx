
//TODO: La tabla no permite seleccionar la cantidad de entradas a mostrar

import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Users, UserPlus, Search, Filter, Loader2, ChevronLeft, ChevronRight, Mail, Phone, Copy, Eye, MoreHorizontal } from 'lucide-react';
import axios from 'axios';

export default function ClientesIndex() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [showCopyMsg, setShowCopyMsg] = useState(false);

    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            try {
                // Endpoint: /clientes/clientes_por_pagina/{cantidad}/num_pagina/{num_pagina}
                const res = await axios.get(`http://localhost:3000/clientes/clientes_por_pagina/${perPage}/num_pagina/${page}`);
                setClientes(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando clientes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, [page, perPage]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

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

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="6" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                            <p className="text-gray-400 font-medium">Cargando directorio...</p>
                        </div>
                    </td>
                </tr>
            );
        }

        if (clientes.length === 0) {
            return (
                <tr>
                    <td colSpan="6" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <Users className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-bold text-white/50">No hay clientes registrados</p>
                            <p className="text-sm">Comienza agregando un nuevo contacto al directorio.</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return clientes.map((cliente) => (
            <tr 
                key={cliente.id} 
                className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
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
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => handleCopy(cliente.telefono || cliente.nombre)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/5"
                            title="Copiar contacto"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <Link 
                            href={`/clientes/${cliente.id}`}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/5"
                            title="Ver detalles"
                        >
                            <Eye className="w-4 h-4" />
                        </Link>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <MainLayout>
            <Head title="Directorio de Clientes" />
            
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2 font-medium">
                        <span className="text-white">Clientes</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-400" />
                        Directorio de Clientes
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Listado de compradores y contactos, vital para el histórico de facturación.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
                    <UserPlus className="w-4 h-4" />
                    Añadir Nuevo Cliente
                </button>
            </header>

            {/* Filtros y Búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Buscar por código, nombre o teléfono..." 
                        className="w-full bg-[#161821] border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select className="bg-[#161821] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all min-w-[180px] cursor-pointer appearance-none shadow-inner">
                        <option value="">Medio de Contacto (Red)</option>
                        <option value="ws">WhatsApp</option>
                        <option value="ig">Instagram</option>
                        <option value="fb">Facebook</option>
                    </select>
                    <button className="flex items-center justify-center p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tabla Card */}
            <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5">Código</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5">Nombres / Alias</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5">Contacto Directo (Tlf + Red)</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5">Correo Electrónico</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5">Notas del Cliente</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-white/5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {renderTableContent()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        Mostrando <span className="text-white font-medium">{(page-1)*perPage + 1}</span> a <span className="text-white font-medium">{Math.min(page*perPage, paginationInfo.total)}</span> de <span className="text-white font-medium">{paginationInfo.total}</span> clientes
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`p-2 rounded-lg border border-white/5 transition-all ${page === 1 ? 'bg-white/5 text-gray-700 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-sm font-bold border border-indigo-500/20">
                                {page}
                            </span>
                            <span className="text-gray-600 text-sm mx-1">de</span>
                            <span className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg text-sm font-medium border border-white/5">
                                {paginationInfo.last_page}
                            </span>
                        </div>

                        <button 
                            disabled={page === paginationInfo.last_page || paginationInfo.last_page === 0}
                            onClick={() => setPage(page + 1)}
                            className={`p-2 rounded-lg border border-white/5 transition-all ${page === paginationInfo.last_page || paginationInfo.last_page === 0 ? 'bg-white/5 text-gray-700 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'}`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {showCopyMsg && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-8 fade-in duration-300">
                    <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/20 font-bold flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <Copy className="w-3.5 h-3.5 text-white" />
                        </div>
                        Copiado al portapapeles
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
