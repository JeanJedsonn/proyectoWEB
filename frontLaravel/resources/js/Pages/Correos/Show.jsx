import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Mail, User, RefreshCcw, ArrowLeft, Pencil, 
    Key, Info, Loader2, ExternalLink,
    ShieldAlert, Database, ShieldCheck
} from 'lucide-react';

// Componentes UI Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';

export default function CorreoShow({ id }) {
    const [correo, setCorreo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCorreo = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/correos/leer_correo/${id}`);
                setCorreo(res.data);
            } catch (err) {
                console.error("Error cargando correo:", err);
                setError("No se pudo cargar la información del correo solicitado.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCorreo();
    }, [id]);



    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Consultando Bóveda de Correos...</p>
                </div>
            );
        }

        if (error || !correo) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-16 text-center shadow-2xl">
                    <ShieldAlert className="w-16 h-16 text-red-500/20 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">No Encontrado</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
                        {error || "El registro que intentas visualizar no existe en la base de datos centralizada."}
                    </p>
                    <Button variant="secondary" icon={ArrowLeft} onClick={() => router.visit('/correos')}>
                        Regresar al Directorio
                    </Button>
                </div>
            );
        }

        const countCuentas = Array.isArray(correo.cuentaJuegos) ? correo.cuentaJuegos.length : (correo.cuentaJuegos?.id ? 1 : 0);

        return (
            <div>
                <PageHeader
                    title={correo.direccionCorreo}
                    description="Detalles técnicos y credenciales de acceso del correo maestro."
                    icon={Mail}
                    breadcrumbs={[
                        { label: 'Correos Base', href: '/correos' },
                        { label: `Identificador #${String(correo.id).padStart(3, '0')}` }
                    ]}
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <Button 
                            variant="secondary" 
                            icon={ArrowLeft} 
                            onClick={() => globalThis.history.back()}
                        >
                            Volver
                        </Button>
                        <Button 
                            variant="primary" 
                            icon={Pencil} 
                            onClick={() => router.visit(`/correos/${id}/editar`)}
                        >
                            Editar
                        </Button>
                    </div>
                </PageHeader>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
                    {/* Columna izquierda: Datos */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Card Credenciales */}
                        <Card 
                            title="Especificaciones del Correo Matriz"
                            icon={Info}
                            className="p-10 relative overflow-hidden group"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16 relative z-10">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Nombres Registrados</span>
                                    <span className="text-base font-bold text-white block">{correo.nombres || 'No disponible'}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Fecha Cumpleaños</span>
                                    <span className="text-base font-bold text-white block">{formatDate(correo.cumpleaños)}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Dirección de Correo</span>
                                    <span className="text-base font-bold text-white block break-all">{correo.direccionCorreo}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Contraseña</span>
                                    <span className="text-base font-mono font-bold text-indigo-400 bg-indigo-500/5 px-2 rounded-lg border border-indigo-500/10 shadow-inner inline-block">
                                        {correo.clave}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Seguridad y Recuperación */}
                        <Card 
                            title="Redirección y Recuperación"
                            icon={ShieldCheck}
                            className="p-10 relative border-l-4 border-l-emerald-500/50"
                        >
                            <div className="space-y-8">
                                <div className="flex items-center gap-6 p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                        <RefreshCcw className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Correo de Recuperación</span>
                                        <span className="text-lg font-bold text-white">{correo.recuperacion || 'Sin método configurado'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                        <ExternalLink className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Redireccionamiento</span>
                                        <span className={`text-lg font-bold ${correo.redireccion ? 'text-white' : 'text-gray-700'}`}>
                                            {correo.redireccion || 'No configurado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Columna derecha: Cuentas Relacionadas */}
                    <div className="lg:col-span-4">
                        <Card 
                            title="Cuentas Relacionadas"
                            icon={Database}
                            className="p-8 h-full border-t-4 border-t-indigo-500"
                        >
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-10 leading-relaxed">
                                Hay <span className="text-indigo-400 font-black">{countCuentas}</span> {countCuentas === 1 ? 'Cuenta Juego' : 'Cuentas Juego'} ligadas a este manifiesto matriz.
                            </p>

                            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {countCuentas === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                        <Database className="w-12 h-12 mb-4" />
                                        <span className="text-[10px] uppercase font-black tracking-widest">Sin dependencias</span>
                                    </div>
                                ) : (
                                    (Array.isArray(correo.cuentaJuegos) ? correo.cuentaJuegos : [correo.cuentaJuegos]).map((cuenta) => (
                                        <button 
                                            key={cuenta.id}
                                            className="w-full text-left bg-white/2 hover:bg-white/5 border border-white/5 rounded-3xl p-5 group cursor-pointer transition-all border-l-2 border-l-indigo-500/30 hover:border-l-indigo-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            onClick={() => router.visit(`/cuentas_juego/${cuenta.id}`)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                                        <Key className="w-5 h-5 text-indigo-400 opacity-50" />
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-black text-white block tracking-tighter uppercase">{cuenta.plataforma}</span>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase">#{cuenta.id}</span>
                                                    </div>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-gray-800 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <div className="text-[11px] font-medium text-gray-400 line-clamp-1">
                                                Juegos detectados: {cuenta.juegos?.length || 0} títulos asociados.
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title={`Bóveda: ${correo?.direccionCorreo || 'Cargando...'}`} />
            
            {renderContent()}
        </MainLayout>
    );
}
