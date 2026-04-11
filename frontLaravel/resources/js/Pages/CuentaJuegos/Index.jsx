import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Search, Filter, 
    Plus, Gamepad2
} from 'lucide-react';
import axios from 'axios';

// Componentes Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Select from '@/Components/UI/Select';
import Input from '@/Components/UI/Input';
import Pagination from '@/Components/UI/Pagination';
import CuentaJuegosTable from '@/Components/CuentaJuegos/CuentaJuegosTable';
import Toast from '@/Components/UI/Toast';

export default function CuentaJuegosIndex() {
    const [searchTerm, setSearchTerm] = useState('');
    const [platform, setPlatform] = useState('');
    const [cuentas, setCuentas] = useState([]);
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
    const [copyMsgText, setCopyMsgText] = useState('Copiado al portapapeles');

    useEffect(() => {
        const fetchCuentas = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/cuentas/cuentas_por_pagina/${perPage}/num_pagina/${page}`);
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

        fetchCuentas();
    }, [page, perPage]);

    const handleCopy = (e, text, msg = 'Copiado al portapapeles') => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            setCopyMsgText(msg);
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

    // La tabla y su lógica han sido extraídas a CuentaJuegosTable.jsx

    return (
        <MainLayout>
            <Head title="Cuentas Registradas" />
            
            <PageHeader
                title="Cuenta Juegos"
                description="Desglose de credenciales, plataformas y dependencias de juegos."
                icon={Gamepad2}
                topLabel="Inventario Matriz"
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
                    placeholder="Buscar por correo, clave, juego o ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 space-y-0"
                />
                <div className="flex gap-4">
                    <Select 
                        placeholder="Plataformas"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        options={[
                            { value: 'psn', label: 'PlayStation' },
                            { value: 'xbox', label: 'Xbox Live' },
                            { value: 'steam', label: 'Steam PC' },
                            { value: 'nintendo', label: 'Nintendo' },
                        ]}
                        className="space-y-0 w-48"
                    />
                    <button className="flex items-center justify-center px-5 bg-white/2 hover:bg-indigo-600 rounded-2xl text-gray-600 hover:text-white transition-all border border-white/5">
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

            {/* Toast Global */}
            <Toast 
                show={showCopyMsg}
                message={copyMsgText}
                variant="copy"
                onClose={() => setShowCopyMsg(false)}
            />
        </MainLayout>
    );
}
