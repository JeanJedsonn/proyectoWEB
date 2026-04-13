import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Mail, Search, Plus, Loader2, PackageSearch 
} from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Pagination from '@/Components/UI/Pagination';
import CorreoCard from '@/Components/Correos/CorreoCard';

export default function CorreosIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [correos, setCorreos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
    });

    useEffect(() => {
        const fetchCorreos = async () => {
            setLoading(true);
            try {
                const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${urlNode}/correos/correos_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (searchTerm) {
                    url = `${urlNode}/correos/campo/direccion/buscar/${searchTerm}/correos_por_pagina/${perPage}/num_pagina/${page}`;
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

        const debounceTimer = setTimeout(() => {
            fetchCorreos();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [page, perPage, searchTerm]);

    // Resetear a página 1 cuando cambian filtros o tamaño de página
    useEffect(() => {
        setPage(1);
    }, [searchTerm, perPage]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="bg-[#161821] border border-transparent rounded-4xl p-24 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5" />
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 relative z-10" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[11px] italic relative z-10">Escaneando Directorio Electrónico...</p>
                </div>
            );
        }

        if (correos.length === 0) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-24 flex flex-col items-center justify-center text-center min-h-[400px] shadow-2xl">
                    <div className="w-24 h-24 bg-white/2 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                        <PackageSearch className="w-12 h-12 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Directorio Vacío</h3>
                    <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-bold uppercase text-[10px] tracking-widest opacity-60">
                        No se detectaron cuentas registradas que coincidan con los criterios de búsqueda actuales.
                    </p>
                </div>
            );
        }

        return (
            <div>
                {/* Grid de Correos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {correos.map((correo) => (
                        <CorreoCard key={correo.id} correo={correo} />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="correos"
                />
            </div>
        );
    };

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
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <Input 
                    icon={Search}
                    placeholder="Buscar por dirección o dominio..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 space-y-0"
                />
                <div className="flex gap-4">
                    <Select 
                        placeholder="Registros"
                        value={perPage}
                        onChange={(e) => setPerPage(Number(e.target.value))}
                        options={[
                            { value: 12, label: '12 Correos' },
                            { value: 24, label: '24 Correos' },
                            { value: 60, label: '60 Correos' },
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
