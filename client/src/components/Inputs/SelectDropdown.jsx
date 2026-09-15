import { useEffect, useRef, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

const SelectDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-sm bg-white border px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${
          isOpen
            ? 'border-slate-800 ring-2 ring-slate-900/10 shadow-sm'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span
          className={`truncate ${selectedOption ? 'text-slate-800 font-medium' : 'text-slate-400'}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <LuChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-100 rounded-lg shadow-xl shadow-slate-900/10 z-50 max-h-60 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {options.length > 0 ? (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3.5 py-2 text-sm transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })
          ) : (
            <div className="px-3.5 py-2 text-xs text-slate-400 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
