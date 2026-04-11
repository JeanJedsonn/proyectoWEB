import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component for data tables.
 */
export default function Pagination({ 
    page = 1, 
    lastPage = 1, 
    total = 0, 
    onPageChange, 
    className = '',
    label = 'juegos'
}) {
    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between bg-[#161821] border border-white/5 px-4 py-2 rounded-2xl gap-6 shadow-2xl relative ${className}`}>
            
            {/* Info de paginación */}
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                Mostrando <span className="text-white bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">{page}</span> 
                <span className="mx-2">de</span> 
                <span className="text-white bg-white/5 px-2 py-1 rounded-lg border border-white/5">{lastPage}</span>
                <span className="mx-4 text-gray-800 font-normal">|</span>
                <span className="text-indigo-400">{total}</span> <span className="opacity-40">{label} totales</span>
            </span>
            
            {/* Botones de paginación */}
            <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                {/* Botón de página anterior */}
                <button 
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-5 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${page === 1 ? 'text-gray-700 cursor-not-allowed opacity-30' : 'text-gray-400 hover:bg-indigo-500 hover:text-white hover:shadow-lg shadow-indigo-500/30'}`}
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Anterior
                </button>

                {/* Separador */}
                <div className="w-px h-6 bg-white/5 mx-2"></div>

                {/* Botón de página siguiente */}
                <button 
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === lastPage || lastPage === 0}
                    className={`px-5 py-3 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${page === lastPage || lastPage === 0 ? 'text-gray-300 cursor-not-allowed opacity-30' : 'text-gray-300 hover:bg-indigo-500 hover:text-white hover:shadow-lg shadow-indigo-500/30'}`}
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}
