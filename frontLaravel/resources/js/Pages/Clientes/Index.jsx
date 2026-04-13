import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { Users, UserPlus, Search } from 'lucide-react';
import axios from 'axios';

// Componentes Modularizados
import ClientesTable from '@/Components/Clientes/ClientesTable';
import Pagination from '@/Components/UI/Pagination';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
// Componentes Modularizados

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
                const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${API_URL}/clientes/clientes_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (network) {
                    url = `${API_URL}/clientes/campo/red/buscar/${network}/clientes_por_pagina/${perPage}/num_pagina/${page}`;
                } else if (searchField && searchTerm) {
                    url = `${API_URL}/clientes/campo/${searchField}/buscar/${searchTerm}/clientes_por_pagina/${perPage}/num_pagina/${page}`;
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

        fetchClientes();
    }, [page, perPage, searchTerm, network, searchField]);

    // Resetear a página 1 cuando cambian filtros o tamaño de página
    useEffect(() => {
        setPage(1);
    }, [searchTerm, network, searchField, perPage]);



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
            <div className="flex flex-col md:flex-row gap-4 mb-8">
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
                        className="space-y-0 min-w-[180px]"
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
                        className="space-y-0 min-w-[180px]"
                    />
                    <Select 
                        placeholder="Filas"
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        options={[
                            { value: 10, label: '10 Filas' },
                            { value: 25, label: '25 Filas' },
                            { value: 50, label: '50 Filas' },
                        ]}
                        className="space-y-0 min-w-[120px]"
                    />
                </div>
            </div>

            {/* Tabla Card (Contenedor original) */}
            <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <ClientesTable 
                    clientes={clientes} 
                    loading={loading} 
                />

                {/* Pagination */}
                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="clientes"
                    className="border-t border-white/5 bg-transparent"
                />
            </div>


        </MainLayout>
    );
}
