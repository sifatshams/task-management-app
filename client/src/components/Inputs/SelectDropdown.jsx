import { useEffect, useRef, useState } from 'react';
import { LuCheck, LuChevronDown } from 'react-icons/lu';

const SelectDropdown = ({ options = [], value, onChange, placeholder }) => {
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
      {/* dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-sm bg-white/80 backdrop-blur-sm border px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 focus:outline-none cursor-pointer mt-2 ${
          isOpen
            ? 'border-slate-800 ring-4 ring-slate-900/5 shadow-md bg-white'
            : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <span
          className={`truncate font-medium tracking-wide ${
            selectedOption ? 'text-slate-800' : 'text-slate-400'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <LuChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ease-in-out shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-slate-800' : ''
          }`}
        />
      </button>

      {/* dropdown menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md border border-slate-100 rounded-xl shadow-2xl shadow-slate-900/10 z-50 max-h-60 overflow-y-auto p-1.5 transition-all duration-200 ease-out">
          {options.length > 0 ? (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3.5 py-2.5 my-0.5 text-sm rounded-lg transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 active:scale-[0.99]'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <LuCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 text-xs font-medium text-slate-400 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
