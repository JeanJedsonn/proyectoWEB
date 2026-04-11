import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Gamepad2, ShieldCheck, Mail, ArrowLeft, Pencil, 
    Trash2, Copy, ExternalLink, Info, MapPin, 
    Smartphone, Database, LayoutGrid, Key, 
    DollarSign, Calendar, Loader2, Globe, User,
    ShieldAlert
} from 'lucide-react';

export default function CuentaJuegosShow({ id }) {
    const [cuenta, setCuenta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCopyMsg, setShowCopyMsg] = useState(false);
    const [copyMsgText, setCopyMsgText] = useState('Copiado al portapapeles');

    useEffect(() => {
        const fetchCuenta = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/cuentas/leer_cuenta/${id}`);
                setCuenta(res.data);
            } catch (err) {
                console.error("Error cargando cuenta de juego:", err);
                setError("No se pudo cargar la información de la cuenta solicitada.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCuenta();
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
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Consultando Manifiesto de Cuenta...</p>
                </div>
            );
        }

        if (error || !cuenta) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-16 text-center shadow-2xl">
                    <ShieldAlert className="w-16 h-16 text-red-500/20 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Registro no localizado</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                        {error || "La cuenta que intentas visualizar ha sido removida o su identificador es incorrecto."}
                    </p>
                    <Link href="/cuentas_juego" className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border border-white/5">
                        <ArrowLeft className="w-4 h-4" />
                        Regresar al Inventario
                    </Link>
                </div>
            );
        }

        const isDeactivated = !!cuenta.fechadesactivacion;

        return (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Header Section */}
                <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                            <Link href="/cuentas_juego" className="hover:text-indigo-400 transition-colors">Cuenta Juegos</Link>
                            <span>/</span>
                            <span className="text-white opacity-40">#{String(cuenta.id).padStart(4, '0')} - {cuenta.nick || 'Sin Nick'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-5">
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">
                                {cuenta.nick || cuenta.Correo?.correoDireccion}
                            </h1>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current shadow-lg ${isDeactivated ? 'bg-red-500/10 text-red-500 shadow-red-500/10' : 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10'}`}>
                                {isDeactivated ? 'Inactiva' : 'Activa'}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <button 
                            onClick={() => handleCopy(`Correo: ${cuenta.Correo?.correoDireccion}\nClave: ${cuenta.clave}\n2FA: ${cuenta.codigos2FA || 'N/A'}`, '¡Credenciales de Acceso Copiadas!')}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-indigo-500/30"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar Acceso
                        </button>
                        <Link 
                            href={`/cuentas_juego/${cuenta.id}/editar`}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border border-white/5 shadow-xl"
                        >
                            <Pencil className="w-4 h-4" />
                            Editar
                        </Link>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border border-red-500/20 group">
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Desclavar
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
                    {/* Left Column: Core Data */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Info Card */}
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-2xl relative overflow-hidden group border-l-4 border-l-indigo-500">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <User className="w-32 h-32" />
                            </div>

                            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-12 flex items-center gap-3 italic">
                                <Info className="w-4 h-4" />
                                Identidad y Estado General
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 relative z-10 font-bold">
                                <div className="space-y-1 bg-white/2 p-4 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Nickname / Perfil</span>
                                    <span className="text-xl text-white block">{cuenta.nick || 'No especificado'}</span>
                                </div>

                                <div className="space-y-1 bg-white/2 p-4 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Clave Maestra</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-mono text-indigo-400">
                                            {cuenta.clave}
                                        </span>
                                        <button onClick={() => handleCopy(cuenta.clave)} className="p-2 hover:bg-indigo-500/20 rounded-xl text-indigo-500 transition-all">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 bg-white/2 p-4 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Fecha de Nacimiento</span>
                                    <span className="text-lg text-white block">{formatDate(cuenta.cumpleaños)}</span>
                                </div>

                                <div className="space-y-1 bg-white/2 p-4 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Balance Contable</span>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-emerald-500" />
                                        <span className="text-2xl text-emerald-400 font-black">{cuenta.saldo || '0.00'} <span className="text-[10px] uppercase text-gray-600 tracking-tighter">USD</span></span>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-1 bg-white/2 p-4 rounded-2xl border border-white/5 border-dashed">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Cronología de Desactivación</span>
                                    <span className={`text-sm ${isDeactivated ? 'text-red-400' : 'text-gray-600 font-normal italic'}`}>
                                        {isDeactivated ? `Programada para: ${formatDate(cuenta.fechadesactivacion)}` : 'Indefinida / En uso activo'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-2xl border-l-4 border-l-emerald-500/50">
                            <h2 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-10 flex items-center gap-3 italic">
                                <ShieldCheck className="w-4 h-4" />
                                Parámetros de Blindaje y Región
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="flex items-center gap-5 p-6 bg-black/30 rounded-3xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Zona Geográfica</span>
                                        <span className="font-bold text-white uppercase tracking-tight">{cuenta.region || 'Desconocida'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 p-6 bg-black/30 rounded-3xl border border-white/5">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 font-black">
                                       <LayoutGrid className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-1">Entorno Activo</span>
                                        <span className="font-bold text-white uppercase tracking-tight">{cuenta.plataforma}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Semilla 2FA (Recovery Seed)</span>
                                        <button onClick={() => handleCopy(cuenta.semilla2FA)} className="text-xs font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-[0.2em] transition-colors">Copiar</button>
                                    </div>
                                    <p className="text-lg font-mono text-white break-all leading-relaxed">{cuenta.semilla2FA || 'Sin semilla configurada'}</p>
                                </div>

                                <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Códigos Estáticos 2FA</span>
                                        <button onClick={() => handleCopy(cuenta.codigos2FA)} className="text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] transition-colors">Copiar</button>
                                    </div>
                                    <p className="text-xl font-mono text-white italic">{cuenta.codigos2FA || '- Sin Backup Codes -'}</p>
                                </div>

                                <div className="bg-white/2 p-6 rounded-3xl border border-white/5">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Metadatos de Registro (Address / JSON)</span>
                                    <div className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-xs text-gray-400 leading-relaxed overflow-x-auto select-all">
                                        {typeof cuenta.Direccion === 'string' ? cuenta.Direccion : JSON.stringify(cuenta.Direccion, null, 2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Games Gallery */}
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-2xl relative overflow-hidden group">
                           <div className="flex justify-between items-center mb-10">
                                <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3 italic">
                                    <Gamepad2 className="w-5 h-5 text-indigo-500" />
                                    Expediente de Títulos Vinculados
                                </h2>
                                <span className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                                    {cuenta.juegos?.length || 0} Juegos
                                </span>
                           </div>

                           <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
                                {cuenta.juegos?.length > 0 ? (
                                    cuenta.juegos.map((juego, idx) => (
                                        <div key={idx} className="min-w-[240px] max-w-[240px] bg-black/40 rounded-3xl border border-white/5 overflow-hidden group/card hover:border-indigo-500/50 transition-all snap-start">
                                            <div className="aspect-[16/9] relative overflow-hidden bg-white/5">
                                                {juego.url ? (
                                                    <img src={juego.url} alt={juego.titulo} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-800">
                                                        <Gamepad2 className="w-12 h-12" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-80" />
                                            </div>
                                            <div className="p-5">
                                                <h4 className="text-sm font-bold text-white line-clamp-1 mb-2 uppercase tracking-tight">{juego.titulo}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Activo en Cta</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full py-20 flex flex-col items-center justify-center text-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl">
                                        <Database className="w-12 h-12 mb-4" />
                                        <span className="text-[10px] uppercase font-black tracking-widest">Sin licencias detectadas</span>
                                    </div>
                                )}
                           </div>
                        </div>
                    </div>

                    {/* Right Column: Associated Email Card */}
                    <div className="lg:col-span-4 sticky top-10">
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-8 shadow-2xl relative border-t-4 border-t-indigo-500 flex flex-col h-full min-h-[600px] group shadow-indigo-500/5">
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Dependencia Crítica</h2>
                            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter italic">Correo Matriz</h3>

                            <div className="space-y-8 flex-1">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Identificador Ref.</span>
                                    <Link href={`/correos/${cuenta.Correo?.id}`} className="text-indigo-400 font-black flex items-center gap-2 hover:text-indigo-300 transition-colors group/ref">
                                        <span className="text-lg">#{String(cuenta.Correo?.id || 0).padStart(3, '0')}</span>
                                        <ExternalLink className="w-4 h-4 group-hover/ref:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Dirección Matriz</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-white break-all text-sm leading-relaxed">{cuenta.Correo?.correoDireccion}</span>
                                        <button onClick={() => handleCopy(cuenta.Correo?.correoDireccion)} className="p-2 hover:bg-white/5 rounded-xl text-gray-600 hover:text-white transition-all shrink-0">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-2">Login Password</span>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-gray-300 text-sm whitespace-nowrap overflow-hidden text-ellipsis">••••••••••••••</span>
                                        <button onClick={() => handleCopy(cuenta.Correo?.correoClave)} className="p-2 hover:bg-white/5 rounded-xl text-indigo-500 transition-all shrink-0">
                                            <Key className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 shadow-inner">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-0.5">Representante</span>
                                            <span className="text-xs font-bold text-white">{cuenta.Correo?.correoNombre || 'No definido'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 shadow-inner">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest block mb-0.5">Recuperación</span>
                                            <span className="text-xs font-bold text-white truncate max-w-[180px] block">{cuenta.Correo?.correoRecuperacion || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href={`/correos/${cuenta.Correo?.id}`}
                                className="w-full mt-10 py-5 bg-white/2 hover:bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all tracking-[0.2em] text-center"
                            >
                                Gestionar Correo Base
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title={`Bóveda: ${cuenta?.nick || 'Cargando...'}`} />
            
            <div className="mb-6">
                <Link 
                    href="/cuentas_juego" 
                    className="inline-flex items-center gap-3 text-[11px] font-black uppercase text-gray-500 hover:text-white tracking-widest transition-all bg-[#161821] px-6 py-4 rounded-2xl border border-white/5 group shadow-2xl"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-indigo-500" />
                    Regresar al Inventario
                </Link>
            </div>

            {renderContent()}

            {/* Notification Toast */}
            {showCopyMsg && (
                <div className="fixed bottom-10 right-10 z-100 animate-in slide-in-from-right-10 fade-in duration-500">
                    <div className="bg-indigo-600 text-white px-8 py-5 rounded-3xl shadow-[0_32px_64px_-12px_rgba(79,70,229,0.3)] font-black flex items-center gap-5 border border-white/10 uppercase text-xs tracking-widest leading-none">
                        <div className="bg-white/20 p-2 rounded-full">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        {copyMsgText}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
