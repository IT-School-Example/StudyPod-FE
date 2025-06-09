import { promises as fs } from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "public", "studyLikes.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const studyLikes = JSON.parse(data || "[]");
    return new Response(JSON.stringify(studyLikes), { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return new Response("Failed to read studyLikes file", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { studyDetail, userName, action } = await request.json();
    const data = await fs.readFile(filePath, "utf-8");
    let studyLikes = JSON.parse(data || "[]");

    const studyIndex = studyLikes.findIndex((item) => item.studyDetail === studyDetail);

    if (action === "like") {
      if (studyIndex === -1) {
        studyLikes.push({ studyDetail, likedUsers: [userName] });
      } else if (!studyLikes[studyIndex].likedUsers.includes(userName)) {
        studyLikes[studyIndex].likedUsers.push(userName);
      }
    } else if (action === "unlike" && studyIndex !== -1) {
      studyLikes[studyIndex].likedUsers = studyLikes[studyIndex].likedUsers.filter(
        (name) => naem !== userName
      );
      if (studyLikes[studyIndex].likedUsers.length === 0) {
        studyLikes.splice(studyIndex, 1);
      }
    }

    await fs.writeFile(filePath, JSON.stringify(studyLikes, null, 2));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response("Failed to update studyLikes file", { status: 500 });
  }
}
