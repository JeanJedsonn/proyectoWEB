import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    FileText, Save, X, DollarSign, Calendar, Search,
    Gamepad2, ShieldCheck, Mail, KeyRound
} from 'lucide-react';

// Componentes UI Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import Alert from '@/Components/UI/Alert';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';

export default function FacturaForm({ id = null }) {
    const isEditing = !!id;
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [juegos, setJuegos] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    
    // Estados de búsqueda locales
    const [searchCliente, setSearchCliente] = useState('');
    const [searchCuenta, setSearchCuenta] = useState('');
    const [selectedCuentaId, setSelectedCuentaId] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Convert to local datetime-local format 'YYYY-MM-DDThh:mm'
    const formatDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        fecha: formatDateTimeLocal(new Date().toISOString()),
        precioVenta: '',
        precioCompra: '',
        clienteID: '',
        tipo: 'Primaria',
        plataforma: 'PS4',
        juego_id: '',
        correo: '',
        clave: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch available Clientes
                const resClientes = await axios.get('http://localhost:3000/clientes/clientes_por_pagina/500/num_pagina/1');
                setClientes(resClientes.data.data || []);

                // 2. Fetch available Juegos
                const resJuegos = await axios.get('http://localhost:3000/juegos/juegos_por_pagina/500/num_pagina/1');
                setJuegos(resJuegos.data.data || []);

                // 3. Fetch available Cuentas de Juego (Para el snapshot)
                const resCuentas = await axios.get('http://localhost:3000/cuentas/cuentas_por_pagina/500/num_pagina/1');
                setCuentas(resCuentas.data.data || []);

                // 4. If editing, fetch facture details
                if (isEditing) {
                    const resFactura = await axios.get(`http://localhost:3000/facturas/form_factura/${id}`);
                    const data = resFactura.data;

                    setFormData({
                        fecha: data.fecha ? formatDateTimeLocal(data.fecha) : '',
                        precioVenta: data.precioVenta || '',
                        precioCompra: data.precioCompra || '',
                        clienteID: data.clienteID || '',
                        tipo: data.tipo || 'Primaria',
                        plataforma: data.plataforma || 'PS4',
                        juego_id: data.juego_id || '',
                        correo: data.correo || '',
                        clave: data.clave || ''
                    });
                }
            } catch (err) {
                console.error("Error cargando datos del formulario:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCuentaSelect = (e) => {
        const cuentaId = Number.parseInt(e.target.value);
        setSelectedCuentaId(cuentaId);
        
        if (!cuentaId) {
            setFormData(prev => ({...prev, correo: '', clave: ''}));
            return;
        }

        const cuenta = cuentas.find(c => c.id === cuentaId);
        if (cuenta) {
            setFormData(prev => ({
                ...prev, 
                correo: cuenta.direccionCorreo, 
                clave: cuenta.clave
            }));
        }
    };

    const filteredClientes = clientes.filter(c => 
        c.nombre.toLowerCase().includes(searchCliente.toLowerCase()) || 
        (c.red && c.red.toLowerCase().includes(searchCliente.toLowerCase()))
    );

    const filteredCuentas = cuentas.filter(c => 
        (c.direccionCorreo && c.direccionCorreo.toLowerCase().includes(searchCuenta.toLowerCase())) || 
        (c.clave && c.clave.toLowerCase().includes(searchCuenta.toLowerCase()))
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Adjust payload date to JSON strict formatting if needed
            let fechaIso = formData.fecha;
            if (fechaIso && !fechaIso.endsWith('Z')) {
                fechaIso = new Date(fechaIso).toISOString();
            }

            const payload = { ...formData, fecha: fechaIso };

            if (isEditing) {
                await axios.patch(`http://localhost:3000/facturas/form_factura/${id}`, payload);
            } else {
                await axios.post(`http://localhost:3000/facturas/form_factura`, payload);
            }
            router.visit('/facturas');
        } catch (err) {
            console.error("Error guardando factura:", err);
            setErrorMsg(err.response?.data?.mensaje || "No se pudo guardar la factura. Verifica los datos requeridos (Cliente, Juego, Precios).");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!globalThis.confirm("¿Estás seguro de que deseas eliminar esta factura? Esta acción es irreversible y altera el contable.")) return;
        setSubmitting(true);
        try {
            setErrorMsg("La eliminación de facturas requiere aprobación administrativa (Función restringida).");
        } catch (err) {
            console.error("Error eliminando cuenta:", err);
            setErrorMsg("Error al procesar la solicitud.");
        } finally {
            setSubmitting(false);
        }
    };
    
    // Inyectar handleDelete logic if needed, but for now we remove it if unused.
    // Actually, I'll just remove the unused assignment as requested.
    // Wait, the linter says "Remove this useless assignment".
    
    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Generando Ticket Transaccional...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEditing ? 'Editar Factura' : 'Registrar Factura'} />
            
            <PageHeader
                title={isEditing ? 'Ficha de Factura' : 'Emisión de Factura'}
                description={isEditing ? `Modificando transacción #${id}` : 'Registro contable de venta de activo digital.'}
                icon={FileText}
                breadcrumbs={[
                    { label: 'Facturas', href: '/facturas' },
                    { label: isEditing ? 'Editar' : 'Nueva' }
                ]}
            >
                <div className="flex items-center gap-3">
                    <Button 
                        variant="secondary"
                        icon={X}
                        onClick={() => globalThis.history.back()}
                    >
                        Descartar
                    </Button>
                    <Button 
                        type="submit" 
                        form="facturaForm"
                        variant="primary"
                        loading={submitting}
                        icon={Save}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Emitir Recibo'}
                    </Button>
                </div>
            </PageHeader>

            <div className="max-w-6xl mx-auto space-y-6">
                {errorMsg && (
                    <Alert 
                        variant="danger" 
                        message={errorMsg} 
                        onClose={() => setErrorMsg(null)} 
                    />
                )}
                {successMsg && (
                    <Alert 
                        variant="success" 
                        message={successMsg} 
                        onClose={() => setSuccessMsg(null)} 
                    />
                )}
            </div>

            <form id="facturaForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20 max-w-6xl mx-auto">
                {/* Columna 1: Datos Financieros y Cliente */}
                <div className="space-y-8">
                    <Card title="Métricas Comerciales" icon={DollarSign}>
                        <div className="space-y-8 p-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                                <Input
                                    label="Inversión Base (Costo)"
                                    type="number" step="0.01" required
                                    name="precioCompra"
                                    value={formData.precioCompra}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    icon={DollarSign}
                                    variant="dark"
                                />
                                <Input
                                    label="Facturación al Cliente"
                                    type="number" step="0.01" required
                                    name="precioVenta"
                                    value={formData.precioVenta}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    icon={DollarSign}
                                    variant="dark"
                                />
                            </div>

                            <Input
                                label="Fecha y Hora de Emisión"
                                type="datetime-local" required
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                icon={Calendar}
                                variant="dark"
                            />
                            
                            <div className="space-y-3 pt-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between px-1">
                                    <span>Identidad del Comprador <span className="text-red-500 ml-1">●</span></span>
                                    <Link href="/clientes/nuevo" className="text-indigo-400 hover:text-white transition-colors">Registrar Nuevo</Link>
                                </label>
                                <div className="bg-[#0b0d12]/50 border border-white/5 rounded-2xl p-6 space-y-4 shadow-inner">
                                    <Input 
                                        type="text"
                                        placeholder="Filtrar por nombre..."
                                        value={searchCliente}
                                        onChange={(e) => setSearchCliente(e.target.value)}
                                        icon={Search}
                                        className="space-y-0"
                                        variant="dark"
                                    />
                                    <div className="relative bg-[#161821] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                                        <div className="w-full h-44 overflow-y-auto custom-scrollbar p-2">
                                            {filteredClientes.map(cl => {
                                                const isSelected = String(formData.clienteID) === String(cl.id);
                                                return (
                                                    <button 
                                                        key={cl.id} 
                                                        type="button"
                                                        onClick={() => handleChange({target: {name: 'clienteID', value: cl.id}})}
                                                        className={`w-full text-left p-3 text-[11px] font-black transition-all mb-1 last:mb-0 rounded-lg flex items-center gap-3 border ${isSelected ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-white border-transparent'}`}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-gray-800'}`}></div>
                                                        <span className="truncate flex-1">{cl.nombre}</span>
                                                        <span className="opacity-30 uppercase tracking-tighter shrink-0">{cl.red || 'S/R'}</span>
                                                    </button>
                                                )
                                            })}
                                            {filteredClientes.length === 0 && (
                                                <div className="p-8 text-center text-[10px] font-black text-gray-700 uppercase tracking-widest">Sin coincidencias</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Columna 2: Activo Digital y Snapshot */}
                <div className="space-y-8">
                    <Card title="Catálogo de Entrega" icon={Gamepad2}>
                        <div className="space-y-8 p-2">
                            <Select 
                                label="Título Licenciado"
                                name="juego_id" required
                                value={formData.juego_id}
                                onChange={handleChange}
                                placeholder="Bibliotecas Registradas..."
                                options={juegos.map(jg => ({ value: jg.id, label: jg.titulo }))}
                                icon={Gamepad2}
                                variant="dark"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Select 
                                    label="Plataforma Matriz"
                                    name="plataforma" required
                                    value={formData.plataforma}
                                    onChange={handleChange}
                                    options={[
                                        {value: "PS4", label: "PlayStation 4"},
                                        {value: "PS5", label: "PlayStation 5"},
                                        {value: "Xbox", label: "Xbox Server"},
                                        {value: "Nintendo", label: "Nintendo Switch"}
                                    ]}
                                    variant="dark"
                                />

                                <Select 
                                    label="Modo de Cuenta"
                                    name="tipo" required
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    options={[
                                        {value: "Primaria", label: "Primaria (Global)"},
                                        {value: "Secundaria", label: "Secundaria (Lock)"}
                                    ]}
                                    variant="dark"
                                />
                            </div>

                            {/* Snapshot Histórico */}
                            <div className="pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Snapshot de Cuenta Origen</span>
                                </div>

                                <div className="bg-[#0b0d12]/50 border border-white/5 rounded-2xl p-6 space-y-4 shadow-inner">
                                    <Input 
                                        type="text"
                                        placeholder="Email o Clave de la cuenta..."
                                        value={searchCuenta}
                                        onChange={(e) => setSearchCuenta(e.target.value)}
                                        icon={Search}
                                        className="space-y-0"
                                        variant="dark"
                                    />
                                    <div className="relative bg-[#161821] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                                        <div className="w-full h-36 overflow-y-auto custom-scrollbar p-2">
                                            <button 
                                                type="button"
                                                onClick={() => handleCuentaSelect({target: {value: ''}})}
                                                className={`w-full text-left p-3 text-[10px] font-black uppercase tracking-widest transition-all mb-1 rounded-lg ${!selectedCuentaId ? 'bg-white/5 text-gray-300' : 'text-gray-700 hover:bg-white/5'}`}
                                            >
                                                -- Selector Manual --
                                            </button>
                                            {filteredCuentas.map(ct => {
                                                const isSelected = String(selectedCuentaId) === String(ct.id);
                                                return (
                                                    <button 
                                                        key={ct.id} 
                                                        type="button"
                                                        onClick={() => handleCuentaSelect({target: {value: ct.id}})}
                                                        className={`w-full text-left p-3 text-[11px] font-black transition-all mb-1 last:mb-0 rounded-lg flex flex-col gap-0.5 border ${isSelected ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-gray-500 hover:bg-white/5 hover:text-white border-transparent'}`}
                                                    >
                                                        <span className="truncate">{ct.direccionCorreo}</span>
                                                        <span className="opacity-30 font-mono text-[9px]">CLAVE: {ct.clave}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-2xl p-5 shadow-2xl group transition-all hover:border-indigo-500/30">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-indigo-400 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black block mb-1">Email Extraído</span>
                                            <div className="text-sm font-bold text-white break-all truncate">
                                                {formData.correo || <span className="text-gray-800 opacity-50 uppercase tracking-widest text-[10px]">Sin Vínculo</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-2xl p-5 shadow-2xl group transition-all hover:border-indigo-500/30">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-indigo-400 transition-colors">
                                            <KeyRound className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-black block mb-1">Pass Extraída</span>
                                            <div className="text-sm font-bold text-white break-all truncate">
                                                {formData.clave || <span className="text-gray-800 opacity-50 uppercase tracking-widest text-[10px]">Sin Vínculo</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </MainLayout>
    );
}
