import React, { useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useStore } from '@/Stores/useStore';
import api from '@/Services/api';
import { 
    Plus, FileText, TrendingUp, TrendingDown, 
    DollarSign, Users, Package, Check, Circle
} from 'lucide-react';

export default function Dashboard() {
    const { items, setItems } = useStore();

    // Requisito 2: Consumo asíncrono.
    // Simulamos la obtención de últimas ventas y stats para no romper la app de inicio.
    useEffect(() => {
        /*
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard-stats');
                // setItems(...)
            } catch (error) {
                console.error("Dashboard error:", error);
            }
        };
        fetchDashboardData();
        */
    }, []);

    return (
        <MainLayout>
            {/* Header */}
            <header className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400 text-sm">Resumen operativo de ventas, métricas de facturación y tareas pendientes del sistema.</p>
                </div>
                <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" />
                    Generar Nueva Venta
                </button>
            </header>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat 1 */}
                <div className="bg-[#161821] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <FileText className="w-16 h-16 text-[#6366f1]" />
                    </div>
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-[#6366f1]">
                        <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Facturas Totales</p>
                    <h3 className="text-3xl font-bold text-white mb-2">4,882</h3>
                    <div className="flex items-center text-emerald-400 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+124 este mes</span>
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-[#161821] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-16 h-16 text-emerald-400" />
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Ingresos del Mes</p>
                    <h3 className="text-3xl font-bold text-white mb-2">$ 3,480</h3>
                    <div className="flex items-center text-emerald-400 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+18% vs anterior</span>
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-[#161821] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Users className="w-16 h-16 text-amber-500" />
                    </div>
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 text-amber-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Clientes Activos</p>
                    <h3 className="text-3xl font-bold text-white mb-2">312</h3>
                    <div className="flex items-center text-emerald-400 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>+8 nuevos</span>
                    </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-[#161821] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Package className="w-16 h-16 text-purple-400" />
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
                        <Package className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Juegos en Catálogo</p>
                    <h3 className="text-3xl font-bold text-white mb-2">87</h3>
                    <div className="flex items-center text-red-400 text-sm font-medium">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        <span>-2 removidos</span>
                    </div>
                </div>
            </div>

            {/* Grid for Table and Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Recent Sales Table (Takes 2/3 width) */}
                <div className="lg:col-span-2 bg-[#161821] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            Últimas Ventas Registradas
                        </h2>
                        <a href="/facturas" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                            Ver todo &rarr;
                        </a>
                    </div>
                    
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#0b0d12]/50 text-gray-400 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Nº Ticket</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Producto</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* Dummy row 1 */}
                                <tr className="hover:bg-white/5 cursor-pointer transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-gray-500">#1048</td>
                                    <td className="px-6 py-4 text-gray-300">03 Abr 2026</td>
                                    <td className="px-6 py-4 text-white font-medium">José Rodríguez</td>
                                    <td className="px-6 py-4 text-gray-300">GTA VI</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">Primaria</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white text-right">$ 45.00</td>
                                </tr>
                                {/* Dummy row 2 */}
                                <tr className="hover:bg-white/5 cursor-pointer transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-gray-500">#1047</td>
                                    <td className="px-6 py-4 text-gray-300">02 Abr 2026</td>
                                    <td className="px-6 py-4 text-white font-medium">Ana López</td>
                                    <td className="px-6 py-4 text-gray-300">Hogwarts Legacy</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium border border-amber-500/20">Código Key</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white text-right">$ 35.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Ventas por Tipo (Donut placeholder) */}
                <div className="bg-[#161821] border border-white/5 rounded-2xl p-6">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                        <Circle className="w-5 h-5 text-indigo-400" />
                        Ventas por Tipo
                    </h2>
                    
                    <div className="relative w-48 h-48 mx-auto mb-8">
                        {/* Placeholder visual para el gráfico de dónut */}
                        <div className="absolute inset-0 rounded-full border-[16px] border-[#161821] shadow-[0_0_0_2px_rgba(255,255,255,0.05)]"></div>
                        <div className="absolute inset-0 rounded-full border-t-[16px] border-l-[16px] border-indigo-500 rotate-45 opacity-90"></div>
                        <div className="absolute inset-0 rounded-full border-r-[16px] border-emerald-500 rotate-[225deg] opacity-90"></div>
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold text-white">$ 87,420</span>
                            <span className="text-xs text-gray-500">Total</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                <span className="text-gray-300">Primaria</span>
                            </div>
                            <span className="font-semibold text-white">55%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-gray-300">Secundaria</span>
                            </div>
                            <span className="font-semibold text-white">25%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-gray-300">Código Key</span>
                            </div>
                            <span className="font-semibold text-white">20%</span>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Tareas Pendientes */}
            <div className="bg-[#161821] border border-white/5 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Check className="w-5 h-5 text-indigo-400" />
                        Tareas Pendientes
                    </h2>
                    <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-semibold text-gray-400">
                        1 de 3 completadas
                    </span>
                </div>
                
                <div className="space-y-3">
                    {/* Tarea checkeada */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group cursor-pointer hover:bg-white/[0.04] transition-colors">
                        <div className="w-6 h-6 rounded bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4" />
                        </div>
                        <p className="text-gray-500 line-through text-sm flex-1">Actualizar las credenciales de la cuenta PSN</p>
                        <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-medium">Alta</span>
                    </div>

                    {/* Tarea no checkeada */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group cursor-pointer hover:bg-white/[0.04] transition-colors">
                        <div className="w-6 h-6 rounded border border-gray-600 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-400 transition-colors"></div>
                        <p className="text-gray-300 text-sm flex-1 group-hover:text-white transition-colors">Renovar suscripción PS Plus</p>
                        <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-medium">Alta</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group cursor-pointer hover:bg-white/[0.04] transition-colors">
                        <div className="w-6 h-6 rounded border border-gray-600 flex items-center justify-center flex-shrink-0 group-hover:border-indigo-400 transition-colors"></div>
                        <p className="text-gray-300 text-sm flex-1 group-hover:text-white transition-colors">Añadir «Astro Bot» al catálogo</p>
                        <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Media</span>
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Añadir nueva tarea..." 
                        className="flex-1 bg-[#0b0d12] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-600"
                    />
                    <button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">
                        Añadir
                    </button>
                </div>
            </div>

        </MainLayout>
    );
}
