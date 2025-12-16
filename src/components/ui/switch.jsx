const Switch = ({ checked = false, onChange, disabled = false }) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="opacity-0 w-0 h-0"
      />
      <span 
        className={`
          absolute inset-0 border-2 rounded-full transition-all duration-400 ease-out
          before:absolute before:content-[''] before:h-6 before:w-6 before:left-1 before:bottom-1 
          before:bg-white before:rounded-full before:transition-transform before:duration-400 before:ease-out
          ${checked 
            ? 'border-blue-600 shadow-[0_0_20px_rgba(9,117,241,0.8)]' 
            : 'border-gray-500'
          }
          ${checked 
            ? 'before:translate-x-6' 
            : 'before:translate-x-0'
          }
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'
          }
        `}
      />
    </label>
  );
};

export default Switch;
