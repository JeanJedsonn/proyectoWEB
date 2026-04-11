import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Custom Select component for forms with premium styling.
 * Based on the project's standard filter style.
 */
export default function Select({ 
    label = '', 
    name = '', 
    value = '', 
    onChange, 
    options = [], 
    placeholder = 'Selecciona una opción...', 
    error = '', 
    hint = '', 
    required = false,
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value || String(opt.value) === String(value));

    // Simular un evento nativo para mantener la compatibilidad con los controladores comunes
    const handleSelect = (optionValue) => {
        onChange({ target: { name, value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div className={`space-y-3 ${className}`} ref={containerRef}>
            {label && (
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2 px-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <div className="relative group/select">
                {/* Select Trigger (boton) */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-[#161821] border ${isOpen ? 'border-indigo-500/50' : 'border-white/5'} rounded-2xl px-6 py-4 text-sm font-bold text-left flex justify-between items-center transition-all hover:bg-black/40 shadow-xl ${error ? 'border-red-500/30' : ''}`}
                >
                    <span className={`truncate ${selectedOption ? 'text-white' : 'text-gray-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>

                {/* Options List (Dropdown personalizado) */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#161821] border border-white/10 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.6)] overflow-hidden origin-top">
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                            {options.map((opt) => {
                                const isSelected = selectedOption?.value === opt.value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all mb-1 last:mb-0 ${
                                            isSelected 
                                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                            {options.length === 0 && (
                                <div className="p-4 text-center text-[10px] font-bold text-gray-700 uppercase italic">
                                    Sin opciones disponibles
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {(error || hint) && (
                <p className={`text-[9px] font-black uppercase italic px-1 ${error ? 'text-red-500' : 'text-gray-700'}`}>
                    {error || hint}
                </p>
            )}
        </div>
    );
}
