export default function CheckPath({
  checked = false,
  disabled = false,
  id,
  className = "",
  onChange,
  ...props
}) {
  const handleChange = (e) => {
    const newChecked = e.target.checked;
    onChange?.(newChecked);
  };

  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="absolute opacity-0 pointer-events-none"
        {...props}
      />
      <div
        className={`
        relative w-6 h-6 rounded-lg transition-all duration-200
        ${!disabled && "active:scale-95"} ${className}
      `}
      >
        <svg
          className="absolute inset-0 m-auto w-4/5 h-4/5 text-white transition-all duration-400 z-10"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            className={`
              transition-all duration-300 delay-100
              ${checked ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:40]"}
            `}
            style={{
              strokeDasharray: "40",
              strokeDashoffset: checked ? "0" : "40",
            }}
            d="M4 12L10 18L20 6"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
