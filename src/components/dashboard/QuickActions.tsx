
import { Card, CardContent } from "@/components/ui/card";
import { Action } from "@/utils/data";
import Link from "next/link";

type QuickActionsProps = {
  actions: Action[];
  onActionClick?: (action: Action) => void;
};

export const QuickActions = ({ actions, onActionClick }: QuickActionsProps) => {
  return (
    <div>
      <Card className="bg-(--bg-primary) border border-border rounded-[16px] px-6 py-5 w-130">
        <CardContent className="p-0">
          <div>
            <div className="flex flex-col gap-4 mb-4">
              <h2 className="text-lg font-semibold text-(--text-primary)">
                Quick Actions
              </h2>
              <hr />
            </div>

            <div>
              {actions.map((action) => {
                const content = (
                  <div className="flex items-center gap-2 mb-4 p-2 hover:bg-blue-300 rounded-md bg-(--bg-secondary) transition-colors cursor-pointer">
                    <span className="text-2xl bg-blue-300 p-2 rounded-md">
                      {action.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold text-(--text-primary) text-sm">
                        {action.title}
                      </h3>
                      <p className="text-sm text-(--text-secondary)">
                        {action.description}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <div key={action.title}>
                    {action.link ? (
                      <Link href={action.link}>{content}</Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onActionClick?.(action)}
                        className="w-full text-left"
                      >
                        {content}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};