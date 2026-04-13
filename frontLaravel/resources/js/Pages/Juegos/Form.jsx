import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Save, X, Loader2, Gamepad2, Link as LinkIcon, Trash2, Shield, PackageSearch } from 'lucide-react';
import axios from 'axios';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Input from '@/Components/UI/Input';
import Alert from '@/Components/UI/Alert';
import Card from '@/Components/UI/Card';

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
                    const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                    const res = await axios.get(`${API_URL}/juegos/form_juego/${id}`);
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
        if (!globalThis.confirm("¿Estás seguro de que deseas eliminar este juego del catálogo? Esta acción no se puede deshacer.")) {
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            await axios.delete(`${API_URL}/juegos/form_juego/${id}`);
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
            const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            if (isEdit) {
                await axios.patch(`${API_URL}/juegos/form_juego/${id}`, {
                    id: id,
                    ...form
                });
                setSuccess("¡Juego actualizado correctamente!");

            } else {
                await axios.post(`${API_URL}/juegos/form_juego/`, form);
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
                title={isEdit ? 'Modificar Juego' : 'Añadir Juego al Catálogo'}
                breadcrumbs={[
                    { label: 'Catálogo Listado', href: '/juegos' },
                    { label: isEdit ? 'Editar Título' : 'Nuevo Título' }
                ]}
                description={isEdit ? 'Edita la información del juego' : 'Añade un nuevo juego al catálogo'}
                icon={PackageSearch}
            >
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button 
                        variant="secondary"
                        icon={isEdit ? X : ArrowLeft}
                        onClick={() => globalThis.history.back()}
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
                    <Alert 
                        variant="danger" 
                        message={error} 
                        className="mb-8" 
                        onClose={() => setError(null)} 
                    />
                )}
                {success && (
                    <Alert 
                        variant="success" 
                        message={success} 
                        className="mb-8" 
                        onClose={() => setSuccess(null)} 
                    />
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
                            <Input 
                                label="Título Exacto del Juego"
                                id="nombre"
                                name="nombre"
                                type="text" 
                                required
                                value={form.nombre}
                                onChange={(e) => setForm({...form, nombre: e.target.value})}
                                placeholder="Ej. EA SPORTS FC 24 Standard Edition"
                                icon={Gamepad2}
                                hint="Escribe el nombre cuidando mayúsculas y signos, ya que se usará para rastreo en búsquedas."
                                className="m-0! space-y-0"
                                variant="dark"
                            />

                            <Input 
                                label="URL de la Portada (Opcional)"
                                id="url"
                                name="url"
                                type="url"
                                value={form.url}
                                onChange={(e) => setForm({...form, url: e.target.value})}
                                placeholder="https://image.api.playstation.com/..."
                                icon={LinkIcon}
                                hint="Se utiliza para mostrar una imagen visual en el catálogo y detalles."
                                className="m-0! space-y-0"
                                variant="dark"
                            />

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
                                {form.tiene_cuentas 
                                    ? "La eliminación de este juego no está permitida debido a que existen cuentas asociadas en la base de datos que dependen de él."
                                    : "Al eliminar este título, se quitará del catálogo base permanentemente."}
                            </p>

                            <Button 
                                variant={form.tiene_cuentas ? "secondary" : "danger"}
                                icon={form.tiene_cuentas ? Shield : Trash2}
                                loading={saving}
                                onClick={handleDelete}
                                className="w-full"
                                disabled={form.tiene_cuentas}
                            >
                                {form.tiene_cuentas ? "Acción Bloqueada" : "Eliminar del Catálogo"}
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
