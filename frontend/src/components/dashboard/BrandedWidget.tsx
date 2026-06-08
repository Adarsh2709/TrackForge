import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface BrandedWidgetProps {
  title: string;
  value: string | number;
  imageSrc: string;
  imageAlt: string;
  trend?: string;
  trendUp?: boolean | null;
  colorClass?: string;
}

export function BrandedWidget({ title, value, imageSrc, imageAlt, trend, trendUp, colorClass = "bg-surface" }: BrandedWidgetProps) {
  return (
    <Card className={`relative overflow-hidden border-2 border-border shadow-[4px_4px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 ${colorClass}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <h3 className="font-heading font-black text-xl text-foreground/80 tracking-tight">{title}</h3>
            <div className="font-sans font-black text-5xl tracking-tighter text-foreground">
              {value}
            </div>
            {trend && (
              <div className="flex items-center gap-1.5 text-sm font-bold">
                {trendUp === true ? (
                  <span className="flex items-center text-emerald-600 dark:text-emerald-500">
                    <ArrowUpRight className="w-4 h-4 mr-0.5" />
                    {trend}
                  </span>
                ) : trendUp === false ? (
                  <span className="flex items-center text-destructive">
                    <ArrowDownRight className="w-4 h-4 mr-0.5" />
                    {trend}
                  </span>
                ) : (
                  <span className="flex items-center text-secondary">
                    <Minus className="w-4 h-4 mr-0.5" />
                    {trend}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="w-20 h-20 relative transform hover:scale-110 hover:rotate-6 transition-transform duration-500">
            <div className="absolute inset-0 bg-background/50 blur-xl rounded-full" />
            <Image
              src={imageSrc}
              alt={`${title} Mascot`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain drop-shadow-lg relative z-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
