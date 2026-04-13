import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { Users, UserPlus, Search, Loader2, PackageSearch } from 'lucide-react';
import axios from 'axios';

// Componentes Modularizados
import Pagination from '@/Components/UI/Pagination';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import ClienteCard from '@/Components/Clientes/ClienteCard';

export default function ClientesIndex() {
    const [clientes, setClientes] = useState([]);
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
    const [network, setNetwork] = useState('');
    const [searchField, setSearchField] = useState('');

    useEffect(() => {
        const fetchClientes = async () => {
            // Si el campo de búsqueda está seleccionado pero no hay término, no disparamos la búsqueda aún
            if (searchField && !searchTerm) {
                setClientes([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${urlNode}/clientes/clientes_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (network) {
                    url = `${urlNode}/clientes/campo/red/buscar/${network}/clientes_por_pagina/${perPage}/num_pagina/${page}`;
                } else if (searchField && searchTerm) {
                    url = `${urlNode}/clientes/campo/${searchField}/buscar/${searchTerm}/clientes_por_pagina/${perPage}/num_pagina/${page}`;
                }

                const res = await axios.get(url);
                setClientes(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando clientes:", error);
                setClientes([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchClientes();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [page, perPage, searchTerm, network, searchField]);

    // Resetear a página 1 cuando cambian filtros o tamaño de página
    useEffect(() => {
        setPage(1);
    }, [searchTerm, network, searchField, perPage]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="bg-[#161821] border border-transparent rounded-4xl p-24 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5" />
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 relative z-10" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[12px] italic relative z-10">Accediendo a la base de clientes...</p>
                </div>
            );
        }

        if (clientes.length === 0) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-24 flex flex-col items-center justify-center text-center min-h-[400px] shadow-2xl">
                    <div className="w-24 h-24 bg-white/2 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                        <PackageSearch className="w-12 h-12 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">No se hallaron resultados</h3>
                    <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-bold uppercase text-[10px] tracking-widest opacity-60">
                        No se detectaron registros que coincidan con los filtros de búsqueda aplicados actualmente.
                    </p>
                </div>
            );
        }

        return (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {clientes.map((cliente) => (
                        <ClienteCard key={cliente.id} cliente={cliente} />
                    ))}
                </div>

                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="clientes registrados"
                />
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Directorio de Clientes" />
            
            <PageHeader
                title="Directorio de Clientes"
                description="Listado de compradores y contactos, vital para el histórico de facturación."
                icon={Users}
                topLabel="Clientes"
            >
                <Button 
                    variant="primary" 
                    icon={UserPlus} 
                    onClick={() => router.visit('/clientes/nuevo')}
                >
                    Añadir Nuevo Cliente
                </Button>
            </PageHeader>

            {/* Filtros y Búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <Input 
                    icon={Search}
                    placeholder={!searchField && !network ? "Selecciona un campo para buscar..." : "Escribe para buscar..."} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={!searchField || network !== ''}
                    className="flex-1 space-y-0"
                />
                <div className="flex flex-wrap gap-4">
                    <Select 
                        placeholder="Buscar por Campo"
                        value={searchField}
                        onChange={(e) => {
                            setSearchField(e.target.value);
                            if (e.target.value !== '') {
                                setNetwork('');
                            }
                        }}
                        options={[
                            { value: '', label: 'Cualquier Campo' },
                            { value: 'nombre', label: 'Nombre' },
                            { value: 'correo', label: 'Correo' },
                            { value: 'telefono', label: 'Teléfono' },
                        ]}
                        className="space-y-0 min-w-[170px]"
                    />
                    <Select 
                        placeholder="Filtrar por Red"
                        value={network}
                        onChange={(e) => {
                            setNetwork(e.target.value);
                            if (e.target.value !== '') {
                                setSearchField('');
                                setSearchTerm('');
                            }
                        }}
                        options={[
                            { value: '', label: 'Cualquier Red' },
                            { value: 'WhatsApp', label: 'WhatsApp' },
                            { value: 'Instagram', label: 'Instagram' },
                            { value: 'Facebook', label: 'Facebook' },
                            { value: 'X (Twitter)', label: 'X (Twitter)' },
                        ]}
                        className="space-y-0 min-w-[170px]"
                    />
                    <Select 
                        placeholder="Registros"
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        options={[
                            { value: 12, label: '12 Clientes' },
                            { value: 24, label: '24 Clientes' },
                            { value: 60, label: '60 Clientes' },
                        ]}
                        className="space-y-0 min-w-[130px]"
                    />
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="mb-20">
                {renderContent()}
            </div>

        </MainLayout>
    );
}
