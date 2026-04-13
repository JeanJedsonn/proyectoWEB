import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, Users, Mail, Gamepad2, PackageSearch, Settings, Menu, X, LogOut, ShieldCheck } from 'lucide-react';

export default function MainLayout({ children }) {
    const { url } = usePage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Facturas', href: '/facturas', icon: FileText },
        { name: 'Clientes', href: '/clientes', icon: Users },
        { name: 'Correos', href: '/correos', icon: Mail },
        { name: 'Cuenta Juegos', href: '/cuentas_juego', icon: Gamepad2 },
        { name: 'Juegos', href: '/juegos', icon: PackageSearch },
    ];

    return (
        <div className="flex min-h-screen bg-[#0b0d12] text-white font-sans print:bg-white print:text-black print:block">
            
            {/* Overlay para movil */}
            {isSidebarOpen && (
                <button 
                    type="button"
                    className="fixed inset-0 w-full h-full cursor-default border-none bg-black/50 z-20 xl:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setIsSidebarOpen(false);
                        }
                    }}
                    aria-label="Cerrar menú lateral"
                />
            )}
            
            {/* Barra lateral */}
            <nav className={`w-64 bg-[#161821] border-r border-white/5 flex flex-col fixed h-full z-30 transition-transform duration-300 print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0`}>
                
                {/* Logo y boton cerrar */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <span className="font-bold text-xl tracking-tight">GestVentas</span>
                    </div>
                    {/* Botón cerrar para móvil */}
                    <button 
                        className="xl:hidden p-2 -mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Menu de navegación */}
                <div className="flex-1 flex flex-col gap-1 px-4 mt-4 overflow-y-auto">
                    
                    {/* items del menú */}
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url === item.href || url.startsWith(item.href + '/');
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    isActive 
                                    ? 'bg-indigo-500/10 text-indigo-400' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Boton de opciones a pie de la barra lateral */}
                    <div className="mt-auto mb-6 pt-4 border-t border-white/5">
                        {localStorage.getItem('level_admin') === '3' && (
                            <Link 
                                href="/usuarios/administrar"
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    url.startsWith('/usuarios') 
                                    ? 'bg-amber-500/10 text-amber-400' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                }`}
                            >
                                <ShieldCheck className="w-5 h-5" />
                                <span className="font-medium text-sm">Administrar Usuarios</span>
                            </Link>
                        )}
                        <Link 
                            href="/opciones"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                url.startsWith('/opciones') 
                                ? 'bg-indigo-500/10 text-indigo-400' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                            }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium text-sm">Opciones Globales</span>
                        </Link>
                        
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                localStorage.removeItem('token');
                                localStorage.removeItem('is_admin');
                                localStorage.removeItem('level_admin');
                                window.location.href = '/login';
                            }}
                            className="w-full mt-1 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium text-sm">Cerrar Sesión</span>
                        </button>
                    </div>

                </div>
            </nav>

            {/* Contenedor principal */}
            <main className="flex-1 xl:ml-64 min-h-screen relative flex flex-col print:ml-0 print:block">
                {/* Header para móvil para abrir el menú */}
                <div className="xl:hidden sticky top-0 z-10 flex items-center gap-4 bg-[#161821]/80 backdrop-blur-md px-4 py-4 border-b border-white/5 print:hidden">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-lg tracking-tight">GestVentas</span>
                </div>

                <div className="p-4 md:p-8 flex-1 print:p-0 print:m-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
