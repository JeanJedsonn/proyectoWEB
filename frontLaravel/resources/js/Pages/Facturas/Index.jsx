import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { FileText, Search, Plus, Loader2, PackageSearch } from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Select from '@/Components/UI/Select';
import Input from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';
import FacturaCard from '@/Components/Facturas/FacturaCard';

export default function FacturasIndex() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('titulo_juego');

    // Sincronizar con parámetros de URL al montar
    useEffect(() => {
        const params = new URLSearchParams(globalThis.location.search);
        const search = params.get('search');
        const field = params.get('field');
        
        if (search) setSearchTerm(search);
        if (field) setSearchField(field);
    }, []);

    useEffect(() => {
        const fetchFacturas = async () => {
            setLoading(true);
            try {
                const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${urlNode}/facturas/factura_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (searchTerm && searchTerm.trim() !== '') {
                    url = `${urlNode}/facturas/campo/${searchField}/buscar/${searchTerm}/factura_por_pagina/${perPage}/num_pagina/${page}`;
                }

                const res = await axios.get(url);
                setFacturas(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando facturas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacturas();
    }, [page, perPage, searchTerm, searchField]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, searchField, perPage]);

    // Lógica para renderizar el contenido principal
    const renderContent = () => {
        if (loading) {
            return (
                <div className="bg-[#161821] border border-transparent rounded-4xl p-24 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5" />
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 relative z-10" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] italic relative z-10">Recuperando registros contables...</p>
                </div>
            );
        }

        if (facturas.length === 0) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-24 flex flex-col items-center justify-center text-center min-h-[400px] shadow-2xl">
                    <div className="w-24 h-24 bg-white/2 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                        <PackageSearch className="w-12 h-12 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Sin Facturación</h3>
                    <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-bold uppercase text-[10px] tracking-widest opacity-60">
                        No se detectaron recibos procesados bajo los criterios de búsqueda actuales.
                    </p>
                </div>
            );
        }

        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {facturas.map((factura) => (
                        <FacturaCard key={factura.id} factura={factura} />
                    ))}
                </div>

                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="facturas"
                />
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Historial de Facturas" />

            <PageHeader
                title="Historial de Facturas"
                description="Registro histórico de ventas completadas, agrupadas por clientes y tipos de cuenta."
                icon={FileText}
                topLabel="Facturación"
            >
                <Button 
                    variant="primary" 
                    icon={Plus} 
                    onClick={() => router.visit('/facturas/nueva')}
                >
                    Generar Factura
                </Button>
            </PageHeader>

            {/* Filtros y Búsqueda */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 flex gap-2">
                    <Input 
                        icon={Search}
                        placeholder={`Buscar por ${searchField.replace('_', ' ')}...`} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 space-y-0"
                    />
                    <Select 
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                        options={[
                            { value: 'titulo_juego', label: 'Juego' },
                            { value: 'tipo', label: 'Tipo' },
                            { value: 'plataforma', label: 'Plataforma' },
                            { value: 'fecha_venta', label: 'Fecha' },
                        ]}
                        className="space-y-0 min-w-[140px]"
                    />
                </div>
                <div className="flex gap-4">
                    <Select 
                        placeholder="Registros"
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        options={[
                            { value: 12, label: '12 Facturas' },
                            { value: 24, label: '24 Facturas' },
                            { value: 60, label: '60 Facturas' },
                        ]}
                        className="space-y-0 min-w-[140px]"
                    />
                </div>
            </div>

            {/* Contenido Dinámico */}
            <div className="mb-20">
                {renderContent()}
            </div>
        </MainLayout>
    );
}
