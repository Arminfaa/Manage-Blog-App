function Select({ value, onChange, options, id, ...rest }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="textField__input py-2.5 text-xs bg-secondary-0"
      {...rest}
    >
      {options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
export default Select;
