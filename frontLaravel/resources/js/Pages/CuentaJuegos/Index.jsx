import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Search, Filter, 
    Plus, Gamepad2, Loader2, PackageSearch, Copy
} from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Select from '@/Components/UI/Select';
import Input from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';
import CuentaJuegoCard from '@/Components/CuentaJuegos/CuentaJuegoCard';
import Alert from '@/Components/UI/Alert';

export default function CuentaJuegosIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('direccionCorreo');
    const [cuentas, setCuentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 12,
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

    const handleCopy = (e, text) => {
        if (e) e.stopPropagation();
        
        const performCopy = () => {
            setCopiedAlert(true);
            setTimeout(() => setCopiedAlert(false), 2000);
        };

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
                .then(performCopy)
                .catch(err => {
                    console.error('Error al usar clipboard API:', err);
                    fallbackCopy(text, performCopy);
                });
        } else {
            fallbackCopy(text, performCopy);
        }
    };

    const fallbackCopy = (text, callback) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) callback();
        } catch (err) {
            console.error('Fallback de copia falló:', err);
        }
        textArea.remove();
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="bg-[#161821] border border-transparent rounded-4xl p-24 flex flex-col items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5" />
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-6 relative z-10" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[11px] italic relative z-10">Accediendo al Inventario de Credenciales...</p>
                </div>
            );
        }

        if (cuentas.length === 0) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-24 flex flex-col items-center justify-center text-center min-h-[400px] shadow-2xl">
                    <div className="w-24 h-24 bg-white/2 rounded-full flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                        <PackageSearch className="w-12 h-12 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Cámara de Datos Vacía</h3>
                    <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-bold uppercase text-[10px] tracking-widest opacity-60">
                        No se detectaron cuentas registradas bajo los parámetros de búsqueda actuales.
                    </p>
                </div>
            );
        }

        return (
            <div>
                {/* Grid de Cuentas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {cuentas.map((cuenta) => (
                        <CuentaJuegoCard key={cuenta.id} cuenta={cuenta} onCopy={handleCopy} />
                        ))}
                </div>

                {/* Pagination */}
                <Pagination 
                    page={page}
                    lastPage={paginationInfo.last_page}
                    total={paginationInfo.total}
                    perPage={perPage}
                    onPageChange={setPage}
                    label="cuentas activas"
                />
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title="Inventario de Cuentas" />
            
            <PageHeader
                title="Inventario de Cuentas"
                description="Listado centralizado de credenciales matrices, plataformas y bibliotecas asignadas."
                icon={Gamepad2}
                topLabel="Gestión de Cuentas"
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
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <Input 
                    icon={Search}
                    placeholder="Filtrar por correo, plataforma o credenciales..." 
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
                        className="space-y-0 min-w-[150px]"
                    />
                    <Select 
                        placeholder="Registros"
                        value={perPage}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                        }}
                        options={[
                            { value: 12, label: '12 Cuentas' },
                            { value: 24, label: '24 Cuentas' },
                            { value: 60, label: '60 Cuentas' },
                        ]}
                        className="space-y-0 min-w-[130px]"
                    />
                    <button 
                        onClick={() => {
                            setSearchTerm('');
                            setSearchField('direccionCorreo');
                            setPage(1);
                        }}
                        className="flex items-center justify-center px-5 bg-white/2 hover:bg-indigo-500/20 rounded-2xl text-gray-600 hover:text-indigo-400 transition-all border border-white/5 active:scale-95"
                        title="Resetear filtros"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Contenido Dinámico */}
            <div className="mb-20">
                {renderContent()}
            </div>

            {copiedAlert && (
                <div className="fixed bottom-10 right-10 z-100 animate-in fade-in slide-in-from-right-10">
                    <Alert 
                        variant="success"
                        title="Portapapeles"
                        message="Información copiada exitosamente."
                        icon={Copy}
                        onClose={() => setCopiedAlert(false)}
                        className="shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-w-[320px]"
                    />
                </div>
            )}
        </MainLayout>
    );
}
