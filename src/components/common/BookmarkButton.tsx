"use client";

import { toggleBookmarkAction } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  articleId: number;
  initialBookmarked?: boolean; // 처음에 북마크된 상태인지 여부
  onBookmarkChange?: (articleId: number) => void;
}

export default function BookmarkButton({
  articleId,
  initialBookmarked = false,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // 2. 선언

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await toggleBookmarkAction(articleId);

      if (result.success) {
        console.log(result);
        // 서버 처리가 성공하면 로컬 상태만 반전
        setIsBookmarked((prev) => !prev);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95 ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <Bookmark
        className={`w-5 h-5 transition-transform duration-200 ${
          isBookmarked
            ? "fill-[#f59e0b] stroke-[#f59e0b] scale-110"
            : "stroke-gray-400 hover:stroke-white"
        }`}
      />
    </button>
  );
}
