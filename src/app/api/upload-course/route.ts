// src/app/api/upload-subtopic/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export const runtime = "nodejs";

async function saveFile(file: File | null) {
  if (!file) return undefined;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const rawCurriculum = form.get("curriculum");
    if (!rawCurriculum) return NextResponse.json({ error: "Missing curriculum" }, { status: 400 });

    const curriculum = JSON.parse(String(rawCurriculum));

    for (let i = 0; i < curriculum.length; i++) {
      const subject = curriculum[i];
      const subjectRec = await prisma.subject.upsert({
        where: { name: subject.subject },
        update: {},
        create: { name: subject.subject },
      });

      for (let j = 0; j < subject.chapters.length; j++) {
        const chapter = subject.chapters[j];
        const chapterRec = await prisma.subjectChapter.upsert({
          where: {
            subjectId_title: {
              subjectId: subjectRec.id,
              title: chapter.chapter,
            },
          },
          update: {},
          create: {
            subjectId: subjectRec.id,
            title: chapter.chapter,
          },
        });

        for (let k = 0; k < chapter.topics.length; k++) {
          const topic = chapter.topics[k];
          const topicRec = await prisma.topic.upsert({
            where: {
              chapterId_title: {
                chapterId: chapterRec.id,
                title: topic.topic,
              },
            },
            update: {},
            create: {
              chapterId: chapterRec.id,
              title: topic.topic,
              youtubeUrl: topic.hasSubtopics ? undefined : topic.youtubeUrl,
              pdfUrl: topic.hasSubtopics ? undefined : await saveFile(topic.pdf),
              mcqUrl: undefined, // Not used in this schema, MCQs are stored individually
              caseStudyUrl: topic.hasSubtopics ? undefined : await saveFile(topic.caseStudy),
              pdfAccess: topic.hasSubtopics ? undefined : topic.pdfAccess,
            },
          });

          if (topic.hasSubtopics && topic.subtopics) {
            for (let s = 0; s < topic.subtopics.length; s++) {
              const sub = topic.subtopics[s];
              const subPdfUrl = await saveFile(form.get(`pdf-${i}-${j}-${k}-${s}`) as File | null);
              const subCaseStudyUrl = await saveFile(form.get(`case-${i}-${j}-${k}-${s}`) as File | null);

              const subtopic = await prisma.subtopic.create({
                data: {
                  title: sub.title,
                  topicId: topicRec.id,
                  youtubeUrl: sub.youtubeUrl,
                  pdfUrl: subPdfUrl,
                  caseStudyUrl: subCaseStudyUrl,
                  pdfAccess: sub.pdfAccess,
                },
              });

              for (let m = 0; m < (sub.mcqs || []).length; m++) {
                const mcq = sub.mcqs[m];
                await prisma.mCQ.create({
                  data: {
                    question: mcq.question,
                    options: mcq.options,
                    correctIndex: mcq.correctAnswerIndex,
                    subtopicId: subtopic.id,
                  },
                });
              }
            }
          } else {
            for (let m = 0; m < (topic.mcqs || []).length; m++) {
              const mcq = topic.mcqs[m];
              await prisma.mCQ.create({
                data: {
                  question: mcq.question,
                  options: mcq.options,
                  correctIndex: mcq.correctAnswerIndex,
                  topicId: topicRec.id,
                },
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ message: "Upload successful" });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
