import React, { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';      // Layout principal, contiene la barra lateral y el header
import { 
    Plus, FileText, TrendingUp, 
    DollarSign, Users, Package, Circle, Loader2
} from 'lucide-react';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';

import Button from '@/Components/UI/Button';
import PageHeader from '@/Components/UI/PageHeader';
import GenericTable from '@/Components/UI/GenericTable';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Se conecta al backend Node.js para obtener los datos del dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/dashboard');
                setData(res.data);
            } catch (error) {
                console.error("Dashboard error conectando a Node:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Formateador de fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Cálculos para el dónut
    const totalTipos = data ? (data.primarias + data.secundarias) : 0;
    const ptcPrimarias = totalTipos > 0 ? Math.round((data.primarias / totalTipos) * 100) : 0;
    const ptcSecundarias = totalTipos > 0 ? Math.round((data.secundarias / totalTipos) * 100) : 0;

    // Renderiza badges de colores según el tipo de venta
    const renderTypeBadge = (tipo) => {
        if (tipo.toLowerCase() === 'primaria') {
            return <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20 capitalize">{tipo}</span>;
        }
        if (tipo.toLowerCase() === 'secundaria') {
            return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20 capitalize">{tipo}</span>;
        }
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-medium border border-amber-500/20 capitalize">{tipo}</span>;
    };

    // Renderiza el contenido para el dashboard (hay 3 secciones)
    const renderContent = () => {
        
        // Si esta cargando, muestra un loader
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            );
        }

        // Si no hay datos, muestra un mensaje de error (en caso de que falle la conexión con el backend)
        if (!data) {
            return (
                <div className="flex items-center justify-center h-64 bg-[#161821] rounded-2xl border border-white/5 text-gray-400">
                    Error al cargar datos desde http://localhost:3000/dashboard
                </div>
            );
        }

        return (
            <>
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
                        <h3 className="text-3xl font-bold text-white mb-2">{data.facturasTotales}</h3>
                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Al día</span>
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
                        <h3 className="text-3xl font-bold text-white mb-2">$ {data.ingresosMes}</h3>
                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Buen rendimiento</span>
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
                        <p className="text-gray-400 text-sm font-medium mb-1">Clientes Registrados</p>
                        <h3 className="text-3xl font-bold text-white mb-2">{data.clientesTotales}</h3>
                        <div className="flex items-center text-emerald-400 text-sm font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Comunidad activa</span>
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
                        <h3 className="text-3xl font-bold text-white mb-2">{data.juegosEnCatalogo}</h3>
                        <div className="flex items-center text-indigo-400 text-sm font-medium">
                            <Package className="w-4 h-4 mr-1" />
                            <span>Disponibles</span>
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
                            <Link href="/facturas" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors">
                                Ver todo &rarr;
                            </Link>
                        </div>
                        
                        <div className="overflow-x-auto flex-1 p-0">
                            <GenericTable 
                                columns={[
                                    { header: 'Nº Ticket' },
                                    { header: 'Fecha' },
                                    { header: 'Cliente' },
                                    { header: 'Producto' },
                                    { header: 'Tipo' },
                                    { header: 'Monto', className: 'text-right' },
                                ]}
                                data={data.ultimasVentas}
                                loading={false}
                                renderRow={(venta) => (
                                    <tr key={venta.id} onClick={() => router.visit(`/facturas/${venta.id}`)} className="group border-b border-white/5 hover:bg-white/2 transition-all cursor-pointer">
                                        <td className="px-6 py-4 font-bold text-gray-500">#{venta.id}</td>
                                        <td className="px-6 py-4 text-gray-300 font-medium">{formatDate(venta.fecha)}</td>
                                        <td className="px-6 py-4 text-white font-bold">{venta.cliente}</td>
                                        <td className="px-6 py-4 text-gray-300 font-medium">{venta.juego}</td>
                                        <td className="px-6 py-4">
                                            {renderTypeBadge(venta.tipo)}
                                        </td>
                                        <td className="px-6 py-4 font-black text-white text-right">$ {venta.monto}</td>
                                    </tr>
                                )}
                            />
                        </div>
                    </div>

                    {/* Ventas por Tipo (Donut) */}
                    <div className="bg-[#161821] border border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                            <Circle className="w-5 h-5 text-indigo-400" />
                            Ventas por Tipo
                        </h2>
                        
                        <div className="relative w-48 h-48 mx-auto mb-8">
                            {/* Base estática que simula el dónut */}
                            <div className="absolute inset-0 rounded-full border-[16px] border-[#161821] shadow-[0_0_0_2px_rgba(255,255,255,0.05)]"></div>
                            <div className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden">
                                    <svg viewBox="0 0 36 36" className="w-[110%] h-[110%] absolute">
                                    {/* Primarias */}
                                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#6366f1" strokeWidth="4" strokeDasharray={`${ptcPrimarias} ${100 - ptcPrimarias}`} strokeDashoffset="25"></circle>
                                    {/* Secundarias */}
                                    <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray={`${ptcSecundarias} ${100 - ptcSecundarias}`} strokeDashoffset={25 - ptcPrimarias}></circle>
                                    </svg>
                            </div>
                            <div className="absolute inset-0 m-[16px] rounded-full bg-[#161821]"></div>
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <span className="text-2xl font-bold text-white">{totalTipos}</span>
                                <span className="text-xs text-gray-500">Cuentas</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    <span className="text-gray-300">Primaria ({data.primarias})</span>
                                </div>
                                <span className="font-semibold text-white">{ptcPrimarias}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-gray-300">Secundaria ({data.secundarias})</span>
                                </div>
                                <span className="font-semibold text-white">{ptcSecundarias}%</span>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    };

    return (
        
        <MainLayout>
            <PageHeader
                title="Dashboard"
                description="Resumen operativo de ventas, métricas de facturación y tareas pendientes del sistema."
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
