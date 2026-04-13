import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { UserPlus, Mail, Lock, ShieldQuestion, Loader2, Info } from 'lucide-react';
import MainLayout from '../Layouts/MainLayout';

export default function CrearUsuario() {
    const [formData, setFormData] = useState({
        correo: '',
        password: '',
        level_admin: 0,
        pregunta1: '¿Cuál era el nombre de tu primera mascota?',
        respuesta1: '',
        pregunta2: '¿En qué ciudad naciste?',
        respuesta2: '',
        pregunta3: '¿Cuál es tu color favorito?',
        respuesta3: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';
            await axios.post(`${urlNode}/auth/crear`, formData);

            setSuccessMsg('Usuario creado exitosamente.');
            setFormData({
                ...formData,
                correo: '',
                password: '',
                level_admin: 0,
                respuesta1: '',
                respuesta2: '',
                respuesta3: ''
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            if (error.response?.data?.mensaje) {
                setErrorMsg(error.response.data.mensaje);
            } else {
                setErrorMsg('Error de conexión con el servidor. Intenta más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <Head title="Crear Usuario" />

            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-10 font-sans">
                <div className="w-full bg-[#161821] border border-emerald-500/10 p-8 rounded-3xl shadow-2xl relative z-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-lg shadow-emerald-500/20 border border-emerald-500/30">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Registrar Nuevo Usuario</h1>
                        <p className="text-gray-400 text-sm mt-2 text-center max-w-sm">
                            Solo los administradores pueden crear nuevas cuentas y asignar roles.
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                            <Info className="w-5 h-5 shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="correo">
                                    Dirección de Correo
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="correo"
                                        type="email"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        className="w-full bg-[#0b0d12]/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                        placeholder="nuevo@correo.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">
                                    Contraseña Segura
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-[#0b0d12]/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0b0d12]/50 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white text-sm">Nivel de Acceso</h3>
                                <p className="text-gray-400 text-xs mt-1">Define los privilegios de este usuario en el sistema.</p>
                            </div>
                            <select
                                id="level_admin"
                                value={formData.level_admin}
                                onChange={(e) => setFormData(prev => ({ ...prev, level_admin: Number.parseInt(e.target.value, 10) }))}
                                className="bg-[#0b0d12] border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
                                aria-label="Nivel de Acceso"
                            >
                                <option value={0}>👤 Normal — Solo lectura</option>
                                <option value={1}>🛡️ Admin — Editar y borrar</option>
                            </select>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                <ShieldQuestion className="w-4 h-4 text-emerald-500" />
                                Preguntas de Seguridad
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs text-gray-400" htmlFor="pregunta1">Pregunta 1</label>
                                    <input id="pregunta1" type="text" value={formData.pregunta1} onChange={handleChange} className="w-full bg-[#0b0d12]/30 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs text-gray-400" htmlFor="respuesta1">Respuesta 1</label>
                                    <input id="respuesta1" type="text" value={formData.respuesta1} onChange={handleChange} className="w-full bg-[#0b0d12]/50 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm" placeholder="Tu respuesta secreta" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs text-gray-400" htmlFor="pregunta2">Pregunta 2</label>
                                    <input id="pregunta2" type="text" value={formData.pregunta2} onChange={handleChange} className="w-full bg-[#0b0d12]/30 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs text-gray-400" htmlFor="respuesta2">Respuesta 2</label>
                                    <input id="respuesta2" type="text" value={formData.respuesta2} onChange={handleChange} className="w-full bg-[#0b0d12]/50 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm" placeholder="Tu respuesta secreta" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs text-gray-400" htmlFor="pregunta3">Pregunta 3</label>
                                    <input id="pregunta3" type="text" value={formData.pregunta3} onChange={handleChange} className="w-full bg-[#0b0d12]/30 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs text-gray-400" htmlFor="respuesta3">Respuesta 3</label>
                                    <input id="respuesta3" type="text" value={formData.respuesta3} onChange={handleChange} className="w-full bg-[#0b0d12]/50 border border-white/5 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-sm" placeholder="Tu respuesta secreta" required />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Crear Cuenta de Usuario
                                        <UserPlus className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
