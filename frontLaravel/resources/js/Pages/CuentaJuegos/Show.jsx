import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Gamepad2, Mail, ArrowLeft, Pencil, 
    Copy, ExternalLink, MapPin, 
    Smartphone, Database, LayoutGrid, Key, 
    DollarSign, Calendar, Loader2, Globe, User,
    ShieldAlert, Shield, Check
} from 'lucide-react';

// Componentes UI
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';

export default function CuentaJuegosShow({ id }) {
    const [cuenta, setCuenta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedAlert, setCopiedAlert] = useState(false);

    useEffect(() => {
        const fetchCuenta = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/cuentas/leer_cuenta/${id}`);
                setCuenta(res.data);
            } catch (err) {
                console.error("Error cargando cuenta de juego:", err);
                setError("No se pudo localizar el registro maestro de la cuenta.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCuenta();
    }, [id]);

    const handleCopy = (text) => {
        if (!text) return;
        
        const triggerSuccess = () => {
            setCopiedAlert(true);
            setTimeout(() => setCopiedAlert(false), 1500);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(triggerSuccess)
                .catch(() => fallbackCopy(text, triggerSuccess));
        } else {
            fallbackCopy(text, triggerSuccess);
        }
    };

    const fallbackCopy = (text, callback) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            if (callback) callback();
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] italic">Accediendo a Bóveda de Datos...</p>
                </div>
            </MainLayout>
        );
    }

    if (error || !cuenta) {
        return (
            <MainLayout>
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-16 text-center shadow-2xl">
                    <ShieldAlert className="w-16 h-16 text-red-500/20 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Error de Localización</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                        {error || "El identificador de la cuenta no coincide con ningún registro activo en el sistema."}
                    </p>
                    <Button variant="secondary" icon={ArrowLeft} onClick={() => router.visit('/cuentas_juego')}>
                        Regresar al Inventario
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const isDeactivated = !!cuenta.fechaDesactivacion;

    return (
        <MainLayout>
            <Head title={`Cuenta: ${cuenta.nick || id}`} />
            
            <PageHeader
                title={cuenta.nick || 'Detalle de Cuenta'}
                description={cuenta.Correo?.correoDireccion}
                icon={Gamepad2}
                breadcrumbs={[
                    { label: 'Inventario', href: '/cuentas_juego' },
                    { label: `Cuenta #${id}` }
                ]}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={isDeactivated ? 'danger' : 'success'}>
                        {isDeactivated ? 'Inactiva / Bloqueada' : 'Cuenta Operativa'}
                    </Badge>
                    <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
                    <Button variant="secondary" icon={ArrowLeft} onClick={() => globalThis.history.back()}>
                        Volver
                    </Button>
                    <Link href={`/cuentas_juego/${id}/editar`}>
                        <Button variant="primary" icon={Pencil}>
                            Editar Cuenta
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 overflow-visible">
                {/* Panel Izquierdo: Datos Técnicos */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Seccion 1: Credenciales Principales */}
                    <Card variant="premium" className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Database className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Credenciales</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Nickname / ID Público</p>
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-lg font-black text-white italic">{cuenta.nick || 'Sin Nickname'}</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group/copy cursor-pointer transition-all hover:border-indigo-500/30" onClick={() => handleCopy(cuenta.Correo?.correoDireccion)}>
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 flex justify-between">
                                        Correo Electronico
                                        <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity text-indigo-400" />
                                    </p>
                                    <p className="text-sm font-bold text-white truncate">{cuenta.Correo?.correoDireccion}</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-right md:text-left">
                                <div>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Plataforma de Red</p>
                                    <Badge variant="indigo" className="text-base py-1 px-4">{cuenta.plataforma}</Badge>
                                </div>
                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group/copy cursor-pointer transition-all hover:border-indigo-500/30" onClick={() => handleCopy(cuenta.clave)}>
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 flex justify-between">
                                        Contraseña
                                        <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity text-indigo-400" />
                                    </p>
                                    <p className="text-sm font-mono font-bold text-white tracking-widest">{cuenta.clave}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Seccion 2: Datos del Correo Base */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Mail className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Vínculo de Correo Base</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Contraseña Correo</p>
                                <p className="text-xs font-bold text-gray-300 truncate">{cuenta.Correo?.correoClave || 'No reg.'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Nombre Orig.</p>
                                <p className="text-xs font-bold text-gray-300 truncate">{cuenta.Correo?.correoNombre || 'No reg.'}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Cumpleaños</p>
                                <p className="text-xs font-bold text-gray-300 truncate">{formatDate(cuenta.Correo?.correoCumpleanos)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Recuperación</p>
                                <p className="text-xs font-bold text-gray-300 truncate">{cuenta.Correo?.correoRecuperacion || 'N/A'}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Seccion 3: Geolocalización y Otros */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                                <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Direccion</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase uppercase">Región / País</span>
                                    <span className="text-xs font-black text-white">{cuenta.region || 'Desconocida'}</span>
                                </div>
                                <div className="text-[10px] text-gray-500 italic leading-relaxed">
                                    {cuenta.Direccion ? (
                                        typeof cuenta.Direccion === 'string' 
                                            ? cuenta.Direccion 
                                            : `${cuenta.Direccion.calle || ''}, ${cuenta.Direccion.ciudad || ''} (${cuenta.Direccion.codigoPostal || ''})`
                                    ) : 'Sin dirección de facturación registrada.'}
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <DollarSign className="w-4 h-4 text-indigo-400" />
                                <h2 className="text-xs font-black text-white uppercase tracking-widest italic">Estado Financiero</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase">Saldo en Cuenta</span>
                                    <span className="text-lg font-black text-emerald-400 italic">${cuenta.saldo || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase italic">Fecha Desactivación</span>
                                    <span className={`text-[10px] font-bold ${isDeactivated ? 'text-red-400' : 'text-gray-500'}`}>
                                        {formatDate(cuenta.fechaDesactivacion)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Panel Derecho: Juegos y 2FA */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Lista de Juegos */}
                    <Card className="p-6 flex flex-col h-[400px]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-indigo-400" />
                                <h2 className="text-[10px] font-black text-white uppercase tracking-widest italic">Catálogo</h2>
                            </div>
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-lg border border-indigo-500/10">
                                {cuenta.juegos?.length || 0}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {cuenta.juegos && cuenta.juegos.length > 0 ? (
                                cuenta.juegos.map((juego, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-white/2 rounded-2xl border border-white/5 group hover:bg-white/5 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            <Gamepad2 className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[11px] font-black text-gray-300 truncate leading-tight group-hover:text-white transition-colors">{juego.titulo}</p>
                                            <a href={juego.url} target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-gray-700 hover:text-indigo-400 flex items-center gap-1 transition-colors uppercase tracking-widest">
                                                Ver Ficha <ExternalLink className="w-2.5 h-2.5" />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                                    <p className="text-[10px] font-bold uppercase">Sin juegos asignados</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Seguridad 2FA */}
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-[10px] font-black text-white uppercase tracking-widest italic">Seguridad 2FA</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 relative group/copy cursor-pointer" onClick={() => handleCopy(cuenta.semilla2FA)}>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 flex justify-between">
                                    Semilla (Seed)
                                    <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity text-indigo-400" />
                                </p>
                                <p className="text-xs font-mono font-bold text-white tracking-widest break-all">
                                    {cuenta.semilla2FA || '---'}
                                </p>
                            </div>
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 group/copy cursor-pointer" onClick={() => handleCopy(cuenta.codigos2FA)}>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 flex justify-between">
                                    Bóveda de Códigos
                                    <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity text-indigo-400" />
                                </p>
                                <pre className="text-[10px] font-mono font-bold text-gray-400 whitespace-pre-wrap leading-relaxed py-2 max-h-32 overflow-y-auto custom-scrollbar">
                                    {cuenta.codigos2FA || 'No hay códigos de seguridad registrados.'}
                                </pre>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Custom Minimal Alert for Copy */}
            {copiedAlert && (
                <div className="fixed bottom-10 right-10 z-[100] bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <Check className="w-4 h-4" />
                    Copiado al Portapapeles
                </div>
            )}
        </MainLayout>
    );
}
