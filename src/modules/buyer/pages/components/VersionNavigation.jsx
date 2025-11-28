import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { History } from "lucide-react";

export const VersionNavigation = ({ negotiations, activeVersion, onVersionChange }) => {
  if (negotiations.length <= 1) return null;

  return (
    <Card className="shadow-lg border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Navigate Versions</span>
          </div>
          <div className="flex gap-2">
            {negotiations.map((_, index) => (
              <Button
                key={index}
                variant={activeVersion === index ? "default" : "outline"}
                size="sm"
                onClick={() => onVersionChange(index)}
                className={activeVersion === index ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                V{index + 1}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};