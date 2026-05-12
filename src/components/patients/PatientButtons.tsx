export const PatientButtons = () => {
    return (
        <div className="flex gap-3 ml-auto items-center">
            <div className="relative w-80">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-secondary)">🔍</span>
                <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full border border-border rounded-md h-9 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-(--text-primary)"
                />
            </div>
            <button className="rounded-md bg-primary text-white px-4 h-9 inline-flex items-center gap-2 hover:bg-(--primary-dark) transition shadow-sm">
                <span className="text-sm">➕</span>
                Add Patient
            </button>
        </div>
    );
}