import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Gamepad2, Mail, ArrowLeft, Save, 
    Trash2, Database, Key, 
    DollarSign, Calendar, Loader2, Globe, User,
    Search, Check, Shield, MapPin, X
} from 'lucide-react';

// Componentes UI
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Card from '@/Components/UI/Card';
import Alert from '@/Components/UI/Alert';

export default function CuentaJuegosForm({ id = null }) {
    const isEditing = !!id;
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [correos, setCorreos] = useState([]);
    const [allJuegos, setAllJuegos] = useState([]);
    const [searchJuego, setSearchJuego] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [formData, setFormData] = useState({
        correoID: '',
        correoDireccion: '',
        clave: '',
        cumpleaños: '',
        fechadesactivacion: '',
        saldo: '',
        nick: '',
        plataforma: 'PlayStation',
        region: 'US',
        semilla: '',
        codigos2FA: '',
        direccion: {
            pais: '',
            ciudad: '',
            codigoPostal: '',
            calle: ''
        },
        juegos: [], // IDs
        tieneFacturas: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch available Correos
                const resCorreos = await axios.get('http://localhost:3000/correos/correos_por_pagina/1000/num_pagina/1');
                setCorreos(resCorreos.data.data || []);

                // 2. Fetch available Juegos
                const resJuegos = await axios.get('http://localhost:3000/juegos/juegos_por_pagina/1000/num_pagina/1');
                setAllJuegos(resJuegos.data.data || []);

                // 3. If editing, fetch account details
                if (isEditing) {
                    const resCuenta = await axios.get(`http://localhost:3000/cuentas/form_cuenta/${id}`);
                    const data = resCuenta.data;
                    
                    let parsedDir = { pais: '', ciudad: '', codigoPostal: '', calle: '' };
                    if (data.direccion) {
                        try {
                            if (typeof data.direccion === 'string') {
                                if (data.direccion.startsWith('{')) {
                                    parsedDir = { ...parsedDir, ...JSON.parse(data.direccion) };
                                } else {
                                    parsedDir.calle = data.direccion;
                                }
                            } else if (typeof data.direccion === 'object') {
                                parsedDir = { ...parsedDir, ...data.direccion };
                            }
                        } catch (e) {
                            parsedDir.calle = data.direccion;
                        }
                    }

                    setFormData({
                        correoID: data.correoID || '',
                        correoDireccion: data.correoDireccion || '',
                        clave: data.clave || '',
                        cumpleaños: data.cumpleaños ? data.cumpleaños.split('T')[0] : '',
                        fechadesactivacion: data.fechadesactivacion ? data.fechadesactivacion.split('T')[0] : '',
                        saldo: data.saldo || '',
                        nick: data.nick || '',
                        plataforma: data.plataforma || 'PlayStation',
                        region: data.region || 'US',
                        semilla: data.semilla || '',
                        codigos2FA: data.codigos2FA || '',
                        direccion: parsedDir,
                        juegos: data.juegos || [],
                        tieneFacturas: !!data.tiene_facturas
                    });
                }
            } catch (err) {
                console.error("Error cargando datos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'correoID') {
            const selectedCorreo = correos.find(c => String(c.id) === String(value));
            setFormData(prev => ({ 
                ...prev, 
                correoID: value,
                correoDireccion: selectedCorreo ? selectedCorreo.direccionCorreo : prev.correoDireccion
            }));
        } else if (name.startsWith('dir_')) {
            const field = name.replace('dir_', '');
            setFormData(prev => ({
                ...prev,
                direccion: { ...prev.direccion, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleJuego = (juegoId) => {
        setFormData(prev => {
            const juegos = prev.juegos.includes(juegoId)
                ? prev.juegos.filter(id => id !== juegoId)
                : [...prev.juegos, juegoId];
            return { ...prev, juegos };
        });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEditing) {
                await axios.patch(`http://localhost:3000/cuentas/form_cuenta/${id}`, formData);
                setSuccess("¡Los cambios en la cuenta se han sincronizado correctamente!");
            } else {
                await axios.post(`http://localhost:3000/cuentas/form_cuenta`, formData);
                setSuccess("¡La nueva cuenta ha sido registrada con éxito en la bóveda!");
                // Limpiar si es nuevo
                setFormData({
                    correoID: '', clave: '', cumpleaños: '', fechadesactivacion: '',
                    saldo: '', nick: '', plataforma: 'PlayStation', region: 'US',
                    semilla: '', codigos2FA: '', juegos: [], tieneFacturas: false,
                    direccion: { pais: '', ciudad: '', codigoPostal: '', calle: '' }
                });
            }
        } catch (err) {
            console.error("Error guardando cuenta:", err);
            setError(err.response?.data?.error || "Hubo un fallo en la sincronización. Verifica los datos e intenta nuevamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!globalThis.confirm("¿Estás seguro de que deseas eliminar esta cuenta?")) return;
        setSubmitting(true);
        try {
            await axios.delete(`http://localhost:3000/cuentas/form_cuenta/${id}`);
            router.visit('/cuentas_juego');
        } catch (err) {
            console.error("Error eliminando cuenta:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] italic">Sincronizando Archivos Maestro...</p>
                </div>
            </MainLayout>
        );
    }

    const filteredJuegos = allJuegos.filter(j => 
        j.titulo.toLowerCase().includes(searchJuego.toLowerCase())
    );

    return (
        <MainLayout>
            <Head title={isEditing ? 'Editar Cuenta' : 'Nueva Cuenta'} />
            
            <PageHeader
                title={isEditing ? 'Configurar Cuenta' : 'Nueva Cuenta'}
                description={isEditing ? "Modificando parámetros de credenciales existentes." : "Registro de nueva matriz en la bóveda de inventario."}
                icon={Gamepad2}
                breadcrumbs={[
                    { label: 'Inventario', href: '/cuentas_juego' },
                    { label: isEditing ? `Edición #${id}` : 'Registro' }
                ]}
            >
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                        variant="secondary"
                        icon={(isEditing && !success) ? X : ArrowLeft}
                        onClick={() => globalThis.history.back()}
                    >
                        {(isEditing && !success) ? 'Descartar' : 'Volver'}
                    </Button>
                    <Button 
                        variant="primary"
                        icon={Save}
                        loading={submitting}
                        onClick={handleSubmit}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Registrar Matriz'}
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 overflow-visible">
                {/* Feedback Messages */}
                {(error || success) && (
                    <div className="lg:col-span-12 animate-in slide-in-from-top-4 duration-300">
                        {error && (
                            <Alert 
                                variant="danger" 
                                message={error} 
                                onClose={() => setError(null)} 
                            />
                        )}
                        {success && (
                            <Alert 
                                variant="success" 
                                message={success} 
                                onClose={() => setSuccess(null)} 
                            />
                        )}
                    </div>
                )}

                {/* Panel Izquierdo: Datos Principales */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Credenciales*/}
                    <Card variant="premium" className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Database className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Credenciales</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
                            
                            {/* Correo Matriz Asociado */}
                            <div className="md:col-span-2">
                                <Select 
                                    label="Correo Electronico"
                                    name="correoID"
                                    value={formData.correoID}
                                    onChange={handleChange}
                                    required
                                    options={correos.map(c => ({ value: c.id, label: c.direccionCorreo }))}
                                    placeholder="Selecciona un correo..."
                                    variant="dark"
                                />
                            </div>

                            {/* Nickname */}
                            <Input 
                                label="Nickname (ID Público)"
                                icon={User}
                                name="nick"
                                value={formData.nick}
                                onChange={handleChange}
                                placeholder="Ej: PlayerOne_X"
                                required
                                variant="dark"
                            />

                            {/* Contraseña */}
                            <Input 
                                label="Contraseña"
                                icon={Key}
                                name="clave"
                                value={formData.clave}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                variant="dark"
                            />
                        </div>
                    </Card>

                    {/* Parametros adicionales */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Parámetros Adicionales</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-visible">
                            {/* Fecha de nacimiento */}
                            <Input 
                                label="Cumpleaños"
                                type="date"
                                icon={Calendar}
                                name="cumpleaños"
                                value={formData.cumpleaños}
                                onChange={handleChange}
                                required
                                variant="dark"
                            />

                            {/* Fecha de desactivación */}
                            <Input 
                                label="Desactivación"
                                type="date"
                                icon={Shield}
                                name="fechadesactivacion"
                                value={formData.fechadesactivacion}
                                onChange={handleChange}
                                variant="dark"
                            />

                            {/* Saldo */}
                            <Input 
                                label="Saldo"
                                icon={DollarSign}
                                name="saldo"
                                value={formData.saldo}
                                onChange={handleChange}
                                placeholder="0.00"
                                variant="dark"
                            />

                            {/* Plataforma */}
                            <Select 
                                label="Plataforma"
                                name="plataforma"
                                value={formData.plataforma}
                                onChange={handleChange}
                                variant="dark"
                                options={[
                                    { value: 'PlayStation', label: 'PlayStation' },
                                    { value: 'Xbox', label: 'Xbox Live' },
                                    { value: 'Steam', label: 'Steam PC' },
                                    { value: 'Nintendo', label: 'Nintendo' }
                                ]}
                                required
                            />

                            {/* Region */}
                            <Input 
                                label="Región"
                                icon={Globe}
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="US, ES, TR..."
                                variant="dark"
                                required
                            />
                        </div>
                    </Card>

                    {/* Direccion de facturacion */}
                    <Card className="p-8">
                        {/* Titulo */}
                        <div className="flex items-center gap-3 mb-8">
                            <MapPin className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Direccion</h2>
                        </div>

                        {/* Inputs de direccion de facturacion */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="País" name="dir_pais" value={formData.direccion.pais} onChange={handleChange} variant="dark" />
                            <Input label="Ciudad" name="dir_ciudad" value={formData.direccion.ciudad} onChange={handleChange} variant="dark" />
                            <Input label="Calle/Avenida" name="dir_calle" value={formData.direccion.calle} onChange={handleChange} variant="dark" />
                            <Input label="Código Postal" name="dir_codigoPostal" value={formData.direccion.codigoPostal} onChange={handleChange} variant="dark" />
                        </div>
                    </Card>
                </div>

                {/* Panel Derecho: Juegos y Seguridad */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-6 flex flex-col h-[500px]">
                        
                        <div className="flex items-center justify-between mb-6">
                            {/* Icono y titulo */}
                            <div className="flex items-center gap-2">
                                <Gamepad2 className="w-4 h-4 text-indigo-400" />
                                <h2 className="text-[10px] font-black text-white uppercase tracking-widest italic">Títulos</h2>
                            </div>
                            
                            {/* Contador de juegos */}
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-500/10">
                                {formData.juegos.length}
                            </span>
                        </div>

                        {/* Input de busqueda de juegos */}
                        <Input 
                            icon={Search}
                            placeholder="Buscar juego..."
                            value={searchJuego}
                            onChange={(e) => setSearchJuego(e.target.value)}
                            className="mb-4"
                            variant="dark"
                        />

                        {/* Lista de juegos */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {filteredJuegos.map(juego => {
                                const isSelected = formData.juegos.includes(juego.id);
                                
                                // Boton de juego (con icono y texto)
                                return (
                                    // Estilos del boton de juego
                                    <button
                                        key={juego.id}
                                        type="button"
                                        onClick={() => toggleJuego(juego.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                                            isSelected 
                                            ? 'bg-indigo-500/10 border-indigo-500/30 text-white' 
                                            : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-200'
                                        }`}
                                    >
                                        {/* Icono y titulo del juego */}
                                        <span className="text-xs font-bold truncate max-w-[200px]">{juego.titulo}</span>
                                        {isSelected && <Check className="w-3 h-3 text-indigo-400 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Panel de seguridad 2FA */}
                    <Card className="p-6">

                        {/* Icono y titulo */}
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-[10px] font-black text-white uppercase tracking-widest italic">Seguridad 2FA</h2>
                        </div>

                        {/* Inputs de seguridad 2FA */}
                        <div className="space-y-4">

                            {/* Semilla (Codigo Base) */}
                            <Input 
                                label="Semilla (Código Base)"
                                icon={Key}
                                name="semilla"
                                value={formData.semilla}
                                onChange={handleChange}
                                placeholder="ABCD 1234 EFGH..."
                                variant="dark"
                            />

                            {/* Historial de codigos */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                    Historial Códigos
                                </label>
                                <textarea 
                                    name="codigos2FA"
                                    value={formData.codigos2FA}
                                    onChange={handleChange}
                                    className="w-full h-24 bg-[#0b0d12] border border-white/5 rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500/50 resize-none custom-scrollbar"
                                    placeholder="Pega aquí los códigos de respaldo..."
                                ></textarea>
                            </div>
                        </div>
                    </Card>

                    {/* Boton de eliminar cuenta */}
                    {isEditing && (
                        <Card variant="danger" className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Trash2 className="w-4 h-4 text-red-400" />
                                <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest italic">Zona de Peligro</h3>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 mb-6 leading-relaxed">
                                {formData.tieneFacturas 
                                    ? "Esta cuenta no puede ser eliminada porque existen facturas emitidas que dependen de ella."
                                    : "La eliminación de esta cuenta es permanente y afectará a todas las facturas vinculadas."}
                            </p>
                            <Button 
                                variant={formData.tieneFacturas ? "secondary" : "danger"}
                                className="w-full"
                                icon={formData.tieneFacturas ? Shield : Trash2}
                                onClick={handleDelete}
                                loading={submitting}
                                disabled={formData.tieneFacturas}
                            >
                                {formData.tieneFacturas ? "Acción Bloqueada" : "Eliminar Cuenta"}
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
