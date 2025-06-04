"use client";
import { useState } from "react";

const categoryMap = {
  notice: "공지",
  free: "자유",
  faq: "질문",
};

export default function ViewBoard({ posts, setPosts }) {
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.board_id === postId
          ? {
              ...post,
              comments: [
                ...(post.comments || []),
                { id: Date.now(), content: comment },
              ],
            }
          : post
      )
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  if (selectedPost) {
    // 상세 보기
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
            [{categoryMap[post.category] || post.category}] {" "}
            {post.title}
          </h3>
          <div className="text-sm text-gray-600 mb-1">
           {post.date} | 작성자: {post.user_id}
          </div>
          <hr className="mb-4" />
          <p className="whitespace-pre-wrap mb-4">{post.content}</p>
        </div>

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

          {post.category === "free" ? (
            <div className="mt-4 flex gap-2 items-center">
              <input
                type="text"
                placeholder="댓글 입력..."
                value={commentInputs[post.board_id] || ""}
                onChange={(e) => handleCommentChange(post.board_id, e.target.value)}
                className="flex-1 border rounded px-3 py-2 text-sm"
              />
              <button
                onClick={() => handleCommentSubmit(post.board_id)}
                className="bg-[#4B2E1E] text-white text-sm px-4 py-2 rounded hover:bg-[#3a2117]"
              >
                등록
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-400">이 게시글에는 댓글을 작성할 수 없습니다.</p>
          )}
        </div>
      </div>
    );
  }

  // 목록 보기
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.board_id}
          onClick={() => setSelectedPost(post)} // 게시글 클릭 시 상세 보기
          className="p-4 border rounded shadow-sm hover:bg-gray-50 cursor-pointer"
        >
          <div className="text-sm text-gray-600 mb-1">
            [{categoryMap[post.category] || post.category}] {post.date} | 작성자: {post.user_id}
          </div>
          <h3 className="font-bold text-lg mb-1">{post.title}</h3>
        </div>
      ))}
    </div>
  );
}
