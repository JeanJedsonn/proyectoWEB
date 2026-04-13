import React, { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';      // Layout principal, contiene la barra lateral y el header
import { 
    Plus, FileText, TrendingUp, 
    DollarSign, Users, Package, Circle, Loader2, PackageSearch
} from 'lucide-react';
import axios from 'axios';
import { Link, router, Head } from '@inertiajs/react';

import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import FacturaCard from '@/Components/Facturas/FacturaCard';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Se conecta al backend Node.js para obtener los datos del dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
                const res = await axios.get(`${urlNode}/dashboard`);
                setData(res.data);
            } catch (error) {
                console.error("Dashboard error conectando a Node:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Cálculos para el dónut
    const totalTipos = data ? (data.primarias + data.secundarias) : 0;
    const ptcPrimarias = totalTipos > 0 ? Math.round((data.primarias / totalTipos) * 100) : 0;
    const ptcSecundarias = totalTipos > 0 ? Math.round((data.secundarias / totalTipos) * 100) : 0;

    // Renderiza el contenido para el dashboard (hay 3 secciones)
    const renderContent = () => {
        
        // Si esta cargando, muestra un loader
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-96 bg-[#161821] rounded-4xl border border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-indigo-500/2 opacity-20" />
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4 relative z-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic relative z-10">Compilando Métricas de Rendimiento...</p>
                </div>
            );
        }

        // Si no hay datos, muestra un mensaje de error (en caso de que falle la conexión con el backend)
        if (!data) {
            const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            return (
                <div className="flex flex-col items-center justify-center h-96 bg-[#161821] rounded-4xl border border-red-500/10 text-gray-400 p-12 text-center">
                    <PackageSearch className="w-16 h-16 text-gray-800 mb-6" />
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Desconexión del Núcleo</h3>
                    <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest text-gray-600 leading-relaxed">
                        No se ha podido establecer comunicación con la terminal de datos en <span className="text-red-400 underline decoration-dotted">{urlNode}</span>.
                    </p>
                </div>
            );
        }

        return (
            <>
                {/* KPI Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Stat 1 */}
                    <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-500 shadow-lg">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                            <FileText className="w-24 h-24 text-indigo-500" />
                        </div>
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-5 text-[#6366f1] border border-indigo-500/10 shadow-inner">
                            <FileText className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Facturas Totales</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic">{data.facturasTotales}</h3>
                        <div className="mt-4 flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                            <TrendingUp className="w-3.5 h-3.5 mr-1" />
                            <span>Al día</span>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500 shadow-lg">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                            <DollarSign className="w-24 h-24 text-emerald-500" />
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-5 text-emerald-400 border border-emerald-500/10 shadow-inner">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Ingresos del Mes</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic">$ {data.ingresosMes}</h3>
                        <div className="mt-4 flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                            <TrendingUp className="w-3.5 h-3.5 mr-1" />
                            <span>En crecimiento</span>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition-all duration-500 shadow-lg">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                            <Users className="w-24 h-24 text-amber-500" />
                        </div>
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-5 text-amber-500 border border-amber-500/10 shadow-inner">
                            <Users className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Clientes Activos</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic">{data.clientesTotales}</h3>
                        <div className="mt-4 flex items-center text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                            <TrendingUp className="w-3.5 h-3.5 mr-1" />
                            <span>Comunidad leal</span>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-[#161821] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 shadow-lg">
                        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-700">
                            <Package className="w-24 h-24 text-purple-400" />
                        </div>
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-5 text-purple-400 border border-purple-500/10 shadow-inner">
                            <Package className="w-6 h-6" />
                        </div>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">Stock de Títulos</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter italic">{data.juegosEnCatalogo}</h3>
                        <div className="mt-4 flex items-center text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                            <Package className="w-3.5 h-3.5 mr-1" />
                            <span>En catálogo</span>
                        </div>
                    </div>
                </div>

                {/* Grid for Recent Sales and Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    
                    {/* Recent Sales Grid (Takes 2/3 width) */}
                    <div className="lg:col-span-2 bg-[#161821] border border-white/5 rounded-4xl p-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="flex justify-between items-center mb-10 relative z-10">
                             <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <FileText className="w-4 h-4 text-indigo-400" />
                                Actividad Reciente
                             </h2>
                             <Link href="/facturas" className="text-indigo-400 hover:text-indigo-300 text-[10px] font-black uppercase tracking-widest transition-colors">
                                Ver Todo &rarr;
                             </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {data.ultimasVentas && data.ultimasVentas.map((venta) => (
                                <FacturaCard key={venta.id} factura={venta} variant="dark" />
                            ))}
                        </div>
                    </div>

                    {/* Ventas por Tipo (Donut) */}
                    <div className="bg-[#161821] border border-white/5 rounded-4xl p-8 h-fit shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3 mb-10 relative z-10">
                            <Circle className="w-4 h-4 text-indigo-400" />
                            Distribución de Cuentas
                        </h2>
                        
                        <div className="relative w-52 h-52 mx-auto mb-12 group/chart">
                            <div className="absolute inset-0 grayscale-[0.5] group-hover/chart:grayscale-0 transition-all duration-500">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                    {/* Base Background Circle */}
                                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="3.5"></circle>
                                    
                                    {/* Primarias */}
                                    <circle 
                                        cx="18" cy="18" r="15.9155" 
                                        fill="transparent" 
                                        stroke="#6366f1" 
                                        strokeWidth="3.5" 
                                        strokeDasharray={`${ptcPrimarias} ${100 - ptcPrimarias}`} 
                                        strokeDashoffset="0"
                                        className="transition-all duration-1000 ease-out"
                                    ></circle>
                                    
                                    {/* Secundarias */}
                                    <circle 
                                        cx="18" cy="18" r="15.9155" 
                                        fill="transparent" 
                                        stroke="#10b981" 
                                        strokeWidth="3.5" 
                                        strokeDasharray={`${ptcSecundarias} ${100 - ptcSecundarias}`} 
                                        strokeDashoffset={`-${ptcPrimarias}`}
                                        className="transition-all duration-1000 ease-out delay-100"
                                    ></circle>
                                </svg>
                            </div>
                            
                            {/* Inner Circle / Stats Display */}
                            <div className="absolute inset-[3.5px] rounded-full bg-[#161821] flex flex-col items-center justify-center border border-white/5 shadow-2xl z-10">
                                <span className="text-4xl font-black text-white italic tracking-tighter leading-none">{totalTipos}</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Ventas</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
                            <div className="flex justify-between items-center group/item transition-all hover:translate-x-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                    <span className="text-[11px] font-bold text-gray-400 group-hover/item:text-gray-200">Primarias ({data.primarias})</span>
                                </div>
                                <span className="text-xs font-black text-white">{ptcPrimarias}%</span>
                            </div>
                            <div className="flex justify-between items-center group/item transition-all hover:translate-x-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[11px] font-bold text-gray-400 group-hover/item:text-gray-200">Secundarias ({data.secundarias})</span>
                                </div>
                                <span className="text-xs font-black text-white">{ptcSecundarias}%</span>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    };

    return (
        
        <MainLayout>
            <Head title="Panel Operativo" />
            <PageHeader
                title="Dashboard"
                description="Resumen operativo de ventas, métricas de facturación y estado del catálogo maestro."
                icon={TrendingUp}
                topLabel="Panel Principal"
            >
                <Button 
                    variant="primary" 
                    icon={Plus} 
                    onClick={() => router.visit('/facturas/nueva')}
                >
                    Generar Nueva Venta
                </Button>
            </PageHeader>

            {renderContent()}
        </MainLayout>
    );
}
