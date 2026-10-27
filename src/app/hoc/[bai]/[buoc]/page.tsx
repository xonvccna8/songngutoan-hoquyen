// Một bước học của bài: tu-vung · hieu-bai · luyen-tap · noi · kiem-tra
import { notFound } from "next/navigation";
import { StepView } from "@/components/lesson/step-view";
import { LESSONS, lessonBySlug } from "@/lib/content";
import { STEPS, type StepId } from "@/lib/progress/logic";
import { STEP_INFO } from "@/lib/progress/steps";

export const dynamicParams = false;
export const generateStaticParams = () => LESSONS.flatMap((l) => STEPS.map((s) => ({ bai: l.slug, buoc: s })));

export async function generateMetadata(props: PageProps<"/hoc/[bai]/[buoc]">) {
  const { bai, buoc } = await props.params;
  const l = lessonBySlug(bai);
  return { title: l ? `${STEP_INFO[buoc as StepId]?.label.vi ?? ""} · ${l.title.vi}` : undefined };
}

export default async function StepPage(props: PageProps<"/hoc/[bai]/[buoc]">) {
  const { bai, buoc } = await props.params;
  if (!lessonBySlug(bai) || !STEPS.includes(buoc as StepId)) notFound();
  return <StepView slug={bai} step={buoc as StepId} />;
}
