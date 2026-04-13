import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Mail, Loader2, ArrowRight, ShieldCheck, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Recuperar() {
    const [fase, setFase] = useState(1); // 1: Pedir Correo, 2: Preguntas y Nueva Clave, 3: Éxito
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    // Form Data
    const [correo, setCorreo] = useState('');
    const [preguntas, setPreguntas] = useState({ pregunta1: '', pregunta2: '', pregunta3: '' });
    const [respuestas, setRespuestas] = useState({ r1: '', r2: '', r3: '' });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const renderHeaderIcon = () => {
        if (fase === 3) return <CheckCircle2 className="w-7 h-7 text-emerald-400" />;
        if (fase === 2) return <KeyRound className="w-7 h-7" />;
        return <ShieldCheck className="w-7 h-7" />;
    };

    const urlNode = import.meta.env.VITE_NODE_API_URL || 'http://localhost:3000';

    // Fase 1: Pedir las preguntas al servidor
    const handleSolicitarPreguntas = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await axios.post(`${urlNode}/auth/recuperar/preguntas`, { correo });
            setPreguntas(res.data.preguntas);
            setFase(2); // Avanzar a la fase de respuestas
        } catch (error) {
            console.error('Error:', error);
            setErrorMsg(error.response?.data?.mensaje || 'Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    // Fase 2: Mandar las respuestas y la nueva clave
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (newPassword !== confirmPassword) {
            setErrorMsg('Las contraseñas nuevas no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${urlNode}/auth/recuperar/verificar`, {
                correo,
                respuesta1: respuestas.r1,
                respuesta2: respuestas.r2,
                respuesta3: respuestas.r3,
                newPassword
            });
            
            // Éxito, ocultar el form y mostrar feedback
            setFase(3);
            setTimeout(() => {
                globalThis.location.href = '/login';
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            setErrorMsg(error.response?.data?.mensaje || 'Respuestas incorrectas o error de servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0d12] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
            
            {/* Efectos de fondo heredados */}
            <div className="absolute top-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

            <Head title="Recuperar Contraseña" />

            <div className="w-full max-w-xl bg-[#161821] border border-white/5 p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 mx-auto">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
                        {renderHeaderIcon()}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
                        {fase === 1 && "Recuperación de Acceso"}
                        {fase === 2 && "Verificación de Seguridad"}
                        {fase === 3 && "¡Contraseña Restaurada!"}
                    </h1>
                    <p className="text-gray-400 text-sm max-w-sm">
                        {fase === 1 && "Ingresa el correo electrónico asociado a tu cuenta para obtener tus preguntas secretas."}
                        {fase === 2 && "Responde a las preguntas de seguridad que configuraste inicialmente en minúsculas."}
                        {fase === 3 && "Tu acceso ha sido recuperado con éxito. Redirigiendo en unos segundos..."}
                    </p>
                </div>

                {/* Mensaje global de error */}
                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-in fade-in zoom-in-95">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{errorMsg}</span>
                    </div>
                )}

                {/* FASE 1: Formulario de Correo */}
                {fase === 1 && (
                    <form onSubmit={handleSolicitarPreguntas} className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide text-[11px]" htmlFor="correo">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="correo"
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    className="w-full bg-[#0b0d12]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                                    placeholder="admin@admin.com"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !correo}
                            className="w-full flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white py-3.5 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar mis preguntas secretas'}
                        </button>

                        <div className="text-center pt-2 border-t border-white/5">
                            <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">
                                Cancelar y volver al inicio
                            </Link>
                        </div>
                    </form>
                )}

                {/* FASE 2: Formulario de Respuestas y Nueva Clave */}
                {fase === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-6 animate-in slide-in-from-right-8 fade-in">
                        
                        <div className="bg-[#0b0d12]/50 border border-white/5 rounded-2xl p-6 space-y-5">
                            <h3 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-4 border-b border-white/5 pb-2">Preguntas Secretas</h3>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">1. {preguntas.pregunta1}</label>
                                <input
                                    type="text"
                                    value={respuestas.r1}
                                    onChange={(e) => setRespuestas({...respuestas, r1: e.target.value})}
                                    className="w-full bg-[#161821] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">2. {preguntas.pregunta2}</label>
                                <input
                                    type="text"
                                    value={respuestas.r2}
                                    onChange={(e) => setRespuestas({...respuestas, r2: e.target.value})}
                                    className="w-full bg-[#161821] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">3. {preguntas.pregunta3}</label>
                                <input
                                    type="text"
                                    value={respuestas.r3}
                                    onChange={(e) => setRespuestas({...respuestas, r3: e.target.value})}
                                    className="w-full bg-[#161821] border border-white/10 rounded-lg py-2.5 px-4 text-white focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-[#0b0d12]/50 border border-white/5 rounded-2xl p-6 space-y-5">
                            <h3 className="text-xs font-black uppercase text-emerald-400 tracking-widest mb-4 border-b border-white/5 pb-2">Nueva Credencial</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide" htmlFor="newPassword">Nueva Contraseña</label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-[#161821] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide" htmlFor="confirmPassword">Confirmar Contraseña</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-[#161821] border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !respuestas.r1 || !respuestas.r2 || !respuestas.r3 || !newPassword || !confirmPassword}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    Restablecer y Guardar
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
            
        </div>
    );
}
