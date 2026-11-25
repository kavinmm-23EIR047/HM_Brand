import {
  Clock3,
  Flower2,
  Leaf,
  Package,
  Ruler,
  Sparkles,
} from "lucide-react";
import type { ProductKeyFeature } from "@/lib/products";

const FEATURE_ICONS = {
  quantity: Package,
  duration: Clock3,
  dimensions: Ruler,
  fragrance: Flower2,
  material: Leaf,
  detail: Sparkles,
} as const;

export function ProductKeyFeatures({ features }: { features?: ProductKeyFeature[] }) {
  if (!features?.length) return null;

  return (
    <ul aria-label="Key product features" className="mt-2 flex flex-wrap gap-1.5">
      {features.slice(0, 4).map((feature, index) => {
        const Icon = FEATURE_ICONS[feature.kind];

        return (
          <li
            key={`${feature.kind}-${feature.value}-${index}`}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-brand-border/80 bg-brand-surface-warm/50 px-2.5 py-1 text-[10px] font-medium leading-tight text-brand-slate sm:text-[11px]"
            title={feature.value}
          >
            <Icon aria-hidden="true" className="h-3 w-3 shrink-0 text-brand-primary" />
            <span className="truncate">{feature.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
