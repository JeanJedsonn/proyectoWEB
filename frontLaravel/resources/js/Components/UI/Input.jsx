import React from 'react';
import { Search } from 'lucide-react';

/**
 * FormInput component for all text, password, and number inputs.
 * Standardized based on the Project's search and filter style.
 */
export default function Input({ 
    label = '', 
    name = '', 
    value = '', 
    onChange, 
    type = 'text', 
    placeholder = '', 
    error = '', 
    hint = '', 
    icon: Icon = null, 
    className = '', 
    required = false,
    variant = 'default',
    ...props
}) {
    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1 px-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <div className="relative group/input">
                {Icon && (
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-indigo-400 transition-colors">
                        <Icon className="w-5 h-4.5" />
                    </div>
                )}
                
                <input 
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className={`w-full ${variant === 'dark' ? 'bg-[#0b0d12]' : 'bg-[#161821]'} border border-white/5 rounded-2xl py-4 text-sm text-white font-bold placeholder-gray-700 focus:outline-none focus:border-indigo-500/50 transition-all shadow-2xl ${Icon ? 'pl-14 pr-6' : 'px-6'} ${error ? 'border-red-500/30' : ''}`}
                    {...props}
                />
            </div>
            
            {(error || hint) && (
                <p className={`text-[9px] font-black uppercase px-1 ${error ? 'text-red-500' : 'text-gray-700'}`}>
                    {error || hint}
                </p>
            )}
        </div>
    );
}
