import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Search, Filter, 
    Plus, Gamepad2, Check
} from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Select from '@/Components/UI/Select';
import Input from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';
import CuentaJuegosTable from '@/Components/CuentaJuegos/CuentaJuegosTable';


export default function CuentaJuegosIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('direccionCorreo');
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    });
    const [copiedAlert, setCopiedAlert] = useState(false);

    useEffect(() => {
        const fetchCuentas = async () => {
            setLoading(true);
            try {
                const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                let url = `${urlNode}/cuentas/cuentas_por_pagina/${perPage}/num_pagina/${page}`;
                
                if (searchTerm.trim() !== '') {
                    url = `${urlNode}/cuentas/campo/${searchField}/buscar/${searchTerm}/cuentas_por_pagina/${perPage}/num_pagina/${page}`;
                }

                const res = await axios.get(url);
                setCuentas(res.data.data || []);
                setPaginationInfo({
                    current_page: res.data.current_page || 1,
                    last_page: res.data.last_page || 1,
                    per_page: res.data.per_page || perPage,
                    total: res.data.total || 0
                });
            } catch (error) {
                console.error("Error cargando cuentas de juego:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchCuentas();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [page, perPage, searchTerm, searchField]);

    const handleCopy = (e, text, msg = 'Copiado al portapapeles') => {
        if (e) e.stopPropagation();
        
        const triggerSuccess = () => {
            setCopiedAlert(true);
            setTimeout(() => setCopiedAlert(false), 1500);
        };

        navigator.clipboard?.writeText(text)
            .then(triggerSuccess)
            .catch(err => console.error("Fallo al copiar: ", err));
    };

    return (
        <MainLayout>
            <Head title="Cuentas Registradas" />
            
            <PageHeader
                title="Cuentas"
                description="Desglose de credenciales y plataforma."
                icon={Gamepad2}
                topLabel="Inventario de Cuentas"
            >
                <Button 
                    variant="primary" 
                    icon={Plus} 
                    onClick={() => router.visit('/cuentas_juego/nuevo')}
                >
                    Añadir Cuenta
                </Button>
            </PageHeader>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input 
                    icon={Search}
                    placeholder="Escribe para buscar..." 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    className="flex-1 space-y-0"
                />
                <div className="flex gap-4">
                    <Select 
                        placeholder="Buscar por..."
                        value={searchField}
                        onChange={(e) => {
                            setSearchField(e.target.value);
                            setPage(1);
                        }}
                        options={[
                            { value: 'direccionCorreo', label: 'Correo' },
                            { value: 'plataforma', label: 'Plataforma' },
                            { value: 'clave', label: 'Clave' },
                            { value: 'id', label: 'ID de Cuenta' }
                        ]}
                        className="space-y-0 w-44"
                    />
                    <Select 
                        placeholder="Mostrar"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        options={[
                            { value: 10, label: '10 filas' },
                            { value: 25, label: '25 filas' },
                            { value: 50, label: '50 filas' },
                        ]}
                        className="space-y-0 w-32"
                    />
                    <button 
                        onClick={() => {
                            setSearchTerm('');
                            setSearchField('direccionCorreo');
                            setPage(1);
                        }}
                        className="flex items-center justify-center px-5 bg-white/2 hover:bg-red-500/20 rounded-2xl text-gray-600 hover:text-red-400 transition-all border border-white/5"
                        title="Limpiar filtros"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Table Component */}
            <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <CuentaJuegosTable 
                    cuentas={cuentas}
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
                    label="cuentas"
                    className="border-t border-white/5 bg-transparent"
                />
            </div>

            {copiedAlert && (
                <div className="fixed bottom-10 right-10 z-100 bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <Check className="w-4 h-4" />
                    Copiado al Portapapeles
                </div>
            )}
        </MainLayout>
    );
}
