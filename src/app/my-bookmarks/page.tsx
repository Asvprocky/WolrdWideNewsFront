"use client";

import { useEffect, useState } from "react";
import { getBookmarkedArticlesAction } from "@/app/actions/auth";
import NewsCard from "@/components/news/NewsCard";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const data = await getBookmarkedArticlesAction();
        setBookmarks(data);
      } catch (err) {
        console.error("액션 호출 실패:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, []);

  if (loading) {
    return <div className="p-20 text-white">로딩 중...</div>;
  }

  return (
    <div className="h-screen bg-[#090d16] text-white flex overflow-hidden">
      {/* 왼쪽 */}
      <aside className="w-[380px] border-r border-slate-800 bg-[#0d1527] flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <p className="text-xs text-slate-500 mt-1 ml-30">저장한 기사 {bookmarks.length}개</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.map((news) => (
            <NewsCard key={news.id} news={news} onClick={() => setSelectedNews(news)} />
          ))}
        </div>
      </aside>

      {/* 오른쪽 */}
      <main className="flex-1 overflow-y-auto">
        {selectedNews ? (
          <article className="max-w-4xl mx-auto px-12 py-10">
            {selectedNews.thumbnailUrl && (
              <img
                src={selectedNews.thumbnailUrl}
                alt={selectedNews.title}
                className="w-full h-[420px] object-cover rounded-2xl mb-8"
              />
            )}

            <div className="mb-8">
              <div className="text-sm text-slate-500 mb-3">{selectedNews.country}</div>

              <h2 className="text-4xl font-bold leading-tight text-white">{selectedNews.title}</h2>
            </div>

            <div className="text-slate-300 leading-8 text-[17px] whitespace-pre-line">
              {selectedNews.originalContent}
            </div>

            <div className="mt-10">
              <a
                href={selectedNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
              >
                원문 보기 →
              </a>
            </div>
          </article>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">📰</div>
              <h2 className="text-xl font-semibold text-slate-300">기사를 선택하세요</h2>
              <p className="text-slate-500 mt-2">
                왼쪽 목록에서 북마크한 뉴스를 선택할 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
