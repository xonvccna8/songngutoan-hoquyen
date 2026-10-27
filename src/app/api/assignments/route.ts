// GV giao bài tập về nhà: chọn câu từ một tiết, hạn nộp, giao cả lớp / tổ / từng em.
// Đáp án KHÔNG chép vào bài — máy chủ chấm bằng lsn_lessons/{id}/teacher/*.
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { COL } from "@/lib/namespace";
import { HttpError, getClassForStaff, handle, ok, readJson, requireAuth } from "@/lib/server/api";
import { loadLessonForGrading } from "@/lib/server/lessons";
import { createMessage, resolveRecipients, type Recipients } from "@/lib/server/messages";
import { buildItems, isHomeworkSlide } from "@/lib/study/hw";
import { cleanText } from "@/lib/messages/rules";
import { fmtDue } from "@/lib/format";
import type { LessonDoc, Slide } from "@/lib/live/types";

interface Body {
  classId?: string;
  lessonId?: string;
  slideIds?: string[];
  title?: { en?: string; vi?: string };
  dueAt?: number;
  to?: Recipients;
}

const DAY = 86_400_000;
// Firestore không nhận giá trị undefined → bỏ đi
const clean = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

export const POST = handle(async (req: Request) => {
  const user = await requireAuth(req, ["teacher", "admin"]);
  const b = await readJson<Body>(req);
  if (!b.classId || !b.lessonId) throw new HttpError(400, "Thiếu lớp hoặc tiết học.");
  const { cls } = await getClassForStaff(b.classId, user);
  const now = Date.now();
  const dueAt = Number(b.dueAt);
  if (!Number.isFinite(dueAt) || dueAt < now + 10 * 60_000) throw new HttpError(400, "Hạn nộp phải sau thời điểm hiện tại ít nhất 10 phút.");
  if (dueAt > now + 60 * DAY) throw new HttpError(400, "Hạn nộp tối đa 60 ngày.");

  const db = adminDb();
  const lessonSnap = await db.collection(COL.lessons).doc(b.lessonId).get();
  if (!lessonSnap.exists) throw new HttpError(404, "Không tìm thấy tiết học.");
  const lesson = { id: lessonSnap.id, ...lessonSnap.data() } as LessonDoc;
  const { slides, keys } = await loadLessonForGrading(lesson.id);
  const wanted = Array.isArray(b.slideIds) ? new Set(b.slideIds) : null;
  const picked = lesson.slideIds
    .map((id) => slides.get(id))
    .filter((s): s is Slide => !!s && isHomeworkSlide(s) && (!wanted || wanted.has(s.id)));
  if (!picked.length) throw new HttpError(400, "Hãy chọn ít nhất 1 câu.");
  if (picked.length > 30) throw new HttpError(400, "Một bài tối đa 30 câu.");

  const { uids, toLabel } = await resolveRecipients(cls, b.to);
  if (!uids.length) throw new HttpError(400, "Chưa chọn học sinh nhận bài.");

  const title = cleanText(b.title) ?? lesson.title;
  const teacherName = user.name || (await db.collection(COL.users).doc(user.uid).get()).get("displayName") || "Thầy cô";
  const ref = db.collection(COL.assignments).doc();
  await ref.set({
    classId: cls.id,
    schoolId: cls.schoolId,
    teacherId: user.uid,
    teacherName,
    title: { en: title.en || lesson.title.en, vi: title.vi || lesson.title.vi },
    lessonId: lesson.id,
    items: clean(buildItems(picked, keys, lesson.terms ?? [])),
    toUids: uids,
    toLabel,
    dueAt: Timestamp.fromMillis(dueAt),
    createdAt: FieldValue.serverTimestamp(),
    remindedAt: null,
    closedAt: null,
  });

  // Báo bài mới (Thông báo = im lặng, chỉ hiện trong hộp tin; bấm vào mở bài)
  await createMessage({
    cls,
    uids,
    toLabel,
    kind: "notice",
    text: { vi: `Bài tập mới: ${title.vi || lesson.title.vi} · ${picked.length} câu · hạn ${fmtDue(dueAt)}`, en: `New homework: ${title.en || lesson.title.en} · due ${fmtDue(dueAt, "en")}` },
    fromUid: user.uid,
    fromName: teacherName,
    assignmentId: ref.id,
  }).catch((e) => console.error("hw notice:", (e as Error).message));

  return ok({ id: ref.id, recipients: uids.length, items: picked.length }, 201);
});
