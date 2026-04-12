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
    const [perPage] = useState(5);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 5,
        total: 0
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');

    useEffect(() => {
        const fetchFacturas = async () => {
            setLoading(true);
            try {
                // Endpoint local de la API
                const res = await axios.get(`http://localhost:3000/facturas/factura_por_pagina/${perPage}/num_pagina/${page}`);
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
    }, [page, perPage]);

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
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input 
                    icon={Search}
                    placeholder="Buscar por cliente, juego o ID de factura..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 space-y-0"
                />
                <div className="flex gap-4">
                    <Select 
                        placeholder="Tipo de Venta"
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        options={[
                            { value: 'primaria', label: 'Primaria' },
                            { value: 'secundaria', label: 'Secundaria' },
                        ]}
                        className="space-y-0 min-w-[200px]"
                    />
                    <button className="flex items-center justify-center px-5 bg-white/2 hover:bg-indigo-600 rounded-2xl text-gray-600 hover:text-white transition-all border border-white/5">
                        <Filter className="w-5 h-5" />
                    </button>
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
