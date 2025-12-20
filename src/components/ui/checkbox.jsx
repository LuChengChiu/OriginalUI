const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  color = "purple",
  label,
  description,
  error = false,
  className = "",
  children,
  ...props
}) => {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked, e);
    }
  };

  const CheckboxComponent = () => (
    <label
      className={`block cursor-pointer w-[30px] h-[30px] border-[3px] border-transparent rounded-[10px] relative overflow-hidden transition-all duration-300 ease-in-out shadow-[0_0_0_2px_white] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      style={{
        backgroundColor: checked ? "#e8e8e8" : "#212121"
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="absolute left-[50px] invisible"
        {...props}
      />
      <div
        className={`w-[60px] h-[60px] bg-white absolute transform rotate-45 z-[100] transition-all duration-300 ease ${
          checked ? "top-[-10px] left-[-10px]" : "top-[-52px] left-[-52px]"
        }`}
      />
    </label>
  );

  if (label || description || children) {
    return (
      <div className={`flex items-start space-x-3 ${className}`}>
        <CheckboxComponent />
        <div className="flex-1">
          {label && (
            <label
              className={`block text-sm font-medium font-barlow ${
                disabled ? "text-gray-400" : "text-gray-700"
              } cursor-pointer`}
              onClick={() => !disabled && onChange?.(!checked)}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={`text-xs mt-1 font-barlow ${
                disabled ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-2">{children}</div>}
          {error && typeof error === "string" && (
            <p className="text-xs text-red-600 mt-1 font-barlow">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return <CheckboxComponent />;
};

export default Checkbox;
