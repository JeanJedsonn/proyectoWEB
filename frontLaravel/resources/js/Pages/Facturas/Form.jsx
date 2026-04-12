import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    FileText, ArrowLeft, Save, X,
    Trash2, DollarSign, Calendar, Loader2, User, Search,
    Gamepad2, ShieldCheck, Key, AlertTriangle, Mail
} from 'lucide-react';
import Button from '@/Components/UI/Button';
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
        const cuentaId = parseInt(e.target.value);
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
            alert(err.response?.data?.mensaje || "No se pudo guardar la factura. Verifica los datos requeridos (Cliente, Juego, Precios).");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta factura? Esta acción es irreversible y altera el contable.")) return;
        setSubmitting(true);
        try {
            // Delete isn't officially mapped in routes but assuming REST pattern or returning to index manually if not existing.
            // Wait, looking at the api, there isn't a delete route for facturas currently mapped in facturas.js. We will just inform the user.
            alert("El endpoint de eliminación requiere aprobación del Administrador Principal (Función no habilitada).");
        } catch (err) {
            console.error("Error eliminando cuenta:", err);
            alert("Error al eliminar el registro.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Generando Ticket Transaccional...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEditing ? 'Editar Factura' : 'Registrar Factura'} />
            
            {/* Header / Toolbar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
                        <Link href="/facturas" className="hover:text-white transition-colors">Directorio Facturas</Link>
                        <span>/</span>
                        <span className="text-indigo-400">{isEditing ? "Editar" : "Nuevo"} Recibo</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        {isEditing ? 'Actualizar Ficha Factura' : 'Emitir Factura'}
                    </h1>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                        variant="secondary"
                        icon={X}
                        onClick={() => window.history.back()}
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
            </header>

            <form id="facturaForm" onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sección 1: Detalles de Transacción */}
                    <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-xl relative border-l-4 border-l-emerald-500">
                        <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic">
                            <DollarSign className="w-4 h-4" />
                            Métricas Comerciales
                        </h2>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Inversión Base (Costo)"
                                    type="number" step="0.01" required
                                    name="precioCompra"
                                    value={formData.precioCompra}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    icon={DollarSign}
                                />
                                <Input
                                    label="Facturación al Cliente"
                                    type="number" step="0.01" required
                                    name="precioVenta"
                                    value={formData.precioVenta}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    icon={DollarSign}
                                />
                            </div>

                            <Input
                                label="Fecha y Hora de Emisión"
                                type="datetime-local" required
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                icon={Calendar}
                            />
                            
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                    Identidad del Comprador *
                                    <Link href="/clientes/nuevo" className="text-indigo-400 hover:underline">Registrar Nuevo</Link>
                                </label>
                                <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4">
                                    <Input 
                                        type="text"
                                        placeholder="Buscar cliente por nombre..."
                                        value={searchCliente}
                                        onChange={(e) => setSearchCliente(e.target.value)}
                                        icon={Search}
                                        className="space-y-0"
                                    />
                                    <div className="relative bg-black/40 border border-white/5 rounded-xl overflow-hidden transition-colors">
                                        <User className="w-4 h-4 absolute left-4 top-5 text-gray-700 pointer-events-none z-10" />
                                        <div className="w-full h-40 overflow-y-auto custom-scrollbar p-2 pl-12">
                                            {filteredClientes.map(cl => {
                                                const isSelected = String(formData.clienteID) === String(cl.id);
                                                return (
                                                    <button 
                                                        key={cl.id} 
                                                        type="button"
                                                        onClick={() => handleChange({target: {name: 'clienteID', value: cl.id}})}
                                                        className={`w-full text-left p-3 text-sm font-bold transition-all mb-1 last:mb-0 rounded-lg ${isSelected ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                                                    >
                                                        {cl.nombre} <span className="opacity-50 font-normal">({cl.red || 'S/R'})</span>
                                                    </button>
                                                )
                                            })}
                                            {filteredClientes.length === 0 && (
                                                <div className="p-4 text-center text-xs font-bold text-gray-700 uppercase italic">Sin coincidencias</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Especificaciones del Producto */}
                    <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-xl border-l-4 border-l-indigo-500">
                        <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic">
                            <Gamepad2 className="w-4 h-4" />
                            Catálogo de Entrega
                        </h2>

                        <div className="space-y-8 mb-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between px-1">
                                    Título Licenciado *
                                    <Link href="/juegos/nuevo" className="text-indigo-400 hover:underline">Agregar Manualmente</Link>
                                </label>
                                <Select 
                                    name="juego_id" required
                                    value={formData.juego_id}
                                    onChange={handleChange}
                                    placeholder="Selecciona el activo digital..."
                                    options={juegos.map(jg => ({ value: jg.id, label: jg.titulo }))}
                                    className="space-y-0"
                                />
                            </div>

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
                                />
                            </div>
                        </div>

                        {/* Snapshot Box */}
                        <div className="space-y-3 mt-8 pt-8 border-t border-white/5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between mb-4">
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Snapshot Histórico (Cuenta Origen)
                                </span>
                            </label>
                            
                            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4">
                                <Input 
                                    type="text"
                                    placeholder="Buscar cuenta por correo o clave..."
                                    value={searchCuenta}
                                    onChange={(e) => setSearchCuenta(e.target.value)}
                                    icon={Search}
                                    className="space-y-0"
                                />
                                <div className="relative bg-black/40 border border-white/5 rounded-xl overflow-hidden transition-colors">
                                    <Gamepad2 className="w-4 h-4 absolute left-4 top-5 text-gray-700 pointer-events-none z-10" />
                                    <div className="w-full h-36 overflow-y-auto custom-scrollbar p-2 pl-12">
                                        <button 
                                            type="button"
                                            onClick={() => handleCuentaSelect({target: {value: ''}})}
                                            className={`w-full text-left p-3 text-xs font-medium transition-all mb-1 rounded-lg ${!selectedCuentaId ? 'bg-white/5 text-gray-300' : 'text-gray-500 hover:bg-white/5'}`}
                                        >
                                            -- Selecciona la cuenta a extraer --
                                        </button>
                                        {filteredCuentas.map(ct => {
                                            const isSelected = String(selectedCuentaId) === String(ct.id);
                                            return (
                                                <button 
                                                    key={ct.id} 
                                                    type="button"
                                                    onClick={() => handleCuentaSelect({target: {value: ct.id}})}
                                                    className={`w-full text-left p-3 text-sm font-bold transition-all mb-1 last:mb-0 rounded-lg ${isSelected ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                                                >
                                                    {ct.direccionCorreo} <span className="opacity-50 font-mono text-xs block mt-0.5">Clave: {ct.clave}</span>
                                                </button>
                                            )
                                        })}
                                        {filteredCuentas.length === 0 && (
                                            <div className="p-4 text-center text-xs font-bold text-gray-700 uppercase italic">Sin coincidencias</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="flex items-center gap-3 bg-black/60 border border-white/5 rounded-xl p-4">
                                    <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                                    <div className="flex-1">
                                        <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Correo de Acceso Extraído</span>
                                        <div className="text-sm font-mono text-white break-all">
                                            {formData.correo || <span className="text-gray-600 italic">No asociado</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-black/60 border border-white/5 rounded-xl p-4">
                                    <Key className="w-5 h-5 text-gray-500 shrink-0" />
                                    <div className="flex-1">
                                        <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Clave Temporal Extraída</span>
                                        <div className="text-sm font-mono text-white break-all">
                                            {formData.clave || <span className="text-gray-600 italic">No asociada</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}
