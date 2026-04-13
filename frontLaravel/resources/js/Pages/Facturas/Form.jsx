import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    FileText, Save, X, DollarSign, Calendar, Search,
    Gamepad2, ShieldCheck, Mail, KeyRound, Key
} from 'lucide-react';

// Componentes UI Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import Alert from '@/Components/UI/Alert';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import DataCopyBox from '@/Components/UI/DataCopyBox';
import QuickSelectList from '@/Components/UI/QuickSelectList';

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
    
    
    // Retorna el loading mientras carga los datos
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

    // Retorna el formulario de factura
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
                {/* Botones de acción */}
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
                        {isEditing ? 'Guardar Cambios' : 'Emitir Factura'}
                    </Button>
                </div>
            </PageHeader>

            {/* Mensajes de error y éxito */}
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

            {/* Formulario de factura */}
            <form id="facturaForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20 max-w-6xl mx-auto">
                {/* Columna 1: Datos Financieros y Cliente */}
                <div className="space-y-8">

                    {/* Datos Comerciales */}
                    <Card title="Datos Comerciales" icon={DollarSign}>
                        <div className="space-y-8 p-2">
                            
                            {/* Inputs de datos comerciales */}
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
                            
                            {/* Cliente */}
                            <div className="space-y-3 pt-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between px-1">
                                    <span>Identidad del Comprador <span className="text-red-500 ml-1">●</span></span>
                                    <Link href="/clientes/nuevo" className="text-indigo-400 hover:text-white transition-colors">Registrar Nuevo</Link>
                                </label>
                                
                                {/* Buscador de clientes */}
                                <div className="bg-[#0b0d12]/50 border border-white/5 rounded-2xl p-6 space-y-4 shadow-inner">
                                    {/* Input para buscar clientes */}
                                    <Input 
                                        type="text"
                                        placeholder="Filtrar por nombre..."
                                        value={searchCliente}
                                        onChange={(e) => setSearchCliente(e.target.value)}
                                        icon={Search}
                                        className="space-y-0"
                                        variant="dark"
                                    />

                                    {/* Lista de clientes */}
                                    <QuickSelectList 
                                        items={filteredClientes}
                                        selectedId={formData.clienteID}
                                        onSelect={(cl) => handleChange({target: {name: 'clienteID', value: cl.id}})}
                                        getLabel={(cl) => cl.nombre}
                                        getSublabel={(cl) => cl.red}
                                        height="h-44"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Columna 2: Activo Digital y Snapshot */}
                <div className="space-y-8">
                    <Card title="Juego Vendido" icon={Gamepad2}>
                        <div className="space-y-8 p-2">
                            
                            {/* Juego */}
                            <Select 
                                label="Título del Juego"
                                name="juego_id" required
                                value={formData.juego_id}
                                onChange={handleChange}
                                placeholder="Juegos Registrados..."
                                options={juegos.map(jg => ({ value: jg.id, label: jg.titulo }))}
                                icon={Gamepad2}
                                variant="dark"
                            />

                            {/* Plataforma */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Select 
                                    label="Plataforma"
                                    name="plataforma" required
                                    value={formData.plataforma}
                                    onChange={handleChange}
                                    options={[
                                        {value: "PS4", label: "PlayStation 4"},
                                        {value: "PS5", label: "PlayStation 5"},
                                        {value: "Xbox", label: "Xbox Server"},
                                        {value: "Nintendo", label: "Nintendo Switch"},
                                        {value: "PC", label: "Steam PC"}
                                    ]}
                                    variant="dark"
                                />

                                {/* Tipo de Cuenta */}
                                <Select 
                                    label="Tipo de Cuenta"
                                    name="tipo" required
                                    value={formData.tipo}
                                    onChange={handleChange}
                                    options={[
                                        {value: "Primaria", label: "Primaria"},
                                        {value: "Secundaria", label: "Secundaria"}
                                    ]}
                                    variant="dark"
                                />
                            </div>

                            {/* Snapshot Histórico */}
                            <div className="pt-8 border-t border-white/5 space-y-4">
                                
                                {/* Identificador de Cuenta */}
                                <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Identificador de Cuenta</span>
                                </div>
                                
                                {/* Buscador de Cuentas */}
                                <div className="bg-[#0b0d12]/50 border border-white/5 rounded-2xl p-6 space-y-4 shadow-inner">
                                    
                                    {/* Input de búsqueda */}
                                    <Input 
                                        type="text"
                                        placeholder="Email o Clave de la cuenta..."
                                        value={searchCuenta}
                                        onChange={(e) => setSearchCuenta(e.target.value)}
                                        icon={Search}
                                        className="space-y-0"
                                        variant="dark"
                                    />

                                    {/* Lista de Cuentas */}
                                    <QuickSelectList 
                                        items={filteredCuentas}
                                        selectedId={selectedCuentaId}
                                        onSelect={(ct) => handleCuentaSelect({target: {value: ct.id}})}
                                        getLabel={(ct) => ct.direccionCorreo}
                                        getSublabel={(ct) => ct.clave}
                                        height="h-44"
                                    />
                                </div>
                                
                                {/* Datos Extraídos */}
                                <div className="grid grid-cols-1 gap-4 pt-4">
                                    <DataCopyBox
                                        label="Correo Extraído"
                                        value={formData.correo}
                                        icon={Mail}
                                        onCopy={(val) => handleCopy(val, 'Correo copiado')}
                                        placeholder="Esperando selección de cuenta..."
                                        variant="emerald"
                                    />

                                    <DataCopyBox
                                        label="Contraseña Extraída"
                                        value={formData.clave}
                                        icon={Key}
                                        onCopy={(val) => handleCopy(val, 'Clave copiada')}
                                        placeholder="Esperando selección de cuenta..."
                                        variant="indigo"
                                    />
                                </div>

                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </MainLayout>
    );
}
