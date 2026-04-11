import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Monitor, Search, Filter, Loader2, ChevronLeft, ChevronRight, 
    Plus, ExternalLink, Copy, Gamepad2, ShieldCheck, 
    Smartphone, Database, LayoutGrid, Key 
} from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Select from '@/Components/UI/Select';
import Input from '@/Components/UI/Input';

export default function CuentaJuegosIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [platform, setPlatform] = useState('');
    const [cuentas, setCuentas] = useState([]);
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
    const [copyMsgText, setCopyMsgText] = useState('Copiado al portapapeles');

    useEffect(() => {
        const fetchCuentas = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/cuentas/cuentas_por_pagina/${perPage}/num_pagina/${page}`);
                setCuentas(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando cuentas de juego:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCuentas();
    }, [page, perPage]);

    const handleCopy = (e, text, msg = 'Copiado al portapapeles') => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            setCopyMsgText(msg);
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase() || '';
        if (p.includes('xbox')) return <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 border border-emerald-500/20"><Gamepad2 className="w-4 h-4" /></div>;
        if (p.includes('playstation') || p.includes('psn') || p.includes('ps4') || p.includes('ps5')) return <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Monitor className="w-4 h-4" /></div>;
        if (p.includes('steam') || p.includes('pc')) return <div className="p-2 bg-gray-500/10 rounded-lg text-gray-400 border border-gray-500/20"><LayoutGrid className="w-4 h-4" /></div>;
        if (p.includes('nintendo') || p.includes('switch')) return <div className="p-2 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20"><Smartphone className="w-4 h-4" /></div>;
        return <div className="p-2 bg-gray-500/10 rounded-lg text-gray-500 border border-gray-500/20"><Gamepad2 className="w-4 h-4" /></div>;
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan="7" className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                            <p className="text-gray-400 font-medium tracking-tight uppercase text-[10px]">Accediendo al catálogo de cuentas...</p>
                        </div>
                    </td>
                </tr>
            );
        }

        if (cuentas.length === 0) {
            return (
                <tr>
                    <td colSpan="7" className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500 opacity-20">
                            <Database className="w-20 h-20 mb-4" />
                            <p className="text-xl font-black uppercase tracking-tighter">Sin Cuentas Registradas</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return cuentas.map((cuenta) => (
            <tr 
                key={cuenta.id} 
                className="group border-b border-white/2 hover:bg-white/2 transition-all cursor-pointer"
                onClick={() => router.visit(`/cuentas_juego/${cuenta.id}`)}
            >
                <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${cuenta.codigos2FA ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors block leading-none mb-1">
                                {cuenta.direccionCorreo}
                            </span>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">ID #{String(cuenta.id).padStart(4, '0')}</span>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-2 group/key" onClick={(e) => handleCopy(e, cuenta.clave)}>
                        <Key className="w-3.5 h-3.5 text-gray-700 group-hover/key:text-indigo-400 transition-colors" />
                        <span className="text-xs font-mono text-gray-500 hover:text-white transition-colors">
                            ••••••••
                        </span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${cuenta.codigos2FA ? 'text-gray-300' : 'text-gray-700 italic'}`}>
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
                        <button 
                            onClick={(e) => handleCopy(e, `Cta: ${cuenta.direccionCorreo}\nClave: ${cuenta.clave}\n2FA: ${cuenta.codigos2FA || 'No'}`)}
                            className="p-3 bg-white/2 hover:bg-indigo-600 rounded-2xl text-gray-600 hover:text-white transition-all border border-white/5"
                            title="Copiar datos completos"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <Link 
                            href={`/cuentas_juego/${cuenta.id}`}
                            className="p-3 bg-white/2 hover:bg-white/10 rounded-2xl text-gray-600 hover:text-white transition-all border border-white/5"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <MainLayout>
            <Head title="Cuentas Registradas" />
            
            <PageHeader
                title="Cuenta Juegos"
                description="Desglose de credenciales, plataformas y dependencias de juegos."
                icon={Gamepad2}
                topLabel="Inventario Matriz"
            >
                <Button 
                    variant="primary" 
                    icon={Plus} 
                    onClick={() => router.visit('/cuentas_juego/nuevo')}
                >
                    Añadir Cuenta
                </Button>
            </PageHeader>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input 
                    icon={Search}
                    placeholder="Buscar por correo, clave, juego o ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 space-y-0"
                />
                <div className="flex gap-4">
                    <Select 
                        placeholder="Plataformas"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        options={[
                            { value: 'psn', label: 'PlayStation' },
                            { value: 'xbox', label: 'Xbox Live' },
                            { value: 'steam', label: 'Steam PC' },
                            { value: 'nintendo', label: 'Nintendo' },
                        ]}
                        className="space-y-0 w-48"
                    />
                    <button className="flex items-center justify-center px-5 bg-white/2 hover:bg-indigo-600 rounded-2xl text-gray-600 hover:text-white transition-all border border-white/5">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-[#161821] border border-white/5 rounded-4xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/2 border-b border-white/2">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-600">Correo Matriz (Ref)</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-600">Clave</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-600">Códigos 2FA</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-600">Plataforma</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-600">Juegos Asignados</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-600 text-center">Tipo (Fact.)</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-600 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/2">
                            {renderTableContent()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-8 py-6 bg-black/20 border-t border-white/2 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <span className="text-white">{(page-1)*perPage + 1}-{Math.min(page*perPage, paginationInfo.total)}</span>
                            <span>de</span>
                            <span className="text-indigo-400">{paginationInfo.total}</span>
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                        <span>Vista por Página: <span className="text-gray-400">10</span></span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`p-3 rounded-2xl border border-white/5 transition-all ${page === 1 ? 'opacity-20 cursor-not-allowed' : 'bg-white/2 text-white hover:bg-indigo-600'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5 text-xs font-black text-white">
                            {page} <span className="text-gray-700 mx-2">/</span> {paginationInfo.last_page}
                        </div>

                        <button 
                            disabled={page === paginationInfo.last_page || paginationInfo.last_page === 0}
                            onClick={() => setPage(page + 1)}
                            className={`p-3 rounded-2xl border border-white/5 transition-all ${page === paginationInfo.last_page || paginationInfo.last_page === 0 ? 'opacity-20 cursor-not-allowed' : 'bg-white/2 text-white hover:bg-indigo-600'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {showCopyMsg && (
                <div className="fixed bottom-10 right-10 z-100">
                    <div className="bg-indigo-600/90 backdrop-blur-xl text-white px-8 py-5 rounded-3xl shadow-2xl font-black flex items-center gap-4 border border-white/10 uppercase text-xs tracking-widest italic">
                        <ShieldCheck className="w-5 h-5" />
                        {copyMsgText}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
