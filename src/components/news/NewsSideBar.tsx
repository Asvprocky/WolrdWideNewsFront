import { useMemo } from "react";
import NewsCard from "./NewsCard";
import { Category, NewsPoint } from "../../types/news";
import BookmarkButton from "../common/BookmarkButton";

interface Props {
  isOpen: boolean;
  selectedCategory: Category;
  newsList: NewsPoint[];
  activeNews: NewsPoint | null;
  onSelectNews: (news: NewsPoint) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function NewsSidebar({
  isOpen,
  selectedCategory,
  newsList,
  activeNews,
  onSelectNews,
  onBack,
  onClose,
}: Props) {
  const filteredList = useMemo(() => {
    return selectedCategory === "ALL"
      ? newsList
      : newsList.filter((news) => news.category === selectedCategory);
  }, [newsList, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="h-full bg-[#0d1527] border-l border-slate-900/60 px-6 py-8 flex flex-col w-105 lg:w-138 z-[1000]">
      {/* 헤더 */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-900 shrink-0">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider">COUNTRY</div>

          <div className="text-sm font-bold text-slate-100">{newsList[0]?.country ?? "뉴스"}</div>
        </div>

        <button
          onClick={onClose}
          className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          ESC ✕
        </button>
      </div>

      {/* 뉴스 목록 */}
      <div
        className={`flex-1 overflow-y-auto my-5 pr-1 space-y-3 ${activeNews ? "hidden" : "block"}`}
      >
        {filteredList.length > 0 ? (
          filteredList.map((news) => (
            <NewsCard key={news.id} news={news} onClick={() => onSelectNews(news)} />
          ))
        ) : (
          <div className="text-center text-slate-500 text-sm mt-10">
            해당 카테고리의 뉴스가 없습니다.
          </div>
        )}
      </div>

      {/* 상세 보기 */}
      <div className={`flex flex-col flex-1 mt-5 min-h-0 ${!activeNews ? "hidden" : "flex"}`}>
        {activeNews && (
          <>
            {/* 상단 고정 */}
            <div className="pb-4 border-b border-slate-900 shrink-0">
              <button
                onClick={onBack}
                className="text-[11px] text-indigo-400 hover:text-indigo-300"
              >
                ← BACK TO LIST
              </button>
            </div>

            {/* 스크롤 영역 */}
            <div className="flex-1 overflow-y-auto pt-6 pr-1">
              {activeNews.thumbnailUrl && (
                <img
                  src={activeNews.thumbnailUrl}
                  alt={activeNews.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6 border border-slate-800"
                />
              )}

              {/* 카테고리 */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{
                    backgroundColor: `${activeNews.color}20`,
                    color: activeNews.color,
                  }}
                >
                  {activeNews.categoryLabel}
                </span>

                <BookmarkButton
                  key={activeNews.id}
                  articleId={activeNews.id}
                  initialBookmarked={activeNews.isBookmarked}
                />
              </div>

              {/* 제목 */}
              <h1 className="text-3xl font-bold text-white leading-tight mb-3">
                {activeNews.title}
              </h1>

              {/* 국가 */}
              <div className="text-sm text-slate-500 mb-6">{activeNews.country}</div>

              {/* 본문 */}
              <div className="bg-[#111827]/70 border border-slate-800 rounded-2xl p-7">
                <div className="text-[16px] leading-8 text-slate-300 whitespace-pre-line">
                  {activeNews.originalContent || "본문 내용이 없습니다."}
                </div>
              </div>

              {/* 원문 링크 */}
              {activeNews.url && (
                <div className="mt-6">
                  <a
                    href={activeNews.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                  >
                    원문 기사 보기 →
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
