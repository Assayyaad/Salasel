"use client";
import React from 'react';

interface FilterButtonProps {
    text: string;
    isActive: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ text, isActive }) => {
    const activeClasses = "bg-primary text-white shadow-md hover:bg-primary-hover";
    const inactiveClasses = "bg-slate-800 text-slate-300 hover:bg-slate-700";

    return (
        <button 
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                isActive ? activeClasses : inactiveClasses
            }`}
        >
            {text}
        </button>
    );
};

export default FilterButton;
