import React from 'react';
import { Link } from '@inertiajs/react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * GameCard component for the catalog grid.
 * @param {Object} juego - The game data object.
 */
export default function GameCard({ juego }) {
    return (
        <div className="bg-[#161821] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.15)] transition-all duration-500 group flex flex-col relative">
            <div className="aspect-3/4 relative overflow-hidden bg-[#0b0d12] flex items-center justify-center">
                {juego.url ? (
                    <img 
                        src={juego.url} 
                        alt={juego.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/300x400/161821/52525b.png?text=Sin+Imagen';
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-800">
                        <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-[10px] font-black uppercase tracking-widest">No Meta</span>
                    </div>
                )}
                
                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-linear-to-t from-[#0b0d12] via-[#0b0d12]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <Link 
                        href={`/juegos/${juego.id}`} 
                        className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-2xl transition-all shadow-2xl block border border-indigo-500/20"
                    >
                        Explorar Título
                    </Link>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 
                    className="font-black text-gray-200 text-xs line-clamp-2 leading-tight uppercase tracking-tight group-hover:text-indigo-400 transition-colors" 
                    title={juego.titulo}
                >
                    {juego.titulo}
                </h3>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic shadow-sm">UID: {String(juego.id).padStart(4, '0')}</span>
                </div>
            </div>
        </div>
    );
}
