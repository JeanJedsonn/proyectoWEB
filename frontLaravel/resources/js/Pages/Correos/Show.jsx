import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Mail, Lock, User, Calendar, ShieldCheck, 
    RefreshCcw, ArrowLeft, Pencil, Trash2, 
    Key, Info, Loader2, Copy, ExternalLink,
    ShieldAlert, Database
} from 'lucide-react';

export default function CorreoShow({ id }) {
    const [correo, setCorreo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCopyMsg, setShowCopyMsg] = useState(false);
    const [copyMsgText, setCopyMsgText] = useState('Copiado al portapapeles');

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

    const handleCopy = (text, customMsg = 'Copiado al portapapeles') => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyMsgText(customMsg);
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

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
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Acceso Denegado / No Encontrado</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-10 italic">
                        {error || "El registro que intentas visualizar no existe en la base de datos centralizada."}
                    </p>
                    <Link href="/correos" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        Regresar al Directorio
                    </Link>
                </div>
            );
        }

        const countCuentas = Array.isArray(correo.cuentaJuegos) ? correo.cuentaJuegos.length : (correo.cuentaJuegos?.id ? 1 : 0);

        return (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Header Section */}
                <header className="mb-12 flex flex-col lg:row-reverse lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                            <Link href="/correos" className="hover:text-indigo-400 transition-colors">Correos Base</Link>
                            <span>/</span>
                            <span className="text-white opacity-40">Identificador #{String(correo.id).padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-indigo-500 to-indigo-800 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter break-all">
                                {correo.direccionCorreo}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <button 
                            onClick={() => handleCopy(`Correo: ${correo.direccionCorreo}\nClave: ${correo.clave}`, '¡Credenciales Copiadas!')}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-indigo-500/30"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar Acceso
                        </button>
                        <Link 
                            href={`/correos/${correo.id}/editar`}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border border-white/5"
                        >
                            <Pencil className="w-4 h-4" />
                            Editar
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Essential Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Core Data Card */}
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <Database className="w-32 h-32" />
                            </div>

                            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-10 flex items-center gap-3 italic">
                                <Info className="w-4 h-4" />
                                Especificaciones del Correo Matriz
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16 relative z-10">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Nombres Registrados</span>
                                    <span className="text-lg font-bold text-white block">{correo.nombres || 'No especificado'}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Fecha Cumpleaños</span>
                                    <span className="text-lg font-bold text-white block">{formatDate(correo.cumpleaños)}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Dirección / Login Principal</span>
                                    <span className="text-lg font-bold text-white block">{correo.direccionCorreo}</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block">Contraseña Base</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-mono font-bold text-indigo-400 bg-indigo-500/5 px-2 rounded-lg border border-indigo-500/10 shadow-inner">
                                            {correo.clave}
                                        </span>
                                        <button onClick={() => handleCopy(correo.clave)} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-600 hover:text-white transition-all">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-2xl relative border-l-4 border-l-emerald-500/50">
                            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-8 flex items-center gap-3 italic">
                                <ShieldCheck className="w-4 h-4" />
                                Blindaje y Recuperación
                            </h2>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                        <RefreshCcw className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Entidad de Rescate</span>
                                        <span className="text-xl font-bold text-white">{correo.recuperacion || 'Sin método configurado'}</span>
                                    </div>
                                    {correo.recuperacion && (
                                        <button onClick={() => handleCopy(correo.recuperacion)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 transition-all">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 p-6 bg-black/20 rounded-3xl border border-white/5">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                        <ExternalLink className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Redireccionamiento (Forwarding)</span>
                                        <span className={`text-xl font-bold ${correo.redireccion ? 'text-white' : 'text-gray-700 italic'}`}>
                                            {correo.redireccion || 'No configurado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Associated Accounts */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-8 shadow-2xl h-full border-t-4 border-t-indigo-500">
                            <h2 className="text-xl font-black text-white mb-4 tracking-tighter uppercase italic">Cuentas Relacionadas</h2>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-10 leading-relaxed">
                                Hay {countCuentas} {countCuentas === 1 ? 'Cuenta Juego' : 'Cuentas Juego'} ligadas a este manifiesto matriz.
                            </p>

                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {countCuentas === 0 ? (
                                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
                                        <Database className="w-12 h-12 mb-4" />
                                        <span className="text-[10px] uppercase font-black tracking-widest">Sin dependencias</span>
                                    </div>
                                ) : (
                                    /* Normalize and render */
                                    (Array.isArray(correo.cuentaJuegos) ? correo.cuentaJuegos : [correo.cuentaJuegos]).map((cuenta) => (
                                        <div 
                                            key={cuenta.id}
                                            className="bg-white/2 hover:bg-white/5 border border-white/5 rounded-3xl p-5 group cursor-pointer transition-all border-l-2 border-l-indigo-500/30 hover:border-l-indigo-500 shadow-lg"
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
                                            <div className="text-[11px] font-medium text-gray-400 line-clamp-1 italic">
                                                Juegos detectados: {cuenta.juegos?.length || 0} títulos asociados.
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <button className="w-full mt-10 py-4 bg-white/2 hover:bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all tracking-[0.2em]">
                                Vincular Nueva Cuenta Juego
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title={`Bóveda: ${correo?.direccionCorreo || 'Cargando...'}`} />
            
            <div className="mb-6">
                <Link 
                    href="/correos" 
                    className="inline-flex items-center gap-3 text-[11px] font-black uppercase text-gray-500 hover:text-white tracking-widest transition-all bg-[#161821] px-5 py-3 rounded-2xl border border-white/5 group shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Regresar al directorio
                </Link>
            </div>

            {renderContent()}

            {/* Notification Toast */}
            {showCopyMsg && (
                <div className="fixed bottom-10 right-10 z-100 animate-in slide-in-from-right-10 fade-in duration-500">
                    <div className="bg-emerald-600 text-white px-8 py-4 rounded-3xl shadow-[0_32px_64px_-12px_rgba(16,185,129,0.3)] font-black flex items-center gap-4 border border-white/10 uppercase text-xs tracking-widest">
                        <ShieldCheck className="w-5 h-5" />
                        {copyMsgText}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
