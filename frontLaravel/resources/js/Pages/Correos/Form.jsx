import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Mail, Lock, ShieldAlert, RefreshCcw, Info, Save, 
    ArrowLeft, Loader2, Trash2, KeyRound, UserCircle, Shield
} from 'lucide-react';
import axios from 'axios';

// Componentes UI Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import Alert from '@/Components/UI/Alert';
import Input from '@/Components/UI/Input';

const CorreoForm = ({ id = null }) => {
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
        redireccion: '',
        tiene_cuentas: false
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
                        redireccion: data.redireccion || '',
                        tiene_cuentas: !!data.tiene_cuentas
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
            setError(err.response?.data?.mensaje || "Error al procesar la solicitud. Es posible que la dirección ya exista.");
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
            setError(err.response?.data?.mensaje || "No se pudo eliminar el correo. Es posible que tenga cuentas vinculadas.");
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Accediendo a la Bóveda...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEdit ? "Editar Correo" : "Añadir Correo"} />

            <PageHeader
                title={isEdit ? 'Modificar Correo' : 'Añadir Correo'}
                description={isEdit ? 'Actualización de credenciales y datos de recuperación.' : 'Registro de un nuevo correo para el sistema.'}
                icon={Mail}
                breadcrumbs={[
                    { label: 'Correos', href: '/correos' },
                    { label: isEdit ? 'Modificar' : 'Nuevo' }
                ]}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Button 
                        variant="secondary" 
                        icon={ArrowLeft} 
                        onClick={() => globalThis.history.back()}
                    >
                        {isEdit && success ? 'Volver' : 'Descartar'}
                    </Button>
                    <Button 
                        variant="primary" 
                        icon={Save} 
                        onClick={handleSubmit}
                        loading={saving}
                    >
                        {isEdit ? 'Guardar Cambios' : 'Registrar Correo'}
                    </Button>
                </div>
            </PageHeader>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                <div className="lg:col-span-8 space-y-8">
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

                    <Card 
                        title="Credenciales de Acceso"
                        icon={KeyRound}
                    >
                        <div className="grid grid-cols-1 gap-8">
                            <Input 
                                label="Dirección de Correo"
                                id="direccion"
                                type="email" 
                                required 
                                value={form.direccion}
                                onChange={(e) => setForm({...form, direccion: e.target.value})}
                                placeholder="ej. usuario@plataforma.com"
                                icon={Mail}
                                variant="dark"
                            />
                            <Input 
                                label="Contraseña Base"
                                id="clave"
                                type="text" 
                                required
                                value={form.clave}
                                onChange={(e) => setForm({...form, clave: e.target.value})}
                                placeholder="Clave de acceso"
                                icon={Lock}
                                variant="dark"
                            />
                        </div>
                    </Card>

                    <Card 
                        title="Configuración y Recuperacion"
                        icon={ShieldAlert}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input 
                                label="Nombres"
                                id="nombres"
                                type="text" 
                                value={form.nombres}
                                onChange={(e) => setForm({...form, nombres: e.target.value})}
                                placeholder="Nombres usados"
                                icon={UserCircle}
                                variant="dark"
                                required
                            />
                            <Input 
                                label="Fecha de Nacimiento"
                                id="cumpleanos"
                                type="date" 
                                value={form.cumpleanos}
                                onChange={(e) => setForm({...form, cumpleanos: e.target.value})}
                                variant="dark"
                                required
                            />
                            <Input 
                                label="Correo de Recuperación"
                                id="recuperacion"
                                type="text" 
                                value={form.recuperacion}
                                onChange={(e) => setForm({...form, recuperacion: e.target.value})}
                                placeholder="Backup email/tlf"
                                icon={RefreshCcw}
                                variant="dark"
                                required
                            />
                            <Input 
                                label="Redirección"
                                id="redireccion"
                                type="text" 
                                value={form.redireccion}
                                onChange={(e) => setForm({...form, redireccion: e.target.value})}
                                placeholder="Correo de reenvío"
                                icon={Info}
                                variant="dark"
                                required
                            />
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <Card 
                        title="Información"
                        icon={Info}
                    >
                        <div className="space-y-6">
                            <p className="text-xs text-gray-500 leading-relaxed font-bold">
                                Esta tabla funge como la base referencial de todas las cuentas digitales y posibles envíos de facturas.
                            </p>
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-amber-500/80 leading-relaxed font-black uppercase tracking-widest">
                                    Advertencia:
                                </p>
                                <p className="text-[10px] text-gray-600 font-bold mt-2">
                                    Borrar un correo con dependencias afectará a las cuentas vinculadas. Los datos en facturas históricas se mantienen.
                                </p>
                            </div>
                        </div>
                    </Card>

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
                                        ? "No es posible eliminar este correo porque tiene cuentas de juego vinculadas en la base de datos."
                                        : "La eliminación de este correo es permanente. Una vez borrado, no podrá recuperarse la información de acceso."}
                                </p>

                                <Button 
                                    variant={form.tiene_cuentas ? "secondary" : "danger"}
                                    icon={form.tiene_cuentas ? Shield : Trash2}
                                    className="w-full"
                                    onClick={handleDelete}
                                    loading={saving}
                                    disabled={form.tiene_cuentas}
                                >
                                    {form.tiene_cuentas ? "Acción Bloqueada" : "Eliminar Registro"}
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </form>
        </MainLayout>
    );
};

CorreoForm.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CorreoForm;
