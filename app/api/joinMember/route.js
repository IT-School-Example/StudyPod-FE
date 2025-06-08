import { promises as fs } from "fs";
import path from "path";

export async function POST(req) {
  const joinMember = await req.json();

  const filePath = path.join(process.cwd(), "public", "joinMemberList.json");
  const file = await fs.readFile(filePath, "utf-8");
  const joinMemberList = JSON.parse(file);

  joinMemberList.push(joinMember);
  await fs.writeFile(filePath, JSON.stringify(joinMemberList, null, 2), "utf-8");

  return new Response(JSON.stringify({ message: "추가" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
