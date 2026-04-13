import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ShieldCheck, UserPlus, Trash2, Loader2, RefreshCw, Crown, Shield, User, Info, AlertTriangle } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';

const NIVEL_CONFIG = {
    3: { label: 'Maestro', icon: Crown, color: 'amber' },
    1: { label: 'Admin', icon: Shield, color: 'indigo' },
    0: { label: 'Normal', icon: User, color: 'gray' },
};

function NivelBadge({ nivel }) {
    const cfg = NIVEL_CONFIG[nivel] ?? NIVEL_CONFIG[0];
    const Icon = cfg.icon;
    const colorMap = {
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        gray: 'bg-white/5 text-gray-400 border-white/10',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${colorMap[cfg.color]}`}>
            <Icon className="w-3.5 h-3.5" />
            {cfg.label}
        </span>
    );
}

export default function AdministrarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null); // id del usuario a confirmar

    const miId = (() => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.id;
        } catch {
            return null;
        }
    })();

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            const response = await axios.get(`${urlNode}/auth/usuarios`);
            setUsuarios(response.data.usuarios);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            if (error.response?.status === 403) {
                setErrorMsg('Acceso denegado. Solo el Usuario Maestro puede ver esta sección.');
            } else {
                setErrorMsg('Error al cargar los usuarios. Intenta nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Protección client-side: redirigir si no es Usuario Maestro
        if (localStorage.getItem('level_admin') !== '3') {
            window.location.href = '/';
            return;
        }
        fetchUsuarios();
    }, [fetchUsuarios]);

    const handleEliminar = async (id) => {
        setDeletingId(id);
        setConfirmDelete(null);
        try {
            const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            await axios.delete(`${urlNode}/auth/usuarios/${id}`);
            setUsuarios(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            const msg = error.response?.data?.mensaje || 'Error al eliminar el usuario.';
            setErrorMsg(msg);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <MainLayout>
            <Head title="Administrar Usuarios" />

            <div className="max-w-4xl mx-auto py-6 space-y-6 font-sans">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10 shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white">Administrar Usuarios</h1>
                            <p className="text-gray-400 text-sm mt-0.5">Gestiona las cuentas del sistema. Solo visible para el Usuario Maestro.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={fetchUsuarios}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                        <Link
                            href="/usuarios/nuevo"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all text-sm font-semibold"
                        >
                            <UserPlus className="w-4 h-4" />
                            Crear Usuario
                        </Link>
                    </div>
                </div>

                {/* Error */}
                {errorMsg && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                        <Info className="w-5 h-5 shrink-0" />
                        <span>{errorMsg}</span>
                        <button type="button" onClick={() => setErrorMsg('')} className="ml-auto text-red-400/60 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                    </div>
                )}

                {/* Tabla de usuarios */}
                <div className="bg-[#161821] border border-white/5 rounded-3xl overflow-hidden shadow-xl">

                    {/* Leyenda de niveles */}
                    <div className="px-6 py-4 border-b border-white/5 flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="font-semibold text-gray-400 mr-1">Niveles:</span>
                        <span className="flex items-center gap-1.5"><Crown className="w-3.5 h-3.5 text-amber-400" /> Maestro (3) — Acceso total + gestión de usuarios</span>
                        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-indigo-400" /> Admin (1) — Editar y borrar datos</span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> Normal (0) — Solo lectura</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-sm">Cargando usuarios...</span>
                        </div>
                    ) : usuarios.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                            <User className="w-10 h-10 mb-3" />
                            <p className="text-sm">No hay usuarios registrados.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {usuarios.map((u) => {
                                const esMiCuenta = u.id === miId;
                                const esElUnico = u.level_admin === 3 && usuarios.filter(x => x.level_admin === 3).length === 1;
                                const puedeEliminar = !esMiCuenta;

                                return (
                                    <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                                            u.level_admin === 3 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                            u.level_admin === 1 ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' :
                                            'bg-white/5 text-gray-400 border border-white/10'
                                        }`}>
                                            {u.correo.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-white text-sm font-medium truncate">{u.correo}</span>
                                                {esMiCuenta && (
                                                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400 text-[10px] font-bold uppercase tracking-wide">
                                                        Tú
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-xs mt-0.5">ID #{u.id}</p>
                                        </div>

                                        {/* Nivel */}
                                        <NivelBadge nivel={u.level_admin} />

                                        {/* Acción */}
                                        {confirmDelete === u.id ? (
                                            <div className="flex items-center gap-2 animate-in fade-in duration-200">
                                                <span className="text-xs text-red-400 flex items-center gap-1">
                                                    <AlertTriangle className="w-3.5 h-3.5" /> ¿Confirmar?
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEliminar(u.id)}
                                                    disabled={deletingId === u.id}
                                                    className="px-3 py-1.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/25 transition-all disabled:opacity-50"
                                                >
                                                    {deletingId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Sí, eliminar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmDelete(null)}
                                                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => puedeEliminar && setConfirmDelete(u.id)}
                                                disabled={!puedeEliminar || deletingId !== null}
                                                title={esMiCuenta ? 'No puedes eliminar tu propia cuenta' : `Eliminar a ${u.correo}`}
                                                className={`p-2 rounded-xl transition-all ${
                                                    puedeEliminar
                                                        ? 'text-gray-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100'
                                                        : 'text-gray-700 cursor-not-allowed'
                                                } disabled:opacity-30`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer con conteo */}
                    {!loading && usuarios.length > 0 && (
                        <div className="px-6 py-3 border-t border-white/5 text-xs text-gray-600 flex items-center justify-between">
                            <span>{usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''} en total</span>
                            <span className="text-gray-700">Hover sobre una fila para ver las acciones</span>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
