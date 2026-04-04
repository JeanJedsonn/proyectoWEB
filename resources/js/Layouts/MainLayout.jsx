import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, Users, Mail, Gamepad2, PackageSearch, Settings } from 'lucide-react';

export default function MainLayout({ children }) {
    const { url } = usePage();

    const navItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Facturas', href: '/facturas', icon: FileText },
        { name: 'Clientes', href: '/clientes', icon: Users },
        { name: 'Correos', href: '/correos', icon: Mail },
        { name: 'Cuenta Juegos', href: '/cuentas', icon: Gamepad2 },
        { name: 'Juegos', href: '/juegos', icon: PackageSearch },
    ];

    return (
        <div className="flex min-h-screen bg-[#0b0d12] text-white font-sans">
            {/* Sidebar Navigation */}
            <nav className="w-64 bg-[#161821] border-r border-white/5 flex flex-col fixed h-full z-10 transition-all">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight">GestVentas</span>
                </div>
                
                <div className="flex-1 flex flex-col gap-1 px-4 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url === item.href || url.startsWith(item.href + '/');
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
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

                    <div className="mt-auto mb-6 pt-4 border-t border-white/5">
                        <Link 
                            href="/opciones"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                url.startsWith('/opciones') 
                                ? 'bg-indigo-500/10 text-indigo-400' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                            }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium text-sm">Opciones Globales</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 relative">
                {children}
            </main>
        </div>
    );
}
