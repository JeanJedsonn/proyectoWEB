import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { 
    User, Phone, Mail, FileText, Save, X, 
    Share2, ArrowLeft
} from 'lucide-react';

// Componentes UI Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import Input from '@/Components/UI/Input';
import Select from '@/Components/UI/Select';
import Alert from '@/Components/UI/Alert';
import PropTypes from 'prop-types';

export default function ClienteForm({ id = null }) {
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

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
                const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                try {
                    const res = await axios.get(`${API_URL}/clientes/form_cliente/${id}`);
                    setForm({
                        nombre: res.data.nombre || '',
                        red: res.data.red || 'WhatsApp',
                        telefono: res.data.telefono || '',
                        correo: res.data.correo || '',
                        notas: res.data.notas || ''
                    });
                } catch (err) {
                    console.error("Error cargando cliente:", err);
                    setErrorMsg("No se pudo localizar la ficha técnica del cliente.");
                } finally {
                    setLoading(false);
                }
            };
            fetchCliente();
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        if (form.red === 'WhatsApp' && !form.telefono) {
            setErrorMsg("Para contactos por WhatsApp, el número de teléfono es obligatorio.");
            setSaving(false);
            return;
        }

        const API_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
        try {
            const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            if (isEdit) {
                await axios.patch(`${API_URL}/clientes/form_cliente/${id}`, {
                    id: id,
                    ...form
                });
                setSuccessMsg("¡Perfil maestro actualizado correctamente!");
            } else {
                await axios.post(`${API_URL}/clientes/form_cliente/`, form);
                setSuccessMsg("¡Nuevo cliente registrado en la base de datos!");
                setForm({ nombre: '', red: 'WhatsApp', telefono: '', correo: '', notas: '' });
            }
        } catch (err) {
            console.error("Error al guardar cliente:", err);
            setErrorMsg(err.response?.data?.mensaje || "Error crítico al procesar el registro.");
        } finally {
            setSaving(false);
        }
    };



    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Accediendo a Bóveda del Cliente...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={isEdit ? "Editar Cliente" : "Nuevo Cliente"} />

            <PageHeader
                title={isEdit ? 'Editar Perfil' : 'Registro de Cliente'}
                description={isEdit ? `Modificando ID #${id}` : 'Añadir nuevo contacto al directorio comercial.'}
                icon={User}
                breadcrumbs={[
                    { label: 'Clientes', href: '/clientes' },
                    { label: isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }
                ]}
            >
                <div className="flex gap-3">
                    <Button variant="secondary" icon={successMsg ? ArrowLeft : X} onClick={() => globalThis.history.back()}>
                        {successMsg ? 'Volver' : 'Descartar'}
                    </Button>
                    <Button 
                        variant="primary" 
                        icon={Save} 
                        loading={saving} 
                        onClick={handleSubmit}
                    >
                        {isEdit ? 'Actualizar Datos' : 'Registrar Cliente'}
                    </Button>
                </div>
            </PageHeader>

            <div className="space-y-6 mb-8">
                {successMsg && (
                    <Alert 
                        variant="success" 
                        title="Operación Exitosa"
                        message={successMsg} 
                        onClose={() => setSuccessMsg(null)} 
                    />
                )}
                {errorMsg && (
                    <Alert 
                        variant="danger" 
                        title="Error de Validación"
                        message={errorMsg} 
                        onClose={() => setErrorMsg(null)} 
                    />
                )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
                {/* Columna Principal */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Sección 1: Identidad */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <User className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest">Datos de Identidad</h2>
                        </div>
                        
                        <Input 
                            label="Nombre Completo o Alias"
                            name="nombre"
                            value={form.nombre}
                            onChange={(e) => setForm({...form, nombre: e.target.value})}
                            placeholder="Ej. Juan Pérez / @jperez_compras"
                            icon={User}
                            required
                            variant="dark"
                        />
                    </Card>

                    {/* Sección 2: Vías de Comunicación */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Share2 className="w-4 h-4 text-emerald-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest">Canales de Comunicación</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select 
                                label="Red Social / Canal"
                                value={form.red}
                                onChange={(e) => setForm({...form, red: e.target.value})}
                                options={[
                                    { value: 'WhatsApp', label: 'WhatsApp' },
                                    { value: 'Instagram', label: 'Instagram' },
                                    { value: 'Facebook', label: 'Facebook' },
                                    { value: 'X (Twitter)', label: 'X (Twitter)' },
                                ]}
                                required
                                variant="dark"
                            />

                            <Input 
                                label="Número de Teléfono"
                                value={form.telefono}
                                onChange={(e) => setForm({...form, telefono: e.target.value})}
                                placeholder="+00 000 0000000"
                                icon={Phone}
                                variant="dark"
                                required={form.red === 'WhatsApp'}
                            />

                            <div className="md:col-span-2">
                                <Input 
                                    label="Correo Electrónico (Opcional)"
                                    type="email"
                                    value={form.correo}
                                    onChange={(e) => setForm({...form, correo: e.target.value})}
                                    placeholder="correo@ejemplo.com"
                                    icon={Mail}
                                    hint="Utilizado para el envío automático de comprobantes."
                                    variant="dark"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Columna Lateral */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 h-fit border-t-4 border-t-amber-500/50">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-4 h-4 text-amber-500" />
                            <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Observaciones</h2>
                        </div>
                        <textarea 
                            rows="10" 
                            value={form.notas}
                            onChange={(e) => setForm({...form, notas: e.target.value})}
                            className="w-full bg-[#0b0d12] border border-white/5 rounded-2xl p-4 text-sm text-gray-300 placeholder-gray-800 focus:outline-none focus:border-amber-500/30 transition-all resize-none font-medium"
                            placeholder="Notas privadas sobre fiabilidad, gustos o incidentes..."
                        />
                    </Card>

                    {/* Espaciado para mantener alineación */}
                    <div className="h-4"></div>
                </div>
            </form>

        </MainLayout>
    );
}

ClienteForm.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
