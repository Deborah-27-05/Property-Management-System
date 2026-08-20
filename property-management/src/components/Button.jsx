export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...rest
}) {
  const variants = {
    primary: 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700',
    secondary: 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    accent: 'bg-amber-400 text-amber-950 hover:bg-amber-300',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  };
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variants[variant] || variants.primary,
    size === 'sm' ? 'btn-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
