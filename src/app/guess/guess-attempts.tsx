import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { MovieGameAttempt } from "../stores/movie-game";

interface GuessAttemptsProps {
  attempts: MovieGameAttempt[];
}

const colorsMap = {
  fail: "bg-red-800 bg-opacity-25 border-red-400 border-opacity-20",
  success: "bg-emerald-700 bg-opacity-50 border-emerald-400 border-opacity-40",
  skip: "bg-gray-700 bg-opacity-50 border-gray-400 border-opacity-40",
};

export default function GuessAttempts(props: GuessAttemptsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="relative w-full flex flex-col gap-4"
    >
      <CollapsibleTrigger className="flex w-full justify-center absolute top-[-28px]">
        {open ? <ChevronDown /> : <ChevronUp />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <section className="flex flex-col gap-2 w-full">
          {props.attempts.map((attempt, index) => {
            const color = colorsMap[attempt.status];
            return (
              <div
                key={index}
                className={`rounded-md border px-4 py-2 font-mono text-sm shadow-sm ${color}`}
              >
                {attempt.status === "skip" ? "Skipped" : attempt.label}
              </div>
            );
          })}
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
}
