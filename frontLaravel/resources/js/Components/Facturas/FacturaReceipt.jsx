import React from 'react';
import PropTypes from 'prop-types';

export default function FacturaReceipt({ factura, viewMode = 'admin', onCopy }) {
    if (!factura) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const precioVenta = Number.parseFloat(factura.precioVenta) || 0;
    const precioCompra = Number.parseFloat(factura.precioCompra) || 0;
    const margenNeto = precioVenta - precioCompra;

    const getTypeBadgeStyles = (tipo) => {
        const type = (tipo || '').toLowerCase();
        if (type === 'primaria') return 'bg-indigo-100 text-indigo-700';
        if (type === 'secundaria') return 'bg-emerald-100 text-emerald-700';
        return 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="receipt-container bg-white text-gray-900 rounded-3xl p-10 shadow-2xl font-['Inter'] mx-auto border border-gray-200">
            {/* Header del Recibo */}
            <div className="receipt-header flex justify-between border-b-2 border-gray-200 pb-6 mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 m-0">FACTURA COMERCIAL</h2>
                    <div className="text-gray-500 text-sm mt-2 font-medium">
                        PS VirtualStore
                    </div>
                </div>
                <div className="text-right text-gray-500 text-sm">
                    <div className="text-xl font-bold text-gray-900 mb-1">Nº DOC: #{String(factura.id).padStart(4, '0')}</div>
                    <div>Fecha de Emisión: {formatDate(factura.fecha)}</div>
                    <div>Estado: <span className="text-emerald-600 font-semibold">Completado / Pagado</span></div>
                </div>
            </div>

            {/* Grilla Info Cliente vs Admin */}
            <div className={`grid ${viewMode === 'admin' ? 'grid-cols-1 md:grid-cols-2 print:grid-cols-2' : 'grid-cols-1'} gap-6 mb-8`}>
                {/* Box Cliente */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wide">Facturado a (Cliente)</div>
                    {factura.cliente ? (
                        <>
                            <div className="text-base font-semibold text-gray-900 mb-1">{factura.cliente.nombres}</div>
                            <div className="text-gray-600 text-sm">Identificador de Sistema: #{String(factura.cliente.id).padStart(3, '0')}</div>
                            <div className="text-gray-600 text-sm">Medio de Contacto: {factura.cliente.red || 'No definido'} ({factura.cliente.telefono || 'N/A'})</div>
                            <div className="text-gray-600 text-sm">Correo: {factura.cliente.correo || 'N/A'}</div>
                        </>
                    ) : (
                        <div className="text-gray-500 text-sm">Datos del cliente no disponibles</div>
                    )}
                </div>

                {/* Box Admin */}
                {viewMode === 'admin' && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <div className="text-xs font-semibold uppercase text-blue-800 mb-3 tracking-wide">Administración (Interno)</div>
                        <div className="flex justify-between mb-2">
                            <span className="text-blue-500 text-sm">Costo de Compra Original:</span>
                            <span className="text-blue-900 font-semibold">$ {precioCompra.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-blue-500 text-sm">Precio de Venta al Cliente:</span>
                            <span className="text-blue-900 font-semibold">$ {precioVenta.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                            <span className="text-blue-800 font-semibold text-sm">Beneficio (Margen Neto):</span>
                            <span className={`font-bold ${margenNeto >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {margenNeto >= 0 ? '+' : '-'} $ {Math.abs(margenNeto).toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabla de Productos */}
            <div className="mb-8">
                <div className="text-xs font-semibold uppercase text-gray-500 mb-3 tracking-wide">Detalle de Producto y Categorización</div>
                <table className="w-full border-collapse mt-4">
                    <thead>
                        <tr>
                            <th className="text-left p-3 bg-gray-100 text-gray-700 font-semibold text-sm border-b-2 border-gray-200">Título Relacionado</th>
                            <th className="text-left p-3 bg-gray-100 text-gray-700 font-semibold text-sm border-b-2 border-gray-200">Plataforma</th>
                            {viewMode === 'admin' && (
                                <th className="text-left p-3 bg-gray-100 text-gray-700 font-semibold text-sm border-b-2 border-gray-200">Tipo (Formato)</th>
                            )}
                            <th className="text-right p-3 bg-gray-100 text-gray-700 font-semibold text-sm border-b-2 border-gray-200">Precio de Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-4 border-b border-gray-200 text-gray-900 text-base">
                                <strong>{factura.titulo_juego || 'N/A'}</strong>
                                {viewMode === 'admin' && (
                                    <div className="text-xs text-gray-500 mt-1">*Incluido en la lista de juegos de la cuenta*</div>
                                )}
                            </td>
                            <td className="p-4 border-b border-gray-200 text-gray-900 text-base">{factura.plataforma || 'N/A'}</td>
                            {viewMode === 'admin' && (
                                <td className="p-4 border-b border-gray-200 text-gray-900 text-base">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeBadgeStyles(factura.tipo)}`}>
                                        {factura.tipo || 'N/A'}
                                    </span>
                                </td>
                            )}
                            <td className="text-right p-4 border-b border-gray-200 font-semibold text-gray-900 text-base">$ {precioVenta.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Totales */}
                <div className="mt-6 flex flex-col items-end gap-2">
                    <div className="flex justify-between w-64 text-sm text-gray-600">
                        <span>Subtotal:</span>
                        <span>$ {precioVenta.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between w-64 text-sm text-gray-600">
                        <span>Cargos e Impuestos:</span>
                        <span>$ 0.00</span>
                    </div>
                    <div className="flex justify-between w-64 text-xl font-bold text-gray-900 border-t-2 border-gray-900 pt-3 mt-1">
                        <span>Total Pagado:</span>
                        <span>$ {precioVenta.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Sensitive Data Box */}
            <div className="bg-red-50 border border-dashed border-red-500 p-4 rounded-xl mt-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-red-700 text-sm font-semibold m-0">Credenciales de Entrega {viewMode === 'admin' && '(Snapshot Histórico)'}</h3>
                    <button 
                        onClick={(e) => onCopy(e, `Correo: ${factura.correo}\nClave: ${factura.clave}`)}
                        className="bg-white text-red-500 border border-red-300 px-3 py-1.5 rounded text-xs hover:bg-red-50 font-semibold transition-colors print-hide"
                    >
                        Copiar Entrega
                    </button>
                </div>
                {viewMode === 'admin' && (
                    <p className="text-red-900 text-sm mb-4">
                        Estos datos `correo` y `clave` representan una copia estática del momento en que se generó la venta. Los cambios no modificarán estos datos históricos.
                    </p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 mt-2">
                    <div>
                        <span className="block text-xs text-red-800 font-semibold mb-1">Correo Facilitado:</span>
                        <div className="font-mono text-base text-red-950 bg-red-100 p-2.5 border border-red-200 rounded break-all">
                            {factura.correo || 'No registrado'}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs text-red-800 font-semibold mb-1">Clave Facilitada:</span>
                        <div className="font-mono text-base text-red-950 bg-red-100 p-2.5 border border-red-200 rounded break-all">
                            {factura.clave || 'No registrado'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

FacturaReceipt.propTypes = {
    factura: PropTypes.shape({
        id: PropTypes.number,
        fecha: PropTypes.string,
        precioVenta: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        precioCompra: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        cliente: PropTypes.shape({
            id: PropTypes.number,
            nombres: PropTypes.string,
            red: PropTypes.string,
            telefono: PropTypes.string,
            correo: PropTypes.string,
        }),
        titulo_juego: PropTypes.string,
        plataforma: PropTypes.string,
        tipo: PropTypes.string,
        correo: PropTypes.string,
        clave: PropTypes.string,
    }).isRequired,
    viewMode: PropTypes.oneOf(['admin', 'client']),
    onCopy: PropTypes.func.isRequired,
};
