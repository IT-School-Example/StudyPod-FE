import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  const newStudy = await req.json();

  const filePath = path.join(process.cwd(), "public", "studyData.json");
  const file = await fs.readFile(filePath, "utf-8");
  const studyData = JSON.parse(file);

  studyData.push(newStudy);
  await fs.writeFile(filePath, JSON.stringify(studyData, null, 2), "utf-8");

  return new Response(JSON.stringify({ message: "추가" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
