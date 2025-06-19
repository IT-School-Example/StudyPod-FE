"use client";

import { useEffect, useState } from "react";

export function useLikedStudies(userId, options = { fetchDetails: true }) {
  const [likedMap, setLikedMap] = useState({});
  const [likedStudies, setLikedStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchLikedStudies = async () => {
      setLoading(true);
      try {
        const likedRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/interested-studies/user/${userId}`,
          { method: "GET", credentials: "include" }
        );
        const likedData = await likedRes.json();
        const filtered = likedData.data.filter((item) => !item.isDeleted);

        const map = {};
        const ids = filtered.map((item) => {
          map[item.studyGroup.id] = item.id;
          return item.studyGroup.id;
        });

        setLikedMap(map);

        if (options.fetchDetails) {
          const detailRes = await Promise.all(
            ids.map(id =>
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-groups/public/${id}`, {
                credentials: "include"
              })
                .then(res => res.ok ? res.json() : null)
                .then(json => json?.data)
            )
          );
          setLikedStudies(detailRes.filter(Boolean));
        }
      } catch (e) {
        setLikedMap({});
        setLikedStudies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedStudies();
  }, [userId]);

  return { likedMap, likedStudies, loading, setLikedMap };
}
