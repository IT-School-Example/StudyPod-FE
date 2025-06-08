import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const { detail, introduce } = await req.json();

  const filePath = path.join(process.cwd(), "public", "studyData.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  const studyList = JSON.parse(fileData);

  const target = studyList.find((study) => study.detail === detail);
  if (!target) {
    return NextResponse.json(
      { message: "스터디를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  target.introduce = introduce;

  fs.writeFileSync(filePath, JSON.stringify(studyList, null, 2));

  return NextResponse.json({ message: "소개글이 수정되었습니다." });
}