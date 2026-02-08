const btnType = {
  primary:
    "bg-primary-100 text-primary-700 hover:bg-primary-900 hover:text-white active:scale-95",
  secondary:
    "bg-secondary-200  text-secondary-500 hover:bg-secondary-500 hover:text-secondary-0 active:scale-95",
  outline:
    "border border-secondary-200 text-secondary-500 hover:bg-secondary-200 active:scale-95",
  red: "bg-red-100  text-red-500 hover:bg-red-500 hover:text-white active:scale-95",
  danger: "border border-red-100 text-red-500",
};

const sizeClass = {
  sm: "p-1 gap-x-1 rounded-md [&>svg]:w-4 [&>svg]:h-4 text-xs lg:text-sm",
  touch:
    "min-h-[44px] min-w-[44px] p-2.5 gap-x-2 rounded-xl [&>svg]:w-5 [&>svg]:h-5 text-sm md:min-h-[36px] md:min-w-[36px] md:p-2 md:gap-x-1.5 md:rounded-lg md:[&>svg]:w-4 md:[&>svg]:h-4 md:text-xs lg:text-sm",
};

function ButtonIcon({
  children,
  onClick,
  className,
  variant,
  size = "sm",
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      className={`
        ${btnType[variant]}
        ${sizeClass[size]}
        ${className} flex items-center justify-center
        [&>svg]:shrink-0 [&>svg]:text-inherit
        transition-all duration-200 ease-out
        touch-manipulation select-none`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonIcon;
