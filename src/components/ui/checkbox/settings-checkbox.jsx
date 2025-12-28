import Checkbox from ".";

/**
 * SettingsCheckbox - Traditional checkbox with label, description, and optional children
 * Used primarily in the settings page for form controls
 *
 * @param {Object} props
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {boolean} disabled - Whether the checkbox is disabled
 * @param {Function} onChange - Callback when checkbox changes (receives boolean value)
 * @param {string|ReactNode} label - Label text or JSX
 * @param {string} description - Optional description text
 * @param {ReactNode} children - Optional children content for additional details
 * @param {string} className - Additional CSS classes for the container
 */
export default function SettingsCheckbox({
  checked = false,
  disabled = false,
  onChange,
  label,
  description,
  children,
  className = "",
  ...props
}) {
  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked, e);
    }
  };

  return (
    <div className={`flex items-start gap-2 ${className}`} {...props}>
      <Checkbox
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="flex flex-col pt-0 items-start">
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
        {Boolean(children) && children}
      </div>
    </div>
  );
}
