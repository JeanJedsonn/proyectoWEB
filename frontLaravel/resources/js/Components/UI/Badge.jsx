import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge component for statuses and tags.
 * @param {string} variant - 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'outline'
 */
const Badge = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-indigo-500/10',
        secondary: 'bg-white/5 text-gray-400 border-white/5 shadow-white/5',
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10',
        danger: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/10',
        info: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10',
        warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/10',
        outline: 'bg-transparent text-gray-400 border-white/10'
    };

    return (
        <span className={`px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg inline-flex items-center gap-2 ${variants[variant] || variants.primary} ${className}`}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'info', 'warning', 'outline']),
    className: PropTypes.string
};

export default Badge;
