import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Mail, Lock, ShieldAlert, 
    RefreshCcw, Info, Save, X, Loader2, 
    AlertCircle, Trash2, KeyRound, UserCircle
} from 'lucide-react';
import axios from 'axios';

export default function CorreoForm({ id = null }) {
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        direccion: '',
        clave: '',
        nombres: '',
        cumpleanos: '',
        recuperacion: '',
        redireccion: ''
    });

    useEffect(() => {
        if (isEdit) {
            const fetchCorreo = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`http://localhost:3000/correos/form_correo/${id}`);
                    const data = res.data;
                    // Format birthday for input type="date" (YYYY-MM-DD)
                    if (data.cumpleanos) {
                        data.cumpleanos = data.cumpleanos.split('T')[0];
                    }
                    setForm({
                        direccion: data.direccion || '',
                        clave: data.clave || '',
                        nombres: data.nombres || '',
                        cumpleanos: data.cumpleanos || '',
                        recuperacion: data.recuperacion || '',
                        redireccion: data.redireccion || ''
                    });
                } catch (err) {
                    console.error("Error cargando correo:", err);
                    setError("No se pudo cargar la información del correo base.");
                } finally {
                    setLoading(false);
                }
            };
            fetchCorreo();
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEdit) {
                await axios.patch(`http://localhost:3000/correos/form_correo/${id}`, {
                    id: id,
                    ...form
                });
                setSuccess("¡Credenciales del correo actualizadas correctamente!");
            } else {
                await axios.post('http://localhost:3000/correos/form_correo/', form);
                setSuccess("¡Nuevo correo base registrado exitosamente!");
                setForm({ direccion: '', clave: '', nombres: '', cumpleanos: '', recuperacion: '', redireccion: '' });
            }
        } catch (err) {
            console.error("Error al guardar correo:", err);
            setError("Error al procesar la solicitud. Es posible que la dirección ya exista.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!globalThis.confirm("¿Estás seguro de que deseas eliminar este correo? Se perderán las credenciales base.")) {
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await axios.delete(`http://localhost:3000/correos/form_correo/${id}`);
            router.visit('/correos');
        } catch (err) {
            console.error("Error al eliminar correo:", err);
            setError("No se pudo eliminar el correo. Es posible que tenga cuentas vinculadas.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-medium tracking-tight">Accediendo a la bóveda de correos...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEdit ? "Editar Correo Base" : "Añadir Correo Base"} />

            {/* Header / Bar Tool */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
                        <Link href="/correos" className="hover:text-white transition-colors">Correos Base</Link>
                        <span>/</span>
                        <span className="text-indigo-400">{isEdit ? "Modificar" : "Nuevo"} Manifiesto</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight leading-none bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        {isEdit ? 'Editar Entidad Correo' : 'Registrar Nuevo Correo'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => globalThis.history.back()}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/5"
                    >
                        <X className="w-4 h-4" />
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? 'Actualizar Ficha' : 'Guardar en BD'}
                    </button>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Form Sections */}
                <div className="lg:col-span-8 space-y-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex items-center gap-4 text-red-400 animate-in fade-in slide-in-from-top-4 duration-300">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <p className="text-sm font-bold tracking-tight">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex items-center gap-4 text-emerald-400 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Save className="w-4 h-4" />
                            </div>
                            <p className="text-sm font-bold tracking-tight">{success}</p>
                        </div>
                    )}

                    {/* Sección: Credenciales */}
                    <div className="bg-[#161821] border border-white/5 rounded-4xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center gap-4 text-indigo-400 uppercase tracking-[0.2em] font-black text-[10px]">
                            <KeyRound className="w-4 h-4" />
                            <span>Credenciales Principales (Únicas)</span>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label htmlFor="direccion" className="text-xs font-bold text-gray-400 flex justify-between uppercase tracking-widest">
                                    Dirección de Correo *
                                    {isEdit && <span className="text-[10px] text-amber-500 opacity-50 italic">Solo lectura sugerida</span>}
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-indigo-400 transition-colors" />
                                    <input 
                                        id="direccion"
                                        type="email" 
                                        required 
                                        value={form.direccion}
                                        onChange={(e) => setForm({...form, direccion: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-6 py-5 text-white placeholder-gray-800 focus:outline-none focus:border-indigo-500/50 shadow-inner font-bold transition-all"
                                        placeholder="ej. plataforma.ventas@psn.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="clave" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contraseña de Acceso *</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-indigo-400 transition-colors" />
                                    <input 
                                        id="clave"
                                        type="text" 
                                        required
                                        value={form.clave}
                                        onChange={(e) => setForm({...form, clave: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-6 py-5 text-white placeholder-gray-800 focus:outline-none focus:border-indigo-500/50 shadow-inner font-bold transition-all"
                                        placeholder="Clave actual del servicio"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Datos de Recuperación */}
                    <div className="bg-[#161821] border border-white/5 rounded-4xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 bg-white/2 flex items-center gap-4 text-emerald-400 uppercase tracking-[0.2em] font-black text-[10px]">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Datos de Registro y Recuperación</span>
                        </div>
                        <div className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label htmlFor="nombres" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombres/Alias en Registro</label>
                                    <div className="relative group">
                                        <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-emerald-400 transition-colors" />
                                        <input 
                                            id="nombres"
                                            type="text" 
                                            value={form.nombres}
                                            onChange={(e) => setForm({...form, nombres: e.target.value})}
                                            className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-6 py-5 text-white placeholder-gray-800 focus:outline-none focus:border-emerald-500/50 shadow-inner font-bold transition-all"
                                            placeholder="Nombre usado al crear cta"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="cumpleanos" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha Cumpleaños</label>
                                    <div className="relative">
                                        <input 
                                            id="cumpleanos"
                                            type="date" 
                                            value={form.cumpleanos}
                                            onChange={(e) => setForm({...form, cumpleanos: e.target.value})}
                                            className="w-full bg-black/40 border border-white/5 rounded-3xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500/50 shadow-inner font-bold transition-all cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="recuperacion" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Método Recuperación</label>
                                    <div className="relative group">
                                        <RefreshCcw className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-emerald-400 transition-colors" />
                                        <input 
                                            id="recuperacion"
                                            type="text" 
                                            value={form.recuperacion}
                                            onChange={(e) => setForm({...form, recuperacion: e.target.value})}
                                            className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-6 py-5 text-white placeholder-gray-800 focus:outline-none focus:border-emerald-500/50 shadow-inner font-bold transition-all"
                                            placeholder="Tlf o Correo alternativo"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="redireccion" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Redirección / Forwarding</label>
                                    <input 
                                        id="redireccion"
                                        type="text" 
                                        value={form.redireccion}
                                        onChange={(e) => setForm({...form, redireccion: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 rounded-3xl px-6 py-5 text-white placeholder-gray-800 focus:outline-none focus:border-emerald-500/50 shadow-inner font-bold transition-all"
                                        placeholder="Correo de reenvío masivo"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Context/Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-[#161821] border border-white/5 rounded-4xl p-8 shadow-2xl relative border-t-8 border-t-indigo-500/30 overflow-hidden">
                        <div className="absolute -top-10 -right-10 opacity-5">
                            <Info className="w-40 h-40 text-white" />
                        </div>
                        <h3 className="text-lg font-black text-white flex items-center gap-3 mb-6 relative z-10 tracking-tight italic uppercase">
                            <Info className="w-5 h-5 text-indigo-400" />
                            Sobre la Entidad Correo
                        </h3>
                        <div className="space-y-6 relative z-10">
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                Esta tabla funge como la base referencial de todas las cuentas digitales y posibles envíos de facturas históricas.
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium bg-black/20 p-4 rounded-2xl border border-white/5 italic">
                                Borrar un correo con dependencias afectará a las "CuentasJuego". Los datos en facturas históricas se mantienen como copias estáticas.
                            </p>
                        </div>
                    </div>

                    {isEdit && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-4xl p-8 space-y-6 animate-in slide-in-from-right-10 duration-500">
                           <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-red-400 uppercase tracking-widest">Zona de Peligro</h4>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase mt-1 tracking-tighter">Acción Crítica e Irreversible</p>
                                </div>
                           </div>
                            <button 
                                type="button"
                                onClick={handleDelete}
                                disabled={saving}
                                className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] transition-all"
                            >
                                Eliminar Correo Base
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </MainLayout>
    );
}
