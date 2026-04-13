import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import {
    Gamepad2, ArrowLeft, Save,
    Trash2, Database, Key,
    DollarSign, Calendar, Loader2, Globe, User,
    Search, Shield, MapPin, X, Mail
} from 'lucide-react';

// Componentes UI
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Card from '@/Components/UI/Card';
import Alert from '@/Components/UI/Alert';
import QuickSelectList from '@/Components/UI/QuickSelectList';

const CuentaJuegosForm = ({ id = null }) => {
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
        const parseDireccion = (rawDir) => {
            let base = { pais: '', ciudad: '', codigoPostal: '', calle: '' };
            try {
                if (typeof rawDir === 'string') {
                    if (rawDir.startsWith('{')) {
                        return { ...base, ...JSON.parse(rawDir) };
                    }
                    return { ...base, calle: rawDir };
                }
                return { ...base, ...rawDir };
            } catch (e) {
                console.warn("Fallo al parsear dirección JSON, usando raw string como calle", e);
                return { ...base, calle: typeof rawDir === 'string' ? rawDir : '' };
            }
        };

        const fetchAccountDetails = async (API_URL) => {
            const resCuenta = await axios.get(`${API_URL}/cuentas/form_cuenta/${id}`);
            const data = resCuenta.data;

            setFormData(prev => ({
                ...prev,
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
                direccion: parseDireccion(data.direccion),
                juegos: (data.juegos || []).map(j => typeof j === 'object' ? j.id : j),
                tieneFacturas: !!data.tiene_facturas
            }));
        };

        const fetchInitialData = async () => {
            try {
                const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                // 1. Fetch available Correos
                const resCorreos = await axios.get(`${API_URL}/correos/correos_por_pagina/1000/num_pagina/1`);
                setCorreos(resCorreos.data.data || []);

                // 2. Fetch available Juegos
                const resJuegos = await axios.get(`${API_URL}/juegos/juegos_por_pagina/1000/num_pagina/1`);
                setAllJuegos(resJuegos.data.data || []);

                if (isEditing) {
                    await fetchAccountDetails(API_URL);
                }
            } catch (err) {
                console.error("Error cargando datos iniciales:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
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
            const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            if (isEditing) {
                await axios.patch(`${API_URL}/cuentas/form_cuenta/${id}`, formData);
                setSuccess("¡Los cambios en la cuenta se han sincronizado correctamente!");
            } else {
                await axios.post(`${API_URL}/cuentas/form_cuenta`, formData);
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
        const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
        try {
            await axios.delete(`${API_URL}/cuentas/form_cuenta/${id}`);
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
                description={isEditing ? "Modificando cuenta existente." : "Registro de nueva cuenta."}
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
                        {isEditing ? 'Guardar Cambios' : 'Registrar Cuenta'}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Correo Matriz Asociado */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="p-6 bg-[#0b0d12]/50 border border-white/5 rounded-2xl shadow-inner space-y-4">
                                    <Input
                                        label="Vículo de Correo Principal"
                                        placeholder="Buscar correo..."
                                        icon={Mail}
                                        value={formData.searchCorreo || ''}
                                        onChange={(e) => setFormData(p => ({ ...p, searchCorreo: e.target.value }))}
                                        variant="dark"
                                        required
                                    />
                                    <QuickSelectList
                                        items={correos.filter(c => c.direccionCorreo?.toLowerCase().includes((formData.searchCorreo || '').toLowerCase()))}
                                        selectedId={formData.correoID}
                                        onSelect={(c) => handleChange({ target: { name: 'correoID', value: c.id } })}
                                        getLabel={(c) => c.direccionCorreo}
                                        getSublabel={(c) => c.nombre || 'Personal'}
                                        height="h-44"
                                        multiSelect={false}
                                        variant="transparent"
                                    />
                                </div>
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
                    <Card className="p-6 flex flex-col min-h-[450px]">

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

                        {/* Contenedor Unificado de Catálogo */}
                        <div className="flex-1 p-6 bg-[#0b0d12]/50 border border-white/5 rounded-2xl shadow-inner space-y-4 overflow-hidden">
                            <Input
                                icon={Search}
                                placeholder="Buscar título en boveda..."
                                value={searchJuego}
                                onChange={(e) => setSearchJuego(e.target.value)}
                                variant="dark"
                                className="space-y-0"
                            />

                            <div className="overflow-hidden">
                                <QuickSelectList
                                    items={filteredJuegos}
                                    multiSelect={true}
                                    selectedIds={formData.juegos}
                                    onSelect={(j) => toggleJuego(j.id)}
                                    getLabel={(j) => j.titulo}
                                    height="h-[340px]"
                                    variant="transparent"
                                />
                            </div>
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
                                <label htmlFor="codigos2FA" className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                                    Historial Códigos
                                </label>
                                <textarea
                                    id="codigos2FA"
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
                        <Card
                            title="Operaciones Críticas"
                            icon={Trash2}
                            variant="danger"
                        >
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Zona de Peligro</h4>
                                    <p className="text-[10px] text-gray-600 font-bold mt-1 uppercase tracking-tight">Acción Irreversible</p>
                                </div>

                                <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                                    {formData.tieneFacturas
                                        ? "Esta cuenta no puede ser eliminada porque existen facturas emitidas que dependen de ella."
                                        : "La eliminación de esta cuenta es permanente y afectará a todas las facturas vinculadas."}
                                </p>

                                <Button
                                    variant={formData.tieneFacturas ? "secondary" : "danger"}
                                    icon={formData.tieneFacturas ? Shield : Trash2}
                                    loading={submitting}
                                    onClick={handleDelete}
                                    className="w-full"
                                    disabled={formData.tieneFacturas}
                                >
                                    {formData.tieneFacturas ? "Acción Bloqueada" : "Eliminar Cuenta"}
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

CuentaJuegosForm.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CuentaJuegosForm;
