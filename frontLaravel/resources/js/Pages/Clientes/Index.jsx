import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { Users, UserPlus, Search, Filter } from 'lucide-react';
import axios from 'axios';

// Componentes Modularizados
import ClientesTable from '@/Components/Clientes/ClientesTable';
import Pagination from '@/Components/UI/Pagination';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Toast from '@/Components/UI/Toast';

export default function ClientesIndex() {
    const [clientes, setClientes] = useState([]);
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
    const [searchTerm, setSearchTerm] = useState('');
    const [network, setNetwork] = useState('');

    useEffect(() => {
        const fetchClientes = async () => {
            setLoading(true);
            try {
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
                    placeholder="Buscar por código, nombre o teléfono..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 space-y-0"
                />
                <div className="flex gap-4">
                    <Select 
                        placeholder="Medio de Contacto (Red)"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        options={[
                            { value: 'ws', label: 'WhatsApp' },
                            { value: 'ig', label: 'Instagram' },
                            { value: 'fb', label: 'Facebook' },
                        ]}
                        className="space-y-0 min-w-[200px]"
                    />
                    <button className="flex items-center justify-center px-5 bg-white/2 hover:bg-indigo-600 rounded-2xl text-gray-600 hover:text-white transition-all border border-white/5">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Tabla Card (Contenedor original) */}
            <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <ClientesTable 
                    clientes={clientes} 
                    loading={loading} 
                    onCopy={handleCopy} 
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

            {/* Notification Toast */}
            <Toast 
                show={showCopyMsg}
                message="Copiado al portapapeles"
                variant="copy"
                onClose={() => setShowCopyMsg(false)}
            />
        </MainLayout>
    );
}
