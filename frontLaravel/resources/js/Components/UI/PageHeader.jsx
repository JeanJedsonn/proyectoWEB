import React from 'react';
import PropTypes from 'prop-types';

/**
 * PageHeader component for all views.
 * Standardized based on the Inventory and Dashboard style.
 */
const PageHeader = ({ 
    title = '', 
    description = '', 
    icon: Icon = null, 
    topLabel = '',  
    breadcrumbs = [], 
    children = null, 
    className = '' 
}) => {
    return (
        <header className={`mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 ${className}`}>
            <div className="flex-1">
                {/* Top Label o Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{topLabel}</span>
                    
                    {breadcrumbs.length > 0 && (
                        <>
                            <span className="mx-1 text-gray-800">/</span>
                            {breadcrumbs.map((crumb, idx) => (
                                <React.Fragment key={`${crumb.label}-${idx}`}>
                                    {crumb.href ? (
                                        <a href={crumb.href} className="hover:text-indigo-400 transition-colors">{crumb.label}</a>
                                    ) : (
                                        <span className="text-white/40">{crumb.label}</span>
                                    )}
                                    {idx < breadcrumbs.length - 1 && <span className="mx-1 text-gray-800">/</span>}
                                </React.Fragment>
                            ))}
                        </>
                    )}
                </div>
                
                <h1 className="text-2xl font-extrabold text-white tracking-tighter leading-none">
                    {title}
                </h1>
                
                {description && (
                    <p className="text-gray-400 text-sm mt-3 font-medium">
                        {description}
                    </p>
                )}
            </div>

            {/* Actions / Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {children}
            </div>
        </header>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.elementType,
    topLabel: PropTypes.string,
    breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        href: PropTypes.string
    })),
    children: PropTypes.node,
    className: PropTypes.string
};

export default PageHeader;
