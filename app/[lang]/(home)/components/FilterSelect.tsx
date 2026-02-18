import React from 'react'

export interface FilterOption {
  key: string
  value: string
}

export interface FilterSelectProps {
  id: string
  label: string
  value: string | number
  onChange: (value: string) => void
  options: FilterOption[]
  showAllOption?: boolean
  allOptionLabel?: string
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  showAllOption = false,
  allOptionLabel,
}) => {
  const dropdownClass =
    'px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer'

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-slate-400 text-center">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={dropdownClass}>
        {showAllOption && <option value="all">{allOptionLabel}</option>}
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.value}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FilterSelect
