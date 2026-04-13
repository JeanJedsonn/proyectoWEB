import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { 
    Printer, ArrowLeft, Loader2, ShieldAlert, Eye, Download, FileCheck
} from 'lucide-react';
import Toast from '@/Components/UI/Toast';
import Button from '@/Components/UI/Button';
import FacturaReceipt from '@/Components/Facturas/FacturaReceipt';
import PageHeader from '@/Components/UI/PageHeader';

export default function FacturaShow({ id }) {
    const [factura, setFactura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCopyMsg, setShowCopyMsg] = useState(false);
    const [copyMsgText, setCopyMsgText] = useState('Copiado al portapapeles');
    // Estado para alternar entre la versión de administrador (completa) y cliente (reducida)
    const [viewMode, setViewMode] = useState('admin');

    useEffect(() => {
        const fetchFactura = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:3000/facturas/leer_factura/${id}`);
                setFactura(res.data);
            } catch (err) {
                console.error("Error cargando factura:", err);
                setError("No se pudo cargar la información de la factura solicitada.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchFactura();
    }, [id]);

    const handleCopy = (e, text, customMsg = 'Copiado al portapapeles') => {
        if (e) e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            setCopyMsgText(customMsg);
            setShowCopyMsg(true);
            setTimeout(() => setShowCopyMsg(false), 2000);
        });
    };

    const handlePrint = () => {
        globalThis.print();
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'admin' ? 'client' : 'admin');
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs italic">Generando Recibo...</p>
                </div>
            );
        }

        if (error || !factura) {
            return (
                <div className="bg-[#161821] border border-white/5 rounded-4xl p-16 text-center shadow-2xl max-w-3xl mx-auto">
                    <ShieldAlert className="w-16 h-16 text-red-500/20 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Factura no localizada</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
                        {error || "La factura que intentas visualizar ha sido removida o su identificador es incorrecto."}
                    </p>
                    <Link href="/facturas" className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border border-white/5">
                        <ArrowLeft className="w-4 h-4" />
                        Regresar al Historial
                    </Link>
                </div>
            );
        }

        return (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <style>{`
                    @media print {
                        body { background: white !important; }
                        aside, nav, header:not(.receipt-header) { display: none !important; }
                        main { margin: 0 !important; padding: 0 !important; background: white !important; }
                        .print-hide { display: none !important; }
                        .receipt-container { box-shadow: none !important; margin: 0 !important; padding: 20px !important; width: 100% !important; max-width: 100% !important; border: none !important; }
                    }
                `}</style>
                
                {/* Cabecera Estandarizada: Alineada con el layout global */}
                <PageHeader
                    title={`Recibo Digital #${String(factura.id).padStart(4, '0')}`}
                    description="Resumen detallado de transacción y reporte de margen neto."
                    icon={FileCheck}
                    breadcrumbs={[
                        { label: 'Facturas', href: '/facturas' },
                        { label: 'Visualización' }
                    ]}
                    className="print-hide"
                >
                    <Button 
                        variant="secondary" 
                        icon={ArrowLeft} 
                        onClick={() => router.visit('/facturas')}
                    >
                        Volver
                    </Button>

                    <button 
                        onClick={toggleViewMode}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            viewMode === 'admin' 
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                    >
                        <Eye className="w-4 h-4" />
                        {viewMode === 'admin' ? 'Vendedor' : 'Cliente'}
                    </button>

                    <Button variant="secondary" icon={Printer} onClick={handlePrint}>
                        Imprimir
                    </Button>

                    <Button variant="primary" icon={Download} onClick={handlePrint}>
                        PDF
                    </Button>
                </PageHeader>

                {/* Recibo Centrado */}
                <div className="max-w-4xl mx-auto pb-20">
                    <FacturaReceipt 
                        factura={factura} 
                        viewMode={viewMode} 
                        onCopy={handleCopy} 
                    />
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <Head title={`Factura #${factura?.id || 'Cargando...'}`} />
            
            {renderContent()}

            <Toast 
                show={showCopyMsg}
                message={copyMsgText}
                variant="copy"
                onClose={() => setShowCopyMsg(false)}
            />
        </MainLayout>
    );
}
