"use client";

import { useEffect, useState } from "react";

export function useLeaderStudies(userId) {
  const [leaderStudies, setLeaderStudies] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchLeaderStudies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-groups/leader/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("리더 스터디 조회 실패");

        const data = await res.json();
        setLeaderStudies(data.data || []);
      } catch (error) {
        console.error("리더 스터디 로딩 실패:", error);
      }
    };

    fetchLeaderStudies();
  }, [userId]);

  return leaderStudies;
}