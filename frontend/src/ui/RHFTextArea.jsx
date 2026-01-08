import { useFormContext } from "react-hook-form";

function RHFTextArea({
  label,
  name,
  dir = "rtl",
  isRequired = false,
  errors,
  register,
  ...rest
}) {
  return (
    <div className="textField">
      <label htmlFor={name} className="text-secondary-600 text-sm">
        {label}
        {isRequired && <span className="text-error">*</span>}
      </label>
      <textarea
        {...register(name)}
        id={name}
        dir={dir}
        className={`textField__input mt-2 min-h-[150px] leading-8 ${
          dir === "ltr" ? "text-left" : "text-right"
        } ${errors[name] ? "border-error" : ""}`}
        {...rest}
      ></textarea>
      {errors[name] && (
        <span className="text-error text-sm mt-1 block">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}

export default RHFTextArea;

