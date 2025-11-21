import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface HelpTooltipProps {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function HelpTooltip({ content, side = "right" }: HelpTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center ml-2 text-chalk-green hover:text-chalk-white transition-colors"
          aria-label="Información de ayuda"
          title="Ver información de ayuda"
          data-testid="help-tooltip-trigger"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs bg-blackboard border-chalk text-chalk-white p-3">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
