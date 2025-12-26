export default function Toggle({
  checked = false,
  onChange,
  disabled = false,
}) {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className="relative inline-block">
      <input
        type="checkbox"
        className="peer appearance-none h-8 w-14 bg-white rounded-sm cursor-pointer"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="absolute top-1/2 -translate-y-3/5 translate-x-0.5 h-6 w-7 bg-red-600/30 rounded-sm transition-all duration-300 ease-in-out peer-checked:translate-x-6 peer-checked:bg-[#9647eb]"></div>
    </label>
  );
}
