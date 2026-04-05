import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    User, UserPlus, Phone, Mail, MessageSquare, 
    AtSign, FileText, Save, X, Loader2, 
    AlertCircle, Trash2, ShieldCheck, Share2
} from 'lucide-react';
import axios from 'axios';

export default function ClienteForm({ id = null }) {
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        nombre: '',
        red: 'WhatsApp',
        telefono: '',
        correo: '',
        notas: ''
    });

    useEffect(() => {
        if (isEdit) {
            const fetchCliente = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`http://localhost:3000/clientes/form_cliente/${id}`);
                    setForm({
                        nombre: res.data.nombre || '',
                        red: res.data.red || 'WhatsApp',
                        telefono: res.data.telefono || '',
                        correo: res.data.correo || '',
                        notas: res.data.notas || ''
                    });
                } catch (err) {
                    console.error("Error cargando cliente:", err);
                    setError("No se pudo cargar la información del cliente.");
                } finally {
                    setLoading(false);
                }
            };
            fetchCliente();
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEdit) {
                await axios.patch(`http://localhost:3000/clientes/form_cliente/${id}`, {
                    id: id,
                    ...form
                });
                setSuccess("¡Información del cliente actualizada correctamente!");
            } else {
                await axios.post('http://localhost:3000/clientes/form_cliente/', form);
                setSuccess("¡Cliente registrado exitosamente!");
                setForm({ nombre: '', red: 'WhatsApp', telefono: '', correo: '', notas: '' });
            }
        } catch (err) {
            console.error("Error al guardar cliente:", err);
            setError("Error al procesar la solicitud. Verifica los datos o la conexión.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente? Se borrará su historial local y datos de contacto.")) {
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await axios.delete(`http://localhost:3000/clientes/form_cliente/${id}`);
            router.visit('/clientes');
        } catch (err) {
            console.error("Error al eliminar cliente:", err);
            setError("No se pudo eliminar el cliente. Es posible que tenga facturas asociadas en el sistema.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-medium">Obteniendo ficha del cliente...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEdit ? "Editar Cliente" : "Nuevo Cliente"} />

            {/* Header / Toolbar */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
                        <Link href="/clientes" className="hover:text-white transition-colors">Directorio Clientes</Link>
                        <span>/</span>
                        <span className="text-indigo-400">{isEdit ? "Editar" : "Nuevo"} Perfil</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        {isEdit ? 'Actualizar Ficha Cliente' : 'Añadir Comprador'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all border border-white/5"
                    >
                        <X className="w-4 h-4" />
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? 'Guardar Cambios' : 'Registrar Cliente'}
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Identidad y Contacto */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Status Messages inside the left column for better flow */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 text-emerald-400 animate-in slide-in-from-top-2">
                            <ShieldCheck className="w-6 h-6 text-emerald-500 opacity-50" />
                            <p className="text-sm font-bold">{success}</p>
                        </div>
                    )}

                    {/* Sección: Identidad */}
                    <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-white/2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight uppercase font-mono italic">Identidad del Cliente</h2>
                        </div>
                        <div className="p-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 flex justify-between">
                                    Nombres / Alias / Apellidos *
                                    <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Requerido</span>
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                    <input 
                                        type="text" 
                                        required 
                                        value={form.nombre}
                                        onChange={(e) => setForm({...form, nombre: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 shadow-inner font-medium transition-all"
                                        placeholder="Ej. Carlos Fernández o Username"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Contacto */}
                    <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 bg-white/2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight uppercase font-mono italic">Vías de Comunicación</h2>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">Red Social (Canal Venta) *</label>
                                    <select 
                                        required
                                        value={form.red}
                                        onChange={(e) => setForm({...form, red: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500/50 shadow-inner font-medium transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="X (Twitter)">X (Twitter)</option>
                                        <option value="Telegram">Telegram</option>
                                        <option value="Otro">Otro...</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">Número de Teléfono</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-emerald-400 transition-colors" />
                                        <input 
                                            type="text" 
                                            value={form.telefono}
                                            onChange={(e) => setForm({...form, telefono: e.target.value})}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-emerald-500/50 shadow-inner transition-all"
                                            placeholder="Ej. +58 412 1234567"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-bold text-gray-400 flex justify-between">
                                        Correo Electrónico Personal
                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Opcional</span>
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                                        <input 
                                            type="email" 
                                            value={form.correo}
                                            onChange={(e) => setForm({...form, correo: e.target.value})}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 shadow-inner transition-all text-sm"
                                            placeholder="carlos@correo.com"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-600 font-medium pl-1 leading-relaxed">
                                        Útil si el cliente pierde acceso a su red social o requiere envío formal de comprobantes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Observaciones */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden shadow-2xl h-full border-t-4 border-t-amber-500/50">
                        <div className="p-6 border-b border-white/5 bg-white/2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-amber-500" />
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight uppercase font-mono italic">Observaciones</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    Información visible únicamente por administradores para tener contexto histórico.
                                </p>
                                <textarea 
                                    rows="14" 
                                    value={form.notas}
                                    onChange={(e) => setForm({...form, notas: e.target.value})}
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-amber-500/50 shadow-inner transition-all resize-none leading-relaxed"
                                    placeholder="Notas de fiabilidad, métodos de pago predilectos, comportamientos, etc..."
                                />
                            </div>
                        </div>
                    </div>
                    {/*
                    {isEdit && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h3 className="text-red-400 font-black flex items-center gap-2 mb-1 uppercase text-xs">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Zona de Peligro
                                </h3>
                                <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                    Al eliminar este contacto, se borrarán todos sus datos y referencias comerciales. Esta acción es irreversible.
                                </p>
                            </div>
                            <button 
                                type="button"
                                onClick={handleDelete}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-black transition-all uppercase tracking-widest"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Eliminar Cliente
                            </button>
                        </div>
                    )} 
                    */}
                </div>
            </form>
        </MainLayout>
    );
}
