"use client";

import { useQuery } from "@tanstack/react-query";

export function useUserName(userId) {
  return useQuery({
    queryKey: ["userSummary", userId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/summary`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("유저 이름 조회 실패");
      }

      const result = await res.json();
      return result.data.displayName;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
