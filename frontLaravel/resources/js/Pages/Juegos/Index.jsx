import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { PackageSearch, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

// Componentes 
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';
import Select from '@/Components/UI/Select';
import GameCard from '@/Components/Juegos/GameCard';

export default function JuegosIndex() {
    // Estados
    const [juegos, setJuegos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Estados de Paginación
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12); // Cambiado a 12 para mejor grid xl
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
    });

    // Cargar juegos desde la API
    useEffect(() => {
        const fetchJuegos = async () => {
            setLoading(true);
            try {
                const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${urlNode}/juegos/juegos_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (appliedSearch) {
                    url = `${urlNode}/juegos/campo/titulo/buscar/${encodeURIComponent(appliedSearch)}/juegos_por_pagina/${perPage}/num_pagina/${page}`;
                }

                const res = await axios.get(url);
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
    }, [page, perPage, appliedSearch]);

    // Manejo de búsqueda
    const handleSearch = () => {
        setAppliedSearch(searchTerm);
        setPage(1);
    };

    // Manejo de búsqueda por Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Renderizado del contenido (3 casos)
    const renderContent = () => {

        // Loader mientras carga los datos
        if (loading) {
            return (
                <div className="bg-[#161821] border border-transparent rounded-4xl p-24 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5" />
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 relative z-10" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] italic relative z-10">Sincronizando Catálogo Global...</p>
                </div>
            );
        }

        // Si no hay juegos, muestra un mensaje de error
        if (juegos.length === 0) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-24 flex flex-col items-center justify-center text-center min-h-[400px] shadow-2xl">
                    <div className="w-24 h-24 bg-white/2 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                        <PackageSearch className="w-12 h-12 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Bóveda Vacía</h3>
                    <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-bold uppercase text-[10px] tracking-widest opacity-60">
                        No se detectaron registros de títulos activos o se perdió el enlace con el servidor de datos.
                    </p>
                    <Button variant="outline" size="sm" icon={PackageSearch} onClick={() => globalThis.location.reload()}>
                        Reintentar Enlace
                    </Button>
                </div>
            );
        }

        // Renderizado del grid de juegos
        return (
            <div>
                {/* Grid de Juegos */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-8 mb-12">
                    {juegos.map((juego) => (
                        <GameCard key={juego.id} juego={juego} />
                    ))}
                </div>

                {/* Paginación */}
                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="juegos registrados"
                />
            </div>
        );
    };

    // Renderizado del layout
    return (
        <MainLayout>
            <Head title="Inventario de Títulos" />

            <PageHeader 
                title="Catálogo de Juegos"
                topLabel="Catálogo de Juegos"
                description="Administra los títulos digitales."
                icon={PackageSearch}
            >
                <Button 
                    variant="primary" 
                    icon={PackageSearch} 
                    onClick={() => router.visit('/juegos/nuevo')}
                > Añadir Juego
                </Button>
            </PageHeader>

            {/* Barra de búsqueda y filtros */}
            <div className="mb-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/*Contenedor del input*/}
                <div className="flex gap-4 w-full lg:w-auto flex-1">
                    {/*Input de búsqueda*/}
                    <Input 
                        icon={Search}
                        placeholder="Localizar título por denominación..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 lg:max-w-md space-y-0"
                    />

                    {/*Boton de búsqueda*/}
                    <Button variant="secondary" icon={Search} onClick={handleSearch}>
                        Buscar
                    </Button>
                </div>

                {/*Contenedor del select*/}
                <div className="flex items-center w-full lg:w-auto">
                    <Select 
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        placeholder=""
                        options={[
                            { value: 12, label: '12 por página' },
                            { value: 24, label: '24 por página' },
                            { value: 60, label: '60 por página' },
                        ]}
                        className="space-y-0"
                    />
                </div>
            </div>

            {renderContent()}
        </MainLayout>
    );
}
