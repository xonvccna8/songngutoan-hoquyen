"use client";

// Màn "Xong bước" dùng chung cho 5 bước học
import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";
import { Tam } from "@/components/brand/tam";
import { buttonVariants } from "@/components/ui/button";
import type { LessonContent } from "@/lib/content/types";
import { STEPS, type StepId } from "@/lib/progress/logic";
import { STEP_INFO } from "@/lib/progress/steps";

/** Màn "Xong bước" + nút sang bước tiếp theo */
export function StepDone({ lesson, step, children }: { lesson: LessonContent; step: StepId; children?: React.ReactNode }) {
  const i = STEPS.indexOf(step);
  const next = STEPS[i + 1];
  return (
    <div className="card-lsn flex flex-col items-center gap-3 bg-success-bg p-8 text-center">
      <Tam mood="cheer" className="size-24" />
      <h2 className="flex items-center gap-2 text-2xl font-extrabold text-success-fg">
        <PartyPopper className="size-6" /> Xong bước {STEP_INFO[step].label.vi}!
      </h2>
      {children}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href={`/hoc/${lesson.slug}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
          Về trang bài
        </Link>
        {next && (
          <Link href={`/hoc/${lesson.slug}/${next}`} className={buttonVariants({ variant: "teal", size: "lg" })}>
            {STEP_INFO[next].label.vi} <ArrowRight />
          </Link>
        )}
      </div>
    </div>
  );
}
