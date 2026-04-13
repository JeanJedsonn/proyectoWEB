import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Select from '@/Components/UI/Select';
import Input from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';
import FacturasTable from '@/Components/Facturas/FacturasTable';

export default function FacturasIndex() {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('titulo_juego');
    const [tipoFiltro, setTipoFiltro] = useState('');

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
                const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${API_URL}/facturas/factura_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (searchTerm && searchTerm.trim() !== '') {
                    url = `${API_URL}/campo/${searchField}/buscar/${searchTerm}/factura_por_pagina/${perPage}/num_pagina/${page}`;
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
    }, [searchTerm, searchField, tipoFiltro, perPage]);

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
                    {/*
                    <Select 
                        placeholder="Tipo de Venta"
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        options={[
                            { value: 'primaria', label: 'Primaria' },
                            { value: 'secundaria', label: 'Secundaria' },
                        ]}
                        className="space-y-0 min-w-[200px]"
                    />*/}
                </div>
                <div className="flex gap-4">
                    <Select 
                        placeholder="Registros"
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        options={[
                            { value: 10, label: '10 Facturas' },
                            { value: 25, label: '25 Facturas' },
                            { value: 50, label: '50 Facturas' },
                        ]}
                        className="space-y-0 min-w-[140px]"
                    />
                </div>
            </div>

            {/* Contenedor de la tabla */}
            <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <FacturasTable 
                    facturas={facturas}
                    loading={loading}
                />

                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="facturas"
                    className="border-t border-white/5 bg-transparent"
                />
            </div>
        </MainLayout>
    );
}
