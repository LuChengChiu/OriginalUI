import CheckPath from "./check-path";

export default function PopupCheckCard({
  id,
  label,
  checked,
  disabled,
  className,
  onChange,
}) {
  return (
    <label
      className={`relative flex justify-center items-center cursor-pointer select-none w-[9.6rem] h-9 border border-secondary rounded-sm
              font-days-one text-[12.5px] gap-x-2
              ${
                disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              } transition-all duration-300 rounded-lg ${
        checked ? "bg-primary" : "bg-white"
      } ${className || ""}`}
      htmlFor={id}
    >
      <CheckPath
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className={`!absolute left-3 ${checked ? "opacity-100" : "opacity-0"}`}
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
