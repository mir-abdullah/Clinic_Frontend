import { Card, CardContent } from "@/components/ui/card";

export const StatsCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}) => {
  return (
    <Card
      className="
        bg-(--bg-primary)
        rounded-[16px]
        px-6 py-5
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
        cursor-pointer
        w-90
      "
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[1px] text-(--text-secondary)">
              {title}
            </p>
          </div>

          <div
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl
              bg-(--bg-secondary)
            "
          >
           <span className="text-lg">{icon}</span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-5xl font-bold tracking-tight text-(--text-primary)">
            {value}
          </h2>

          {description && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-(--success)">
              <span>↑</span>
              <span>{description}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};