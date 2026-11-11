export function StallCardSkeleton() {
  return (
    <div className="stall-card skeleton-card" aria-hidden="true">
      <div className="stall-media skeleton" />
      <div className="stall-body">
        <div className="skeleton line w70" />
        <div className="skeleton line w90" />
        <div className="skeleton line w40" />
      </div>
    </div>
  );
}