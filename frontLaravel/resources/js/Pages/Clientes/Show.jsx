import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { 
    ArrowLeft, Loader2, Phone, Mail, MessageSquare, 
    Clipboard, Pencil, Shield, Activity, FileText, 
    ExternalLink, Calendar, DollarSign, Wallet
} from 'lucide-react';

export default function ClienteShow({ id }) {
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCopyMsg, setShowCopyMsg] = useState(false);

    useEffect(() => {
        const fetchCliente = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:3000/clientes/leer_cliente/${id}`);
                setCliente(res.data);
            } catch (err) {
                console.error("Error cargando cliente:", err);
                setError("No se pudo cargar la información del cliente.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCliente();
        }
    }, [id]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const getRedBadgeStyle = (red) => {
        const lowerRed = red?.toLowerCase() || '';
        if (lowerRed.includes('whatsapp') || lowerRed.includes('ws')) {
            return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        }
        if (lowerRed.includes('instagram') || lowerRed.includes('ig')) {
            return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
        }
        return 'bg-white/5 text-gray-300 border-white/10';
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-medium">Cargando perfil del cliente...</p>
                </div>
            );
        }

        if (error || !cliente) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <Shield className="w-12 h-12 text-red-500 mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-white mb-2">Error al Cargar</h3>
                    <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                        {error || "Los datos del cliente no están disponibles."}
                    </p>
                    <Link href="/clientes" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                        Volver al Directorio
                    </Link>
                </div>
            );
        }

        const initials = cliente.nombre?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 font-medium">
                            <Link href="/clientes" className="hover:text-white transition-colors">Directorio Clientes</Link>
                            <span>/</span>
                            <span className="text-indigo-400">Perfil #{String(cliente.id).padStart(3, '0')}</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-emerald-500/20">
                                {initials}
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
                                    {cliente.nombre}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-gray-400 text-sm font-medium">Cliente Activo • Registrado en el sistema</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link 
                        href={`/clientes/${cliente.id}/editar`}
                        className="flex items-center gap-2 bg-[#161821] hover:bg-white/5 border border-white/5 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
                    >
                        <Pencil className="w-4 h-4" />
                        Editar Perfil
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Medios de Contacto */}
                        <div className="bg-[#161821] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Phone className="w-32 h-32 text-white" />
                            </div>
                            
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-8 relative z-10 font-mono tracking-tight uppercase">
                                <Phone className="w-5 h-5 text-emerald-400" />
                                Medios de Contacto
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                <div className="space-y-2">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">Teléfono Primario</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-white">{cliente.telefono}</span>
                                        <button 
                                            onClick={() => handleCopy(cliente.telefono)}
                                            className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                                        >
                                            <Clipboard className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">Canal de Venta</span>
                                    <div className="pt-1">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getRedBadgeStyle(cliente.red)}`}>
                                            {cliente.red}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">Correo Electrónico</span>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        {cliente.correo || '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5">
                                <button 
                                    className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 group"
                                    onClick={() => window.open(`https://wa.me/${cliente.telefono?.replace(/\D/g, '')}`, '_blank')}
                                >
                                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Abrir Chat Directo (WhatsApp)
                                </button>
                            </div>
                        </div>

                        {/* Notas */}
                        <div className="bg-[#161821] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                <FileText className="w-32 h-32 text-white" />
                            </div>
                            
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 relative z-10 font-mono tracking-tight uppercase">
                                <FileText className="w-5 h-5 text-indigo-400" />
                                Evaluación y Notas Comerciales
                            </h2>

                            <div className="bg-white/2 border border-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed text-sm italic min-h-[120px] relative z-10">
                                {cliente.notas || "Este cliente no posee notas u observaciones especiales registradas hasta el momento."}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Facturación */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#161821] border border-white/5 rounded-2xl p-6 h-full border-t-4 border-t-indigo-500 flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-400" />
                                    Facturación ({cliente.facturas?.length || 0})
                                </h2>
                                <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                                    <FileText className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 mb-6 font-medium">
                                Historial completo de ventas generadas a favor de este perfil.
                            </p>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[600px]">
                                {(!cliente.facturas || cliente.facturas.length === 0) ? (
                                    <div className="py-20 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-center">
                                        <Wallet className="w-12 h-12 text-gray-800 mb-4" />
                                        <p className="text-gray-500 font-bold">Sin facturación</p>
                                        <p className="text-[10px] text-gray-600 px-4 mt-1 uppercase tracking-tighter">Este contacto aún no registra compras en nuestro sistema.</p>
                                    </div>
                                ) : (
                                    cliente.facturas.map((factura) => (
                                        <div 
                                            key={factura.id}
                                            className="bg-white/2 border border-white/5 rounded-2xl p-4 cursor-pointer hover:border-indigo-500/30 transition-all group border-l-4 border-l-indigo-500"
                                            onClick={() => window.location.href = `http://localhost:3000/facturas/leer_factura/${factura.id}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                    {factura.titulo}
                                                </h4>
                                                <span className="bg-white/5 text-[10px] font-mono text-gray-500 px-2 py-0.5 rounded border border-white/5">
                                                    #{factura.id}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-4 font-medium uppercase tracking-tight">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(factura.fechaVenta)}
                                            </div>

                                            <div className="flex items-center justify-between bg-[#0b0d12] p-2.5 rounded-xl border border-white/5 shadow-inner">
                                                <span className="text-[10px] font-black uppercase text-indigo-400 letter spacing-widest">
                                                    {factura.tipo}
                                                </span>
                                                <span className="text-sm font-black text-emerald-400 flex items-center">
                                                    <DollarSign className="w-3.5 h-3.5" />
                                                    {factura.precio}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <div className="mt-8">
                                <button className="w-full bg-[#0b0d12] hover:bg-white/5 border border-white/5 text-gray-400 hover:text-white px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                                    Ver todas las facturas del cliente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title={`Perfil de ${cliente?.nombre || 'Cliente'}`} />
            
            <div className="mb-6">
                <Link 
                    href="/clientes" 
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group bg-[#161821] px-4 py-2 rounded-xl border border-white/5"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al directorio
                </Link>
            </div>

            {renderContent()}

            {/* Copy Notification */}
            {showCopyMsg && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-8">
                    <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3">
                        <Clipboard className="w-4 h-4" />
                        Copiado al portapapeles
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
