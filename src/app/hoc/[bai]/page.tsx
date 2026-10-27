// Trang một bài: giới thiệu, mục tiêu, yêu cầu cần đạt và 5 bước học
import { notFound } from "next/navigation";
import { LessonHub } from "@/components/lesson/hub";
import { LESSONS, lessonBySlug } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => LESSONS.map((l) => ({ bai: l.slug }));

export async function generateMetadata(props: PageProps<"/hoc/[bai]">) {
  const { bai } = await props.params;
  return { title: lessonBySlug(bai)?.title.vi };
}

export default async function LessonPage(props: PageProps<"/hoc/[bai]">) {
  const { bai } = await props.params;
  if (!lessonBySlug(bai)) notFound();
  return <LessonHub slug={bai} />;
}
