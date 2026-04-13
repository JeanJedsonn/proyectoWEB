import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    ArrowLeft, MessageSquare, 
    Copy, Pencil, Shield, Activity, FileText, 
    Calendar, DollarSign, Wallet, Loader2,
    User
} from 'lucide-react';

// Componentes UI Atómicos
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import Badge from '@/Components/UI/Badge';
import Toast from '@/Components/UI/Toast';
import PropTypes from 'prop-types';
import JuegoNavButton from '@/Components/UI/JuegoNavButton';

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
                const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                const res = await axios.get(`${urlNode}/clientes/leer_cliente/${id}`);
                setCliente(res.data);
            } catch (err) {
                console.error("Error cargando cliente:", err);
                setError("No se pudo localizar el registro maestro del cliente.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCliente();
    }, [id]);

    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const getRedBadgeVariant = (red) => {
        const lowerRed = red?.toLowerCase() || '';
        if (lowerRed.includes('whatsapp')) return 'success';
        if (lowerRed.includes('instagram')) return 'danger';
        if (lowerRed.includes('facebook') || lowerRed.includes('x')) return 'indigo';
        return 'secondary';
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Accediendo a Base de Datos...</p>
                </div>
            </MainLayout>
        );
    }

    if (error || !cliente) {
        return (
            <MainLayout>
                <Card variant="premium" className="max-w-2xl mx-auto p-16 text-center shadow-2xl">
                    <Shield className="w-16 h-16 text-red-500/20 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Error de Localización</h3>
                    <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                        {error || "El perfil solicitado no existe o ha sido removido del directorio activo."}
                    </p>
                    <Button variant="secondary" icon={ArrowLeft} onClick={() => router.visit('/clientes')}>
                        Regresar al Directorio
                    </Button>
                </Card>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title={`Perfil: ${cliente.nombre}`} />
            
            <PageHeader
                title={cliente.nombre}
                description="Informacion del cliente."
                icon={User}
                breadcrumbs={[
                    { label: 'Clientes', href: '/clientes' },
                    { label: `ID #${id}` }
                ]}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" icon={ArrowLeft} onClick={() => globalThis.history.back()}>
                        Volver
                    </Button>
                    <Link href={`/clientes/${cliente.id}/editar`}>
                        <Button variant="primary" icon={Pencil}>
                            Editar Perfil
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
                {/* Panel Central: Información de Contacto */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Tarjeta de Identidad */}
                    <Card variant="premium" className="p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <User className="w-48 h-48 text-white" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-10 relative z-10">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{cliente.nombre}</h2>
                                    <Badge variant="indigo">ID #{String(cliente.id).padStart(3, '0')}</Badge>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> Miembro del sistema</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <button 
                                type="button"
                                className="p-4 bg-black/40 rounded-2xl border border-white/5 group/copy cursor-pointer transition-all hover:border-emerald-500/30 text-left w-full outline-none focus:ring-2 focus:ring-emerald-500/50" 
                                onClick={() => handleCopy(cliente.telefono)}
                            >
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 flex justify-between items-center">
                                    Teléfono Primario
                                    <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity text-emerald-400" />
                                </p>
                                <p className="text-sm font-bold text-white">{cliente.telefono || 'No disponible'}</p>
                            </button>

                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Medio de Contacto</p>
                                <div className="pt-1">
                                    <Badge variant={getRedBadgeVariant(cliente.red)} className="uppercase tracking-tighter px-3">
                                        {cliente.red}
                                    </Badge>
                                </div>
                            </div>

                            <button 
                                type="button"
                                className="p-4 bg-black/40 rounded-2xl border border-white/5 group/copy cursor-pointer transition-all hover:border-indigo-500/30 text-left w-full outline-none focus:ring-2 focus:ring-indigo-500/50" 
                                onClick={() => handleCopy(cliente.correo)}
                            >
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 flex justify-between items-center">
                                    Correo Electrónico
                                    <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity text-indigo-400" />
                                </p>
                                <p className="text-sm font-bold text-white truncate">{cliente.correo || 'No registrado'}</p>
                            </button>
                        </div>

                        {cliente.telefono && (
                            <div className="mt-8 flex gap-4 relative z-10">
                                <Button 
                                    variant="success" 
                                    icon={MessageSquare} 
                                    className="flex-1 md:flex-none shadow-lg shadow-emerald-500/10"
                                    onClick={() => window.open(`https://wa.me/${cliente.telefono?.replaceAll(/\D/g, '')}`, '_blank')}
                                >
                                    WhatsApp Directo
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Notas Comerciales */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest">Observaciones del Cliente</h2>
                        </div>
                        <div className="p-6 bg-black/20 rounded-2xl border border-white/5 min-h-[120px]">
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {cliente.notas || "No se han registrado observaciones comerciales o notas preventivas para este perfil."}
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Panel Lateral: Historial de Ventas */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-6 h-full flex flex-col border-t-4 border-t-indigo-500">
                        
                        {/* Titulo de la seccion */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-indigo-400" />
                                <h2 className="text-[12px] font-black text-white uppercase tracking-widest">Facturación</h2>
                            </div>
                            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-500/10">
                                {cliente.facturas?.length || 0}
                            </span>
                        </div>

                        {/* Lista de facturas */}
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-[600px]">
                            {(!cliente.facturas || cliente.facturas.length === 0) ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                                    <Wallet className="w-12 h-12 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Sin histórico de ventas</p>
                                </div>
                            ) : (
                                cliente.facturas.map((factura) => (
                                    <JuegoNavButton 
                                        key={factura.id}
                                        item={factura}
                                        icon={FileText}
                                        routePrefix="/facturas"
                                        subtitle={(
                                            <div className="flex items-center gap-2">
                                                <span className="text-indigo-500/60 font-mono">#{factura.id}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    {formatDate(factura.fechaVenta)}
                                                </span>
                                            </div>
                                        )}
                                        rightContent={(
                                            <div className="flex items-center">
                                                <DollarSign className="w-3.5 h-3.5" />
                                                {factura.precio}
                                            </div>
                                        )}
                                        extraBadge={factura.tipo}
                                    />
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <Toast 
                show={showCopyMsg}
                message="Copiado al portapapeles"
                variant="copy"
                onClose={() => setShowCopyMsg(false)}
            />
        </MainLayout>
    );
}

ClienteShow.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};
