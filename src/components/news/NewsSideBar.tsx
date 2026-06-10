import NewsCard from "./NewsCard";
import { Category, NewsPoint } from "../../types/news";

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
  if (!isOpen) return null;

  return (
    <div className="h-full bg-[#0d1527] border-l border-slate-900/60 px-6 py-8 flex flex-col w-95 lg:w-112.5">
      <div className="flex justify-between items-center pb-4 border-b border-slate-900">
        <span className="text-sm font-bold">
          {selectedCategory === "ALL" ? "국가별 뉴스" : `카테고리: ${selectedCategory}`}
        </span>

        <button
          onClick={onClose}
          className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800"
        >
          ESC ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto my-5 pr-1 space-y-3">
        {!activeNews ? (
          newsList.map((news) => (
            <NewsCard key={news.id} news={news} onClick={() => onSelectNews(news)} />
          ))
        ) : (
          <div>
            <button onClick={onBack} className="text-[11px] text-indigo-400 mb-4">
              ← BACK TO LIST
            </button>

            <h2 className="text-base font-bold text-slate-100">{activeNews.title}</h2>

            <div className="mt-5 text-[13px] text-slate-400 bg-[#090d16]/50 p-5 rounded-xl border border-slate-900 min-h-50 whitespace-pre-line">
              {activeNews.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
