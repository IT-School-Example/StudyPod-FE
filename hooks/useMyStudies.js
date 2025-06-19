"use client";

import { useEffect, useState } from "react";

export function useMyStudies(userId) {
  const [myStudies, setMyStudies] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchStudies = async () => {
      try {
        const [leaderRes, memberRes] = await Promise.allSettled([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/leader/${userId}`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/user/${userId}/enrolled-groups?enrollmentStatus=APPROVED`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
        ]);

        const leaderData =
          leaderRes.status === "fulfilled" && leaderRes.value.ok
            ? (await leaderRes.value.json()).data || []
            : [];

        const memberData =
          memberRes.status === "fulfilled" && memberRes.value.ok
            ? (await memberRes.value.json()).data || []
            : [];

        const combined = [...leaderData, ...memberData];
        const unique = Array.from(new Map(combined.map(s => [s.id, s])).values());

        setMyStudies(unique);
      } catch (e) {
        console.error("소속 스터디 로딩 실패:", e);
      }
    };

    fetchStudies();
  }, [userId]);

  return myStudies;
}
