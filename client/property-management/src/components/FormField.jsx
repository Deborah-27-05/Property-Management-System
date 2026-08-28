export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  as = 'input',
  children,
  ...rest
}) {
  const Tag = as; // 'input', 'select', or 'textarea'
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {as === 'select' ? (
        <select id={name} name={name} value={value} onChange={onChange} aria-invalid={!!error} {...rest}>
          {children}
        </select>
      ) : (
        <Tag
          id={name}
          name={name}
          type={as === 'input' ? type : undefined}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          {...rest}
        />
      )}
      {error ? (
        <div className="error-msg" role="alert">{error}</div>
      ) : hint ? (
        <div className="hint">{hint}</div>
      ) : null}
    </div>
  );
}