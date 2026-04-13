import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Loader2, Shield, Users, Pencil, Activity, Server, Ticket, PackageSearch } from 'lucide-react';
import PageHeader from '@/Components/UI/PageHeader';
import Button from '@/Components/UI/Button';
import Card from '@/Components/UI/Card';
import PropTypes from 'prop-types';

export default function JuegoShow({ id }) {
    const [juego, setJuego] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJuegoDetalles = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:3000/juegos/leer_juego/${id}`);
                setJuego(res.data);
            } catch (err) {
                console.error("Error cargando detalles del juego:", err);
                setError("No se pudo cargar la información del juego.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJuegoDetalles();
        }
    }, [id]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400">Cargando detalles del juego...</p>
                </div>
            );
        }

        if (error || !juego) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <Shield className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Error al Cargar</h3>
                    <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
                        {error || "Los datos del juego no están disponibles."}
                    </p>
                    <Link href="/juegos" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                        Volver al Catálogo
                    </Link>
                </div>
            );
        }

        const totalVentas = (juego.ventas?.primarias || 0) + (juego.ventas?.secundarias || 0);
        const porcentajePrimarias = totalVentas > 0 ? Math.round(((juego.ventas?.primarias || 0) / totalVentas) * 100) : 0;
        const porcentajeSecundarias = totalVentas > 0 ? Math.round(((juego.ventas?.secundarias || 0) / totalVentas) * 100) : 0;

        return (
            <div>
                {/* Header */}
                <PageHeader 
                    title={juego.titulo}
                    breadcrumbs={[
                        { label: 'Catálogo Listado', href: '/juegos' },
                        { label: `Título #${id}` }
                    ]}
                    description={juego.descripcion}
                    icon={PackageSearch}
                >
                    <div className="flex items-center gap-3 w-full md:w-auto">
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
                            onClick={() => router.visit(`/juegos/${id}/editar`)}
                        >
                            Editar Juego
                        </Button>
                    </div>
                </PageHeader>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Cuentas Listado */}
                    <div className="lg:col-span-8">
                        <Card 
                            title={`Cuentas con el Título #${id} (${juego.cuentaJuegos?.length || 0})`}
                            icon={Server}
                            className="h-full flex flex-col"
                            variant="default"
                        >
                            <p className="text-[13px] text-gray-400 mb-6 mt-[-20px]">
                                Lista de las cuentas que tienen este juego adquirido
                            </p>
                            
                            <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {(!juego.cuentaJuegos || juego.cuentaJuegos.length === 0) ? (
                                    <div className="py-12 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
                                        <Users className="w-10 h-10 text-gray-600 mb-3" />
                                        <p className="text-gray-400 font-medium">No hay cuentas asignadas</p>
                                    </div>
                                ) : (
                                    juego.cuentaJuegos.map(cuenta => (
                                        <button 
                                            key={cuenta.id} 
                                            type="button"
                                            onClick={() => router.visit(`/cuentas_juego/${cuenta.id}`)}
                                            className="w-full text-left bg-white/2 border border-white/5 rounded-xl p-3 cursor-pointer hover:border-indigo-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                                    <Server className="w-4 h-4 text-gray-400" />
                                                    Cta #{cuenta.id} - {cuenta.nick || 'Sin nick'}
                                                </div>
                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">
                                                    Activa
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                                    {cuenta.direccionCorreo}
                                                </span>
                                                <span className="text-[11px] text-emerald-400 font-medium">
                                                    En Catálogo
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Stats de Venta (Facturas) */}
                    <div className="lg:col-span-4">
                        <Card 
                            title="Métricas de Facturación"
                            icon={Activity}
                            variant="success"
                            className="h-full flex flex-col"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-white mb-1">{totalVentas}</div>
                                    <div className="text-[13px] text-gray-400 font-medium">Ventas Históricas Registradas</div>
                                </div>

                                <div className="border border-white/5 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-400 font-medium">Primarias Vendidas</span>
                                        <span className="text-xs font-bold text-white">{juego.ventas?.primarias || 0}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 rounded-full" 
                                            style={{ width: `${porcentajePrimarias}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="border border-white/5 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-gray-400 font-medium">Secundarias Vendidas</span>
                                        <span className="text-xs font-bold text-white">{juego.ventas?.secundarias || 0}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-indigo-500 rounded-full" 
                                            style={{ width: `${porcentajeSecundarias}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                variant="outline"
                                icon={Ticket}
                                className="w-full mt-6 flex justify-center"
                                onClick={() => router.visit(`/facturas?search=${encodeURIComponent(juego.titulo)}&field=titulo_juego`)}
                            >
                                Ver Facturas de este Juego
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title={`Juego ${id}`} />
            {renderContent()}
        </MainLayout>
    );
};

JuegoShow.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};
