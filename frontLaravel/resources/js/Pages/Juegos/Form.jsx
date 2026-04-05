import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save, X, Loader2, Gamepad2, Link as LinkIcon, AlertCircle, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function JuegoForm({ id = null }) 
{
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        nombre: '',
        url: ''
    });

    useEffect(() => {
        if (isEdit) {
            const fetchJuego = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`http://localhost:3000/juegos/form_juego/${id}`);
                    setForm({
                        nombre: res.data.nombre || '',
                        url: res.data.url || ''
                    });
                } catch (err) {
                    console.error("Error cargando juego:", err);
                    setError("No se pudo cargar la información del juego.");
                } finally {
                    setLoading(false);
                }
            };
            fetchJuego();
        }
    }, [id, isEdit]);

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este juego del catálogo? Esta acción no se puede deshacer.")) {
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await axios.delete(`http://localhost:3000/juegos/form_juego/${id}`);
            router.visit('/juegos');
        } catch (err) {
            console.error("Error al eliminar juego:", err);
            setError("No se pudo eliminar el juego. Es posible que tenga registros asociados.");
            setSaving(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEdit) {
                await axios.patch(`http://localhost:3000/juegos/form_juego/${id}`, {
                    id: id,
                    ...form
                });
                setSuccess("¡Juego actualizado correctamente!");
            } else {
                await axios.post('http://localhost:3000/juegos/form_juego/', form);
                setSuccess("¡Juego registrado correctamente!");
                // Clear form after creation
                setForm({ nombre: '', url: '' });
            }
        } catch (err) {
            console.error("Error al guardar juego:", err);
            setError("Error al procesar la solicitud. Verifica la conexión con el servidor.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-medium">Cargando catálogo...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEdit ? "Editar Juego" : "Añadir Juego"} />

            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Link href="/juegos" className="hover:text-white transition-colors">Catálogo Listado</Link>
                        <span>/</span>
                        <span className="text-indigo-400">{isEdit ? "Editar" : "Nuevo"} Título</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {isEdit ? 'Modificar Título Base' : 'Añadir al Catálogo Base'}
                    </h1>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-medium transition-all"
                    >
                        <X className="w-4 h-4" />
                        Descartar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? 'Actualizar Cambios' : 'Registrar Juego'}
                    </button>
                </div>
            </div>

            <div className="max-w-2xl">
                {/* Status Messages */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 mb-6 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3 text-emerald-400 mb-6 animate-in slide-in-from-top-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Save className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-sm font-medium">{success}</p>
                    </div>
                )}

                <div className="bg-[#161821] border border-white/5 rounded-2xl overflow-hidden mb-8">
                    <div className="p-6 border-b border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Información del Título Digital</h2>
                    </div>

                    <div className="p-6">
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                            Todo juego registrado aquí estará disponible en el Checkbox-List al crear nuevas <span className="text-indigo-400 font-medium">CuentasJuegos</span>. Por favor verifica que el título no exista previamente.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex justify-between text-sm font-medium text-gray-300">
                                    Título Exacto del Juego *
                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">
                                        Valor Único
                                    </span>
                                </label>
                                <div className="relative group">
                                    <Gamepad2 className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input 
                                        type="text" 
                                        required
                                        value={form.nombre}
                                        onChange={(e) => setForm({...form, nombre: e.target.value})}
                                        className="w-full bg-[#0b0d12] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="Ej. EA SPORTS FC 24 Standard Edition"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 pl-1">
                                    Escribe el nombre cuidando mayúsculas y signos, ya que se usará para rastreo en búsquedas.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    URL de la Portada (Opcional)
                                </label>
                                <div className="relative group">
                                    <LinkIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input 
                                        type="url"
                                        value={form.url}
                                        onChange={(e) => setForm({...form, url: e.target.value})}
                                        className="w-full bg-[#0b0d12] border border-white/5 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                                        placeholder="https://image.api.playstation.com/..."
                                    />
                                </div>
                                <p className="text-xs text-gray-500 pl-1">
                                    Se utiliza para mostrar una imagen visual en el catálogo y detalles.
                                </p>
                            </div>

                            <div className="pt-4">
                                <div className="bg-[#0b0d12]/50 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                        <LinkIcon className="w-6 h-6 text-gray-500 opacity-50" />
                                    </div>
                                    <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                                        El "Cover Art" (Portada) se generará automáticamente a través de la URL o como degradado genérico en las miniaturas.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {isEdit && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div>
                            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-1">
                                <Trash2 className="w-4 h-4" />
                                Zona de Peligro
                            </h3>
                            <p className="text-xs text-gray-400">
                                Al eliminar este título, se quitará del catálogo base permanentemente.
                            </p>
                        </div>
                        <button 
                            onClick={handleDelete}
                            disabled={saving}
                            className="w-full md:w-auto px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar del Catálogo
                        </button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
