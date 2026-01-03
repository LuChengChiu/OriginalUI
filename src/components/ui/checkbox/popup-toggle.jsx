import CheckPath from "./check-path";

/**
 * PopupToggle - Styled toggle card for popup UI
 * Used in the extension popup for quick toggle actions with visual feedback
 *
 * @param {Object} props
 * @param {string} id - Required ID for label association
 * @param {string|ReactNode} label - Label text or JSX to display
 * @param {boolean} checked - Whether the toggle is checked
 * @param {boolean} disabled - Whether the toggle is disabled
 * @param {Function} onChange - Callback when toggle changes (receives boolean value)
 * @param {string} className - Additional CSS classes for the container
 */
export default function PopupToggle({
  id,
  label,
  checked = false,
  disabled = false,
  onChange,
  className = "",
}) {
  return (
    <label
      className={`relative flex justify-center items-center cursor-pointer select-none w-[9.6rem] h-9 border border-secondary rounded-sm
        font-days-one text-[12.5px] gap-x-2
        ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
        } transition-all duration-300 rounded-lg ${
        checked ? "bg-primary" : "bg-white"
      } ${className}`}
      htmlFor={id}
    >
      <CheckPath
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={`!absolute left-3 ${
          checked ? "opacity-100" : "opacity-0"
        }`}
      />

      <span
        className={`absolute top-1/2 duration-300 -translate-y-1/2 -translate-x-1/2 text-nowrap flex items-center gap-1 ${
          checked ? "left-[calc(50%+10px)] text-white" : "left-1/2"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
