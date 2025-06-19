"use client";

import { useUserName } from "@/app/hooks/useUserName";

export default function UserName({ userId }) {
  const {
    data: name,
    isLoading,
    isError,
  } = useUserName(userId);

  if (!userId) return <span className="text-gray-400">익명</span>;
  if (isLoading) return <span className="text-gray-400">로딩 중...</span>;
  if (isError) return <span className="text-red-400">오류</span>;

  return <span>{name ?? "알 수 없음"}</span>;
}
