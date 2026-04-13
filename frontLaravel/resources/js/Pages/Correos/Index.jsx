import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Mail, Search, Plus, Eye, Database 
} from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Badge from '@/Components/UI/Badge';
import Pagination from '@/Components/UI/Pagination';
import GenericTable from '@/Components/UI/GenericTable';

export default function CorreosIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [correos, setCorreos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });

    useEffect(() => {
        const fetchCorreos = async () => {
            setLoading(true);
            try {
                const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${API_URL}/correos/correos_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (searchTerm) {
                    url = `${API_URL}/correos/campo/direccion/buscar/${searchTerm}/correos_por_pagina/${perPage}/num_pagina/${page}`;
                }

                const res = await axios.get(url);
                setCorreos(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando correos:", error);
                setCorreos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCorreos();
    }, [page, perPage, searchTerm]);

    // Resetear a página 1 cuando cambian filtros o tamaño de página
    useEffect(() => {
        setPage(1);
    }, [searchTerm, perPage]);



    const getProviderIcon = (email) => {
        const lowerEmail = email?.toLowerCase() || '';
        if (lowerEmail.includes('outlook') || lowerEmail.includes('hotmail') || lowerEmail.includes('skiff')) {
            return <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20"><Mail className="w-4 h-4" /></div>;
        }
        if (lowerEmail.includes('gmail')) {
            return <div className="p-2 bg-red-500/10 rounded-lg text-red-400 border border-red-500/20"><Mail className="w-4 h-4" /></div>;
        }
        return <div className="p-2 bg-gray-500/10 rounded-lg text-gray-400 border border-gray-500/20"><Mail className="w-4 h-4" /></div>;
    };

    const columns = [
        { header: 'ID' },
        { header: 'Dirección (Unico)' },
        { header: 'Facturas', className: 'text-center' },
        { header: 'Acciones Rápidas', className: 'text-right' }
    ];

    const renderRow = (correo) => (
        <tr 
            key={correo.id} 
            className="group border-b border-white/5 hover:bg-white/2 transition-all cursor-pointer"
            onClick={() => router.visit(`/correos/${correo.id}`)}
        >
            <td className="px-6 py-4 text-sm font-mono text-gray-500">
                #{String(correo.id).padStart(3, '0')}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {getProviderIcon(correo.direccionCorreo)}
                    <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {correo.direccionCorreo}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <Badge variant={correo.facturas > 0 ? 'primary' : 'secondary'}>
                    {correo.facturas} {correo.facturas === 1 ? 'Factura' : 'Facturas'}
                </Badge>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Link 
                        href={`/correos/${correo.id}`}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all border border-white/5"
                        title="Ver detalles"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                </div>
            </td>
        </tr>
    );

    return (
        <MainLayout>
            <Head title="Directorio de Correos" />
            
            <PageHeader
                title="Directorio de Correos"
                description="Gestión centralizada de todas las direcciones de email registradas en la red."
                icon={Mail}
                topLabel="Correos Base"
            >
                <Button 
                    variant="primary" 
                    icon={Plus} 
                    onClick={() => router.visit('/correos/nuevo')}
                >
                    Añadir Correo
                </Button>
            </PageHeader>

            {/* Filtros Container */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input 
                    icon={Search}
                    placeholder="Buscar por dirección o dominio..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 space-y-0"
                />
                <div className="flex gap-4">
                    <Select 
                        placeholder="Filas"
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        options={[
                            { value: 10, label: '10 Filas' },
                            { value: 25, label: '25 Filas' },
                            { value: 50, label: '50 Filas' },
                        ]}
                        className="space-y-0 min-w-[140px]"
                    />
                </div>
            </div>

            {/* Main Content Genérico */}
            <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <GenericTable 
                    columns={columns}
                    data={correos}
                    loading={loading}
                    emptyMessage="Directorio Vacío"
                    emptyIcon={<Database className="w-12 h-12 mb-4 opacity-20 text-gray-500" />}
                    renderRow={renderRow}
                />

                {/* Pagination */}
                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="Correos"
                    className="border-t border-white/5 bg-transparent"
                />
            </div>

        </MainLayout>
    );
}
