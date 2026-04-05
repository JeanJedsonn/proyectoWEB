import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { PackageSearch, Plus, Search, Filter, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function JuegosIndex() {
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados de Paginación
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    // Cargar juegos desde la API
    useEffect(() => {
        const fetchJuegos = async () => {
            setLoading(true);
            try {
                // Endpoint local de Node: /juegos/juegos_por_pagina/:perPage/num_pagina/:page
                const res = await axios.get(`http://localhost:3000/juegos/juegos_por_pagina/${perPage}/num_pagina/${page}`);
                setJuegos(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando juegos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJuegos();
    }, [page, perPage]);

    const renderContent = () => {
        // Si esta cargando, muestra un loader
        if (loading) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400">Cargando catálogo...</p>
                </div>
            );
        }

        // Si no hay datos, muestra un mensaje de error (en caso de que falle la conexión con el backend)
        if (juegos.length === 0) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <PackageSearch className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Catálogo Vacio</h3>
                    <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                        No se encontraron juegos en esta vista o falló la conexión.
                    </p>
                </div>
            );
        }

        return (
            <>
                {/* Grid de Juegos */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
                    {juegos.map((juego) => (
                        <div key={juego.id} className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-300 group flex flex-col">
                            <div className="aspect-[3/4] relative overflow-hidden bg-[#0b0d12] flex items-center justify-center">
                                {juego.url ? (
                                    <img 
                                        src={juego.url} 
                                        alt={juego.titulo}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/300x400/161821/52525b.png?text=Sin+Imagen';
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-600">
                                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                        <span className="text-xs font-medium">Sin imagen</span>
                                    </div>
                                )}
                                
                                {/* Overlay Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-[#0b0d12]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                    <Link href={`/juegos/${juego.id}`} className="w-full text-center bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-lg block">
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <h3 
                                    className="font-bold text-gray-200 text-sm line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors" 
                                    title={juego.titulo}
                                >
                                    {juego.titulo}
                                </h3>
                                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                                    <span className="text-xs text-gray-500 font-mono tracking-wider">ID: {juego.id}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginación Inferior */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-[#161821] border border-white/5 px-6 py-4 rounded-2xl gap-4">
                    <span className="text-sm text-gray-400">
                        Mostrando página <span className="font-semibold text-white">{paginationInfo.current_page}</span> de <span className="font-semibold text-white">{paginationInfo.last_page}</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold text-white">{paginationInfo.total}</span> juegos totales
                    </span>
                    
                    <div className="flex items-center gap-1 bg-[#0b0d12] p-1 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${page === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                        </button>

                        <div className="w-px h-4 bg-white/10 mx-1"></div>

                        <button 
                            onClick={() => setPage(page + 1)}
                            disabled={page === paginationInfo.last_page || paginationInfo.last_page === 0}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${page === paginationInfo.last_page || paginationInfo.last_page === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <MainLayout>
            {/* Header */}
            <header className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                        <PackageSearch className="w-8 h-8 text-purple-400" />
                        Catálogo de Juegos
                    </h1>
                    <p className="text-gray-400 text-sm">Administra los juegos disponibles, stock y sus diferentes versiones.</p>
                </div>
                <Link href="/juegos/nuevo" className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" />
                    Nuevo Juego
                </Link>
            </header>

            {/* Fila de Controles (Búsqueda, Filtros y Paginación) */}
            <div className="bg-[#161821] border border-white/5 p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex gap-4 w-full md:w-auto flex-1">
                    <div className="relative w-full md:max-w-md">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar título..." 
                            className="w-full bg-[#0b0d12] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-shadow"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-gray-300 transition-colors border border-white/5 shadow-sm">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filtros</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 bg-[#0b0d12] p-1.5 rounded-xl border border-white/5 w-full md:w-auto">
                    <label htmlFor="per-page-select" className="text-xs text-gray-400 pl-3">Mostrar:</label>
                    <select 
                        id="per-page-select"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1); // Volver a página 1 cuando cambia el límite
                        }}
                        className="bg-transparent text-white text-sm font-semibold focus:ring-0 focus:outline-none border-none py-1 pr-8 cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {/* Contenido Dinámico */}
            {renderContent()}
        </MainLayout>
    );
}
