import { Link } from "react-router-dom";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-xl font-bold text-[#111827] mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      )}
      {actionLabel &&
        (actionTo ? (
          <Link to={actionTo} className="btn-primary">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="btn-primary">
            {actionLabel}
          </button>
        ))}
    </div>
  );
}
