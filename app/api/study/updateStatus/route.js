import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { id, user, studyDetail, status } = req.body;

  try {
    const joinFilePath = path.join(process.cwd(), "public", "joinMemberList.json");
    const studyFilePath = path.join(process.cwd(), "public", "studyData.json");

    const joinDataRaw = await fs.readFile(joinFilePath, "utf-8");
    const studyDataRaw = await fs.readFile(studyFilePath, "utf-8");

    const joinData = JSON.parse(joinDataRaw);
    const studyData = JSON.parse(studyDataRaw);

    const request = joinData.find((r) => r.id === id);
    if (!request) {
      return res.status(404).json({ message: "신청자를 찾을 수 없습니다." });
    }

    request.status = status;

    if (status === "approved") {
      const study = studyData.find((s) => s.detail === studyDetail);
      if (!study) {
        return res.status(404).json({ message: "스터디를 찾을 수 없습니다." });
      }
      if (!study.member.role_member.includes(user)) {
        study.member.role_member.push(user);
      }
    }

    await fs.writeFile(joinFilePath, JSON.stringify(joinData, null, 2), "utf-8");
    await fs.writeFile(studyFilePath, JSON.stringify(studyData, null, 2), "utf-8");

    res.status(200).json({ message: "상태 업데이트 완료" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}
