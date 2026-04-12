import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Save, X, Loader2, Gamepad2, Link as LinkIcon, AlertCircle, Trash2, Shield } from 'lucide-react';
import axios from 'axios';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';

export default function JuegoForm({ id = null }) 
{
    // Estados
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        nombre: '',
        url: '',
        tiene_cuentas: false
    });

    // Cargar juego si es edición
    useEffect(() => {
        if (isEdit) {
            const fetchJuego = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`http://localhost:3000/juegos/form_juego/${id}`);
                    setForm({
                        nombre: res.data.nombre || '',
                        url: res.data.url || '',
                        tiene_cuentas: res.data.tiene_cuentas || false
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

    // Eliminar juego
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
            setError(err.response?.data?.mensaje || "No se pudo eliminar el juego. Es posible que tenga registros asociados.");
            setSaving(false);
        }
    };

    // Manejo del envío del formulario (crear o editar)
    const handleSubmit = async (e) => {
        
        e.preventDefault(); // Evitar que el formulario se envíe de forma nativa
        setSaving(true);    // Activar el estado de guardado
        setError(null);     // Limpiar errores
        setSuccess(null);   // Limpiar éxito

        if (!form.nombre.trim()) {
            setError("El Título Exacto del Juego es obligatorio y no puede estar vacío.");
            setSaving(false);
            return;
        }

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
                setForm({ nombre: '', url: '' });                   // Limpiar formulario después de la creación

            }

        } catch (err) {
            console.error("Error al guardar juego:", err);
            setError(err.response?.data?.mensaje || "Error al procesar la solicitud. Verifica la conexión con el servidor.");
        } finally {
            setSaving(false);
        }
    };

    // Si está cargando, muestra un loader
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

    // Renderizado del formulario
    return (
        <MainLayout>
            <Head title={isEdit ? "Editar Juego" : "Añadir Juego"} />

            <PageHeader 
                title={isEdit ? 'Modificar Título Base' : 'Añadir al Catálogo Base'}
                breadcrumbs={[
                    { label: 'Catálogo Listado', href: '/juegos' },
                    { label: isEdit ? 'Editar Título' : 'Nuevo Título' }
                ]}
            >
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                        variant="secondary"
                        icon={isEdit ? X : ArrowLeft}
                        onClick={() => window.history.back()}
                    >
                        {isEdit ? 'Descartar' : 'Volver'}
                    </Button>
                    <Button 
                        variant="primary"
                        icon={Save}
                        loading={saving}
                        onClick={handleSubmit}
                    >
                        {isEdit ? 'Actualizar Cambios' : 'Registrar Juego'}
                    </Button>
                </div>
            </PageHeader>

            <div className="max-w-2xl mx-auto">
                {/* Mensajes de estado */}
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="nombre" className="flex justify-between text-sm font-medium text-gray-300">
                                    <span>Título Exacto del Juego *</span>
                                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">
                                        Valor Único
                                    </span>
                                </label>
                                <Input 
                                    id="nombre"
                                    name="nombre"
                                    type="text" 
                                    required
                                    value={form.nombre}
                                    onChange={(e) => setForm({...form, nombre: e.target.value})}
                                    placeholder="Ej. EA SPORTS FC 24 Standard Edition"
                                    icon={Gamepad2}
                                    hint="Escribe el nombre cuidando mayúsculas y signos, ya que se usará para rastreo en búsquedas."
                                    className="m-0! space-y-0 pt-2"
                                    variant="dark"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="url" className="text-sm font-medium text-gray-300">
                                    URL de la Portada (Opcional)
                                </label>
                                <Input 
                                    id="url"
                                    name="url"
                                    type="url"
                                    value={form.url}
                                    onChange={(e) => setForm({...form, url: e.target.value})}
                                    placeholder="https://image.api.playstation.com/..."
                                    icon={LinkIcon}
                                    hint="Se utiliza para mostrar una imagen visual en el catálogo y detalles."
                                    className="m-0! space-y-0 pt-2"
                                    variant="dark"
                                />
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
                    <div className={`border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${form.tiene_cuentas ? 'bg-[#161821] border-white/5' : 'bg-red-500/5 border-red-500/20'}`}>
                        <div>
                            <h3 className={`${form.tiene_cuentas ? 'text-gray-400' : 'text-red-400'} font-bold flex items-center gap-2 mb-1`}>
                                {form.tiene_cuentas ? <Shield className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                Zona de Peligro
                            </h3>
                            <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
                                {form.tiene_cuentas 
                                    ? "La eliminación de este juego no está permitida debido a que existen Cuentas asociadas en la base de datos que dependen de él."
                                    : "Al eliminar este título, se quitará del catálogo base permanentemente."}
                            </p>
                        </div>
                        {!form.tiene_cuentas ? (
                            <Button 
                                variant="danger"
                                icon={Trash2}
                                loading={saving}
                                onClick={handleDelete}
                                className="w-full md:w-auto"
                            >
                                Eliminar del Catálogo
                            </Button>
                        ) : (
                            <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-500 text-sm font-medium flex items-center gap-2 w-full md:w-auto justify-center cursor-not-allowed">
                                <Shield className="w-4 h-4 opacity-50" />
                                Acción Bloqueada
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
