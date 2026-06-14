import { useState, useMemo } from "react";
import NewsCard from "./NewsCard";
import { Category, NewsPoint } from "../../types/news";
import CategoryFilter from "../layout/CategoryFilter";

interface Props {
  isOpen: boolean;
  selectedCategory: Category; // 참고용 (메인에서 내려주는 전체 카테고리)
  newsList: NewsPoint[]; // 이미 나라별로 필터링된 리스트
  activeNews: NewsPoint | null;
  onSelectNews: (news: NewsPoint) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function NewsSidebar({
  isOpen,
  newsList,
  activeNews,
  onSelectNews,
  onBack,
  onClose,
}: Props) {
  // 사이드바 내부에서만 사용할 로컬 카테고리 상태
  const [sidebarCategory, setSidebarCategory] = useState<Category>("ALL");

  // 사이드바 내 필터링 로직
  const filteredList = useMemo(() => {
    return sidebarCategory === "ALL"
      ? newsList
      : newsList.filter((news) => news.category === sidebarCategory);
  }, [newsList, sidebarCategory]);

  if (!isOpen) return null;

  return (
    <div className="h-full bg-[#0d1527] border-l border-slate-900/60 px-6 py-8 flex flex-col w-95 lg:w-112.5 z-[1000]">
      {/* 헤더 영역 */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-900">
        <span className="text-sm font-bold text-slate-100">국가별 뉴스</span>
        <button
          onClick={onClose}
          className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          ESC ✕
        </button>
      </div>

      {/* 사이드바 전용 카테고리 필터 (뉴스 리스트를 보고 있을 때만 표시) */}
      {!activeNews && (
        <div className="py-4">
          <CategoryFilter selectedCategory={sidebarCategory} onSelect={setSidebarCategory} />
        </div>
      )}

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto my-5 pr-1 space-y-3">
        {!activeNews ? (
          filteredList.length > 0 ? (
            filteredList.map((news) => (
              <NewsCard key={news.id} news={news} onClick={() => onSelectNews(news)} />
            ))
          ) : (
            <div className="text-center text-slate-500 text-sm mt-10">
              해당 카테고리의 뉴스가 없습니다.
            </div>
          )
        ) : (
          <div>
            <button
              onClick={onBack}
              className="text-[11px] text-indigo-400 mb-4 hover:text-indigo-300"
            >
              ← BACK TO LIST
            </button>

            <h2 className="text-base font-bold text-slate-100">{activeNews.title}</h2>

            <div className="mt-5 text-[13px] text-slate-400 bg-[#090d16]/50 p-5 rounded-xl border border-slate-900 min-h-50 whitespace-pre-line">
              {activeNews.originalContent || "본문 내용이 없습니다."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
