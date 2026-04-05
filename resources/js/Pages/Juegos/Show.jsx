import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Loader2, Gamepad2, Mail, User, Shield, Users, Trophy, Pencil, Activity, Server, Ticket } from 'lucide-react';

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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-medium">
                            <Link href="/juegos" className="hover:text-white transition-colors">Catálogo Listado</Link>
                            <span className="text-gray-600">/</span>
                            <span className="text-white">Título #{id}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-[#161821] flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
                                <Gamepad2 className="w-7 h-7 text-white/90" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-[28px] font-bold text-white leading-tight">
                                    {juego.titulo}
                                </h1>
                                <p className="text-gray-400 text-sm mt-1">ID de Base de Datos: #{id}</p>
                            </div>
                        </div>
                    </div>
                    <Link href={`/juegos/${id}/editar`} className="flex items-center gap-2 bg-[#161821] hover:bg-white/5 border border-white/5 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                        <Pencil className="w-4 h-4" />
                        Editar Nombre
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Cuentas Listado */}
                    <div className="lg:col-span-8">
                        <div className="bg-[#161821] border border-white/5 rounded-2xl p-6 h-full border-t-4 border-t-indigo-500 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Server className="w-5 h-5" />
                                    Cuentas con este Juego ({juego.cuentaJuegos?.length || 0})
                                </h2>
                            </div>
                            
                            <p className="text-[13px] text-gray-400 mb-6">
                                Esta lista se genera automáticamente buscando este título en las cuentas registradas.
                            </p>
                            
                            <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {(!juego.cuentaJuegos || juego.cuentaJuegos.length === 0) ? (
                                    <div className="py-12 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
                                        <Users className="w-10 h-10 text-gray-600 mb-3" />
                                        <p className="text-gray-400 font-medium">No hay cuentas asignadas</p>
                                    </div>
                                ) : (
                                    juego.cuentaJuegos.map(cuenta => (
                                        <div 
                                            key={cuenta.id} 
                                            className="bg-white/2 border border-white/5 rounded-xl p-3 cursor-pointer hover:border-indigo-500/50 transition-colors"
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
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stats de Venta (Facturas) */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#161821] border border-white/5 rounded-2xl p-6 h-full border-t-4 border-t-emerald-500 flex flex-col">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                <Activity className="w-5 h-5" />
                                Métricas de Facturación
                            </h2>
                            
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

                            <button className="w-full mt-6 bg-[#161821] hover:bg-white/5 border border-white/5 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                                <Ticket className="w-4 h-4" />
                                Ver Facturas de este Juego
                            </button>
                        </div>
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
}
