"use client";
import { useState, useEffect } from "react";

const categoryMap = {
  NOTICE: "공지",
  FREE: "자유",
  FAQ: "질문",
};

export default function ViewBoard({ posts, setPosts }) {
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("유저 정보 조회 실패");
        const data = await res.json();
        setCurrentUserId(data.id);
      } catch (err) {
        console.error("유저 ID 가져오기 실패:", err);
      }
    };
    fetchUserId();
  }, []);

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const fetchComments = async (postId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/study-boards/${postId}/comments`,
        { method: "GET", credentials: "include" }
      );
      if (!res.ok) throw new Error("댓글 조회 실패");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error("댓글 가져오기 실패:", err);
      return [];
    }
  };

  const handlePostClick = async (post) => {
    let comments = [];
    if (post.studyBoardCategory === "FREE") {
      comments = await fetchComments(post.id);
    }
    setSelectedPost({ ...post, comments });
  };

  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment || !currentUserId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/study-boards/${postId}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            content: comment,
            studyBoard: { id: postId },
            user: { id: currentUserId },
          }),
        }
      );

      if (!res.ok) throw new Error("댓글 작성 실패");

      const newComment = (await res.json()).data;

      setSelectedPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  if (selectedPost) {
    const post = selectedPost;
    return (
      <div>
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← 목록으로
        </button>

        <div className="p-4 border rounded bg-white shadow-sm">
          <h3 className="font-bold text-xl mb-2">
            [{categoryMap[post.studyBoardCategory] || post.studyBoardCategory}] {post.title}
          </h3>
          <div className="text-sm text-gray-600 mb-1">
            {post.date} | 작성자: {post.user_id}
          </div>
          <hr className="mb-4" />
          <p className="whitespace-pre-wrap mb-4">{post.content}</p>
        </div>

        {post.studyBoardCategory === "FREE" && (
          <div className="mt-6 p-4 border rounded bg-white shadow-sm">
            <h4 className="font-semibold mb-3">💬 댓글</h4>
            <div className="space-y-3">
              {post.comments?.map((c, index) => (
                <div key={c.id} className="p-3 bg-gray-50 rounded shadow-sm border">
                  <p className="text-sm font-semibold text-gray-700">익명 {index + 1}</p>
                  <p className="text-sm text-gray-600">{c.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2 items-center">
              <input
                type="text"
                placeholder="댓글 입력..."
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                className="bg-[#4B2E1E] text-white text-sm px-4 py-2 rounded hover:bg-[#3a2117]"
              >
                등록
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => handlePostClick(post)}
          className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer"
        >
          <div className="text-sm text-gray-600 mb-1">
            [{categoryMap[post.studyBoardCategory] || post.studyBoardCategory}] {post.date} | 작성자: {post.user_id}
          </div>
          <h3 className="font-bold text-lg mb-1">{post.title}</h3>
        </div>
      ))}
    </div>
  );
}
