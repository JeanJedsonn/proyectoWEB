import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

/**
 * Button component for form actions and navigation.
 * Standardized based on the Project Dashboard style.
 * 
 * @param {string} variant - 'primary', 'secondary', 'danger', 'ghost', 'outline'
 * @param {string} size - 'sm', 'md', 'lg'
 */
const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'md', 
    disabled = false, 
    loading = false, 
    type = 'button',
    icon: Icon = null,
    className = '',
    ...props
}) => {
    const variants = {
        primary: 'bg-[#6366f1] hover:bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/20 border-transparent',
        secondary: 'bg-white/5 hover:bg-white/10 text-white border-white/5 shadow-sm',
        danger: 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20 shadow-lg shadow-red-500/10',
        ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border-transparent',
        outline: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border-white/10'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
        md: 'px-4 py-2.5 text-sm font-medium gap-2',
        lg: 'px-6 py-3.5 text-base font-semibold gap-3'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : Icon && (
                <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-transform group-hover:scale-110`} />
            )}
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    icon: PropTypes.elementType,
    className: PropTypes.string
};

export default Button;
