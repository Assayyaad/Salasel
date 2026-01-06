"use client";
import React from 'react';
import FilterButton from './FilterButton';

const filters = [
    "تصنيف 1", "تصنيف 2", "تصنيف 3", "تصنيف 4", "تصنيف 5", 
    "تصنيف 6", "تصنيف 7", "تصنيف 8", "تصنيف 9"
];

const FilterGrid = () => {
    return (
        <div className="relative mb-12">
            <div 
                aria-label="Content filters" 
                className="flex flex-wrap justify-center gap-3" 
                role="group"
            >
                {filters.map((filter, index) => (
                    <FilterButton 
                        key={filter}
                        text={filter}
                        isActive={index === 0}
                    />
                ))}
            </div>
        </div>
    );
};

export default FilterGrid;
