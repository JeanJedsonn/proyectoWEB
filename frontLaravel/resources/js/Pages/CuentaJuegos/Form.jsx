import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Gamepad2, ShieldCheck, Mail, ArrowLeft, Save, 
    Trash2, Info, MapPin, Database, Key, 
    DollarSign, Calendar, Loader2, Globe, User,
    Search, Check, X, AlertTriangle
} from 'lucide-react';

export default function CuentaJuegosForm({ id = null }) {
    const isEditing = !!id;
    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [correos, setCorreos] = useState([]);
    const [allJuegos, setAllJuegos] = useState([]);
    const [searchJuego, setSearchJuego] = useState('');
    
    const [formData, setFormData] = useState({
        correoID: '',
        clave: '',
        cumpleaños: '',
        fechadesactivacion: '',
        saldo: '',
        nick: '',
        plataforma: 'PlayStation',
        region: 'US',
        semilla: '',
        codigos2FA: '',
        direccion: {
            pais: '',
            ciudad: '',
            codigoPostal: '',
            calle: ''
        },
        juegos: [] // IDs
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch available Correos (limited to 500 for the dropdown)
                const resCorreos = await axios.get('http://localhost:3000/correos/correos_por_pagina/500/num_pagina/1');
                setCorreos(resCorreos.data.data || []);

                // 2. Fetch available Juegos
                const resJuegos = await axios.get('http://localhost:3000/juegos/juegos_por_pagina/500/num_pagina/1');
                setAllJuegos(resJuegos.data.data || []);

                // 3. If editing, fetch account details
                if (isEditing) {
                    const resCuenta = await axios.get(`http://localhost:3000/cuentas/form_cuenta/${id}`);
                    const data = resCuenta.data;
                    
                    // Handle direccion (if string or object)
                    let parsedDir = { pais: '', ciudad: '', codigoPostal: '', calle: '' };
                    if (data.direccion) {
                        try {
                            if (typeof data.direccion === 'string') {
                                // Try to parse as JSON, if fails, keep as string in calle
                                if (data.direccion.startsWith('{')) {
                                    parsedDir = { ...parsedDir, ...JSON.parse(data.direccion) };
                                } else {
                                    parsedDir.calle = data.direccion;
                                }
                            } else if (typeof data.direccion === 'object') {
                                parsedDir = { ...parsedDir, ...data.direccion };
                            }
                        } catch (e) {
                            parsedDir.calle = data.direccion;
                        }
                    }

                    setFormData({
                        correoID: data.correoID || '',
                        clave: data.clave || '',
                        cumpleaños: data.cumpleaños ? data.cumpleaños.split('T')[0] : '',
                        fechadesactivacion: data.fechadesactivacion ? data.fechadesactivacion.split('T')[0] : '',
                        saldo: data.saldo || '',
                        nick: data.nick || '',
                        plataforma: data.plataforma || 'PlayStation',
                        region: data.region || 'US',
                        semilla: data.semilla || '',
                        codigos2FA: data.codigos2FA || '',
                        direccion: parsedDir,
                        juegos: data.juegos || [] // Expecting IDs
                    });
                }
            } catch (err) {
                console.error("Error cargando datos del formulario:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('dir_')) {
            const field = name.replace('dir_', '');
            setFormData(prev => ({
                ...prev,
                direccion: { ...prev.direccion, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleJuego = (juegoId) => {
        setFormData(prev => {
            const juegos = prev.juegos.includes(juegoId)
                ? prev.juegos.filter(id => id !== juegoId)
                : [...prev.juegos, juegoId];
            return { ...prev, juegos };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Prepare payload
            const payload = { ...formData };
            // Stringify address as requested or as commonly done in this project
            // payload.direccion = JSON.stringify(formData.direccion); 

            if (isEditing) {
                await axios.patch(`http://localhost:3000/cuentas/form_cuenta/${id}`, payload);
            } else {
                await axios.post(`http://localhost:3000/cuentas/form_cuenta`, payload);
            }
            router.visit('/cuentas_juego');
        } catch (err) {
            console.error("Error guardando cuenta:", err);
            alert("No se pudo guardar la cuenta. Verifica los datos.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta cuenta? Esta acción es irreversible.")) return;
        setSubmitting(true);
        try {
            // Usually delete endpoint is same as update but DELETE or specific route
            await axios.delete(`http://localhost:3000/cuentas/form_cuenta/${id}`);
            router.visit('/cuentas_juego');
        } catch (err) {
            console.error("Error eliminando cuenta:", err);
            alert("Error al eliminar el registro.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Cargando Bóveda de Configuración...</p>
                </div>
            </MainLayout>
        );
    }

    const filteredJuegos = allJuegos.filter(j => 
        j.titulo.toLowerCase().includes(searchJuego.toLowerCase())
    );

    return (
        <MainLayout>
            <Head title={isEditing ? 'Editar Cuenta Juego' : 'Registrar Cuenta Juego'} />
            
            <div className="mb-8">
                <Link 
                    href="/cuentas_juego" 
                    className="inline-flex items-center gap-3 text-[11px] font-black uppercase text-gray-500 hover:text-white tracking-widest transition-all bg-[#161821] px-5 py-3 rounded-2xl border border-white/5 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-indigo-500" />
                    Regresar al Inventario
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                            <span>Manifiesto Maestro</span>
                            <span>/</span>
                            <span className="text-indigo-400 uppercase tracking-widest">{isEditing ? `Modificando ID #${id}` : 'Nueva Inserción'}</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter italic">
                            {isEditing ? 'Configurar Cuenta Juego' : 'Registrar Cuenta Juego'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-indigo-500/20"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEditing ? 'Guardar Cambios' : 'Registrar Matriz'}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Section: Account & Security */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Section 1: Core Data */}
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-2xl relative border-l-4 border-l-indigo-500">
                            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic">
                                <Database className="w-4 h-4" />
                                Parametrización de Credenciales
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                                        Correo Matriz Vinculado *
                                        <Link href="/correos/nuevo" className="text-indigo-400 hover:underline">Registrar Nuevo</Link>
                                    </label>
                                    <select 
                                        name="correoID"
                                        value={formData.correoID}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecciona el correo base...</option>
                                        {correos.map(correo => (
                                            <option key={correo.id} value={correo.id}>{correo.direccionCorreo}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Nickname (ID Público)</label>
                                    <input 
                                        type="text"
                                        name="nick"
                                        value={formData.nick}
                                        onChange={handleChange}
                                        placeholder="Ej. SolarWolf259"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold placeholder-gray-800 focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Clave de la Cuenta *</label>
                                    <div className="relative">
                                        <Key className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" />
                                        <input 
                                            type="text"
                                            name="clave"
                                            value={formData.clave}
                                            onChange={handleChange}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white font-mono font-bold focus:outline-none focus:border-indigo-500/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cumpleaños Registrado</label>
                                    <div className="relative">
                                        <Calendar className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" />
                                        <input 
                                            type="date"
                                            name="cumpleaños"
                                            value={formData.cumpleaños}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 appearance-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Saldo Inicial (Wallet)</label>
                                    <div className="relative">
                                        <DollarSign className="w-4 h-4 absolute left-6 top-1/2 -translate-y-1/2 text-gray-700" />
                                        <input 
                                            type="number"
                                            step="0.01"
                                            name="saldo"
                                            value={formData.saldo}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-emerald-400 font-black focus:outline-none focus:border-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2 space-y-3 pt-4 border-t border-white/2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha Estimada de Desactivación</label>
                                    <input 
                                        type="date"
                                        name="fechadesactivacion"
                                        value={formData.fechadesactivacion}
                                        onChange={handleChange}
                                        className="w-full md:w-1/2 bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-red-500/30"
                                    />
                                    <p className="text-[9px] font-black text-gray-700 uppercase italic">Mantener vacío si la cuenta es de stock permanente.</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Security & Region */}
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-10 shadow-2xl border-l-4 border-l-emerald-500">
                             <h2 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3 italic">
                                <ShieldCheck className="w-4 h-4" />
                                Blindaje y Regionalización
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plataforma Matriz *</label>
                                    <select 
                                        name="plataforma"
                                        value={formData.plataforma}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none appearance-none"
                                    >
                                        <option value="PlayStation">PlayStation Network</option>
                                        <option value="Xbox">Xbox Live</option>
                                        <option value="Steam">Steam (PC)</option>
                                        <option value="Nintendo">Nintendo Switch</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Región de Creación *</label>
                                    <select 
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none appearance-none"
                                    >
                                        <option value="US">Estados Unidos (US)</option>
                                        <option value="TR">Turquía (TR)</option>
                                        <option value="ES">España (ES)</option>
                                        <option value="AR">Argentina (AR)</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Semilla (Recovery Seed)</label>
                                    <textarea 
                                        name="semilla"
                                        value={formData.semilla}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="Ej: alpha zero tango..."
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-mono focus:outline-none resize-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Códigos Estáticos 2FA</label>
                                    <textarea 
                                        name="codigos2FA"
                                        value={formData.codigos2FA}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="3921-4922, 1293-8841..."
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-mono focus:outline-none resize-none italic"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-6">Ubicación de Facturación (Asociada)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-gray-600 uppercase">País</span>
                                        <input type="text" name="dir_pais" value={formData.direccion.pais} onChange={handleChange} placeholder="EE.UU." className="w-full bg-black/20 border border-white/2 rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-gray-600 uppercase">Ciudad</span>
                                        <input type="text" name="dir_ciudad" value={formData.direccion.ciudad} onChange={handleChange} placeholder="Miami" className="w-full bg-black/20 border border-white/2 rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-gray-600 uppercase">CP</span>
                                        <input type="text" name="dir_codigoPostal" value={formData.direccion.codigoPostal} onChange={handleChange} placeholder="33101" className="w-full bg-black/20 border border-white/2 rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-gray-600 uppercase">Calle / línea 1</span>
                                        <input type="text" name="dir_calle" value={formData.direccion.calle} onChange={handleChange} placeholder="123 NW 1st Ave" className="w-full bg-black/20 border border-white/2 rounded-xl px-4 py-3 text-xs text-white focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        {isEditing && (
                            <div className="bg-red-500/5 border border-red-500/10 rounded-4xl p-10 mt-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase italic">Protocolo de Eliminación</h3>
                                        <p className="text-[10px] text-red-400/50 font-bold uppercase tracking-widest mt-0.5">ESTA ACCIÓN ES PERMANENTE Y BORRARÁ TODA RELACIÓN CONTABLE</p>
                                    </div>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleDelete}
                                    className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-600/20"
                                >
                                    Eliminar Registro Definitivamente
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Section: Games Assignment */}
                    <div className="lg:col-span-4 lg:sticky lg:top-10">
                        <div className="bg-[#161821] border border-white/5 rounded-4xl p-8 shadow-2xl flex flex-col h-full max-h-[85vh] border-t-4 border-t-indigo-500 shadow-indigo-500/5">
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2 italic">Asignación</h2>
                            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Catálogo de Juegos</h3>
                            
                            <div className="relative mb-6">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input 
                                    type="text"
                                    value={searchJuego}
                                    onChange={(e) => setSearchJuego(e.target.value)}
                                    placeholder="Localizar título..."
                                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none italic"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-6">
                                {filteredJuegos.map(juego => {
                                    const isSelected = formData.juegos.includes(juego.id);
                                    return (
                                        <div 
                                            key={juego.id}
                                            onClick={() => toggleJuego(juego.id)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${isSelected ? 'bg-indigo-600/20 border-indigo-500/50' : 'bg-white/2 border-white/5 hover:border-gray-700'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-500 text-white animate-in zoom-in-50' : 'bg-black/60 text-gray-800'}`}>
                                                    <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                                </div>
                                                <div>
                                                    <span className={`text-[11px] font-bold block leading-none mb-1 transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{juego.titulo}</span>
                                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic truncate max-w-[120px]">Cod #{juego.id}</span>
                                                </div>
                                            </div>
                                            {isSelected && <X className="w-3.5 h-3.5 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />}
                                        </div>
                                    );
                                })}
                                {filteredJuegos.length === 0 && (
                                    <div className="py-20 text-center opacity-20">
                                       <Database className="w-10 h-10 mx-auto mb-4" />
                                       <p className="text-[10px] font-black uppercase">Sin resultados</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/5 mt-auto">
                                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 flex justify-between">
                                    <span>Títulos Vinculados:</span>
                                    <span className="text-white">{formData.juegos.length} / {allJuegos.length}</span>
                                </div>
                                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-indigo-500 transition-all duration-500" 
                                        style={{ width: `${(formData.juegos.length / Math.max(1, allJuegos.length)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    );
}
