export const TableButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <button
        className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
        title="View"
      >
        👁️
      </button>
      <button
        className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-green-100 transition cursor-pointer"
        title="Appointment"
      >
        📅
      </button>
      <button
        className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
        title="Edit"
      >
        ✏️
      </button>
      <button
        className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-red-100 transition cursor-pointer"
        title="Delete"
      >
        🗑️
      </button>
    </div>
  );
};
