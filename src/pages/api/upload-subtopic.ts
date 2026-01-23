import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import prisma from "../../../lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ uploadDir, keepExtensions: true, multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File parsing failed" });

    try {
     // Ensure we are always parsing a string
const rawCurriculum = Array.isArray(fields.curriculum)
  ? fields.curriculum[0]
  : fields.curriculum;

if (!rawCurriculum) {
  return res.status(400).json({ error: "Missing curriculum data" });
}

let curriculum;
try {
  curriculum = JSON.parse(rawCurriculum);
} catch (err) {
  return res.status(400).json({ error: "Invalid JSON format in curriculum" });
}

      // ✅ Loop through each subject
      for (const subject of curriculum) {
        if (!subject.subject) continue;

        const subjectRecord = await prisma.subject.upsert({
          where: { name: subject.subject },
          update: {},
          create: { name: subject.subject },
        });

        for (const chapter of subject.chapters) {
          const chapterRecord = await prisma.subjectChapter.upsert({
            where: {
              subjectId_title: {
                subjectId: subjectRecord.id,
                title: chapter.chapter,
              },
            },
            update: {},
            create: {
              title: chapter.chapter,
              subjectId: subjectRecord.id,
            },
          });

          for (const topic of chapter.topics) {
            const topicRecord = await prisma.topic.upsert({
              where: {
                chapterId_title: {
                  chapterId: chapterRecord.id,
                  title: topic.topic,
                },
              },
              update: {},
              create: {
                title: topic.topic,
                chapterId: chapterRecord.id,
              },
            });

            for (const [index, sub] of topic.subtopics.entries()) {
              const pdfKey = `pdf-${curriculum.indexOf(subject)}-${subject.chapters.indexOf(chapter)}-${chapter.topics.indexOf(topic)}-${index}`;
              const mcqKey = `mcq-${curriculum.indexOf(subject)}-${subject.chapters.indexOf(chapter)}-${chapter.topics.indexOf(topic)}-${index}`;
              const caseStudyKey = `caseStudy-${curriculum.indexOf(subject)}-${subject.chapters.indexOf(chapter)}-${chapter.topics.indexOf(topic)}-${index}`;

              const pdfFile = (Array.isArray(files[pdfKey]) ? files[pdfKey][0] : files[pdfKey]) as any;
              const mcqFile = (Array.isArray(files[mcqKey]) ? files[mcqKey][0] : files[mcqKey]) as any;
              const caseStudyFile = (Array.isArray(files[caseStudyKey]) ? files[caseStudyKey][0] : files[caseStudyKey]) as any;

              await prisma.subtopic.create({
                data: {
                  title: sub.subtopic,
                  youtubeUrl: sub.youtubeUrl,
                  pdfAccess: sub.pdfAccess as any,
                  topicId: topicRecord.id,
                  pdfUrl: pdfFile ? `/uploads/${pdfFile.newFilename}` : undefined,
                  mcqUrl: mcqFile ? `/uploads/${mcqFile.newFilename}` : undefined,
                  caseStudyUrl: caseStudyFile ? `/uploads/${caseStudyFile.newFilename}` : undefined,
                },
              });
            }
          }
        }
      }

      return res.status(200).json({ message: "Curriculum uploaded successfully!" });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
