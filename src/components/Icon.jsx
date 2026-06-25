export default function Icon({ children, className = '', fill = false, ...props }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
      {...props}
    >
      {children}
    </span>
  );
}
