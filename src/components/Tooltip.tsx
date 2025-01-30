import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

interface ToolProps {
  style?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  button?: any;
  hover?: string;
}

export const TooltipComp: React.FC<ToolProps> = ({ style, variant, button, hover }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={variant} className={style}>
            {button}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hover}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
