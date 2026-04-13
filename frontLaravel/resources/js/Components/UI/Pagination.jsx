import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component for data tables.
 */
const Pagination = ({ 
    page = 1, 
    lastPage = 1, 
    total = 0, 
    perPage = 10,
    onPageChange, 
    className = '',
    label = 'registros'
}) => {
    return (
        <div className={`px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            <span className="text-sm text-gray-500">
                Mostrando <span className="text-white font-medium">{(page - 1) * perPage + (total > 0 ? 1 : 0)}</span> a <span className="text-white font-medium">{Math.min(page * perPage, total)}</span> de <span className="text-white font-medium">{total}</span> {label}
            </span>
            
            <div className="flex items-center gap-2">
                <button 
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className={`p-2 rounded-lg border border-white/5 transition-all ${page === 1 ? 'bg-white/5 text-gray-700 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex items-center gap-1">
                    <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-sm font-bold border border-indigo-500/20">
                        {page}
                    </span>
                    <span className="text-gray-600 text-sm mx-1">de</span>
                    <span className="px-3 py-1.5 bg-white/5 text-gray-400 rounded-lg text-sm font-medium border border-white/5">
                        {lastPage}
                    </span>
                </div>

                <button 
                    disabled={page === lastPage || lastPage === 0}
                    onClick={() => onPageChange(page + 1)}
                    className={`p-2 rounded-lg border border-white/5 transition-all ${page === lastPage || lastPage === 0 ? 'bg-white/5 text-gray-700 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'}`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    page: PropTypes.number,
    lastPage: PropTypes.number,
    total: PropTypes.number,
    perPage: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    label: PropTypes.string
};

export default Pagination;
