"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import UserName from "@/components/common/UserName";

const categoryMap = {
  NOTICE: "공지",
  FREE: "자유",
  FAQ: "질문",
};

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

export default function ViewBoard({ posts, setPosts }) {
  const { user } = useUser();
  const currentUserId = user?.id;

  const [commentInputs, setCommentInputs] = useState({});
  const [editInputs, setEditInputs] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(false);

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

  const handlePostDelete = async () => {
    if (!confirm("이 게시글을 삭제하시겠습니까?")) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-boards/${selectedPost.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      setSelectedPost(null);
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
    }
  };

  const handlePostUpdate = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/study-boards/${selectedPost.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            title: selectedPost.title,
            content: selectedPost.content,
            studyBoardCategory: selectedPost.studyBoardCategory,
            studyGroup: { id: selectedPost.studyGroup.id },
            user: { id: currentUserId },
          },
        }),
      });
      if (!res.ok) throw new Error("수정 실패");
      const updated = (await res.json()).data;
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedPost(null);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment || !currentUserId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({data:{
            content: comment,
            // studyGroup: { id: selectedPost.studyGroup.id },
            studyBoard: { id: postId },
            user: { id: currentUserId },
          }}),
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
    }
  };

  const handleCommentDelete = async (postId, commentId) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/study-boards/${postId}/comments/${commentId}`,
        { method: "DELETE", credentials: "include" }
      );
      setSelectedPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  const handleCommentEdit = async (postId, commentId) => {
    const newContent = editInputs[commentId]?.trim();
    if (!newContent || !currentUserId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/study-boards/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newContent,
            studyBoard: { id: postId },
            user: { id: currentUserId },
          }),
        }
      );
      if (!res.ok) throw new Error("댓글 수정 실패");
      const updated = (await res.json()).data;

      setSelectedPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) => (c.id === commentId ? updated : c)),
      }));
      setEditingCommentId(null);
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleEditChange = (commentId, value) => {
    setEditInputs((prev) => ({ ...prev, [commentId]: value }));
  };

  if (selectedPost) {
    const post = selectedPost;
    const isPostOwner = post.user?.id === currentUserId;

    return (
      <div>
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← 목록으로
        </button>

        <div className="p-4 border rounded bg-white shadow-sm">
          {editingPost ? (
            <>
              <input
                className="w-full border rounded px-2 py-1 text-lg mb-2"
                value={post.title}
                onChange={(e) =>
                  setSelectedPost((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <textarea
                className="w-full border rounded px-2 py-2 h-40 mb-2"
                value={post.content}
                onChange={(e) =>
                  setSelectedPost((prev) => ({ ...prev, content: e.target.value }))
                }
              />
              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={handlePostUpdate}
                >
                  저장
                </button>
                <button
                  className="text-gray-500 text-sm"
                  onClick={() => setEditingPost(false)}
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold text-xl mb-2">
                [{categoryMap[post.studyBoardCategory || post.adminBoardCategory]}] {post.title}
              </h3>
              <div className="text-sm text-gray-600 mb-1">
                {formatDateTime(post.createdAt)} | 작성자: <UserName userId={post.user?.id} />
              </div>
              <hr className="mb-4" />
              <p className="whitespace-pre-wrap mb-4">{post.content}</p>

              { post.studyBoardCategory === "FREE" && isPostOwner && (
                <div className="text-right text-sm space-x-2">
                  <button
                    onClick={() => setEditingPost(true)}
                    className="text-blue-600 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={handlePostDelete}
                    className="text-red-600 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {post.studyBoardCategory === "FREE" && (
          <div className="mt-6 p-4 border rounded bg-white shadow-sm">
            <h4 className="font-semibold mb-3">💬 댓글</h4>
            <div className="space-y-3">
              {post.comments?.map((c) => (
                <div key={c.id} className="p-3 bg-gray-50 rounded shadow-sm border">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-700">
                      <UserName userId={c.user?.id} />
                    </p>
                    {c.user?.id === currentUserId && (
                      <span className="space-x-2 text-xs text-gray-500">
                        <button onClick={() => setEditingCommentId(c.id)}>수정</button>
                        <button onClick={() => handleCommentDelete(post.id, c.id)}>삭제</button>
                      </span>
                    )}
                  </div>
                  {editingCommentId === c.id ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={editInputs[c.id] || c.content}
                        onChange={(e) => handleEditChange(c.id, e.target.value)}
                        className="flex-1 border rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={() => handleCommentEdit(post.id, c.id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">{c.content}</p>
                  )}
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
            [{categoryMap[post.studyBoardCategory || post.adminBoardCategory]}]{" "}
            {formatDateTime(post.createdAt)} | 작성자: <UserName userId={post.user?.id} />
          </div>
          <h3 className="font-bold text-lg mb-1">{post.title}</h3>
        </div>
      ))}
    </div>
  );
}
