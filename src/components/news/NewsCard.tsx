import { NewsPoint } from "../../types/news";

interface Props {
  news: NewsPoint;
  onClick: () => void;
}

export default function NewsCard({ news, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="
        group
        flex gap-4
        p-4
        rounded-2xl
        bg-[#111827]
        border border-slate-800
        hover:border-slate-700
        hover:bg-[#151f31]
        hover:-translate-y-0.5
        transition-all duration-200
        cursor-pointer
      "
    >
      {/* 썸네일 */}
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900">
        {news.thumbnailUrl ? (
          <img
            src={news.thumbnailUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
            NO IMAGE
          </div>
        )}
      </div>

      {/* 내용 */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* 상단 */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2 py-1 rounded-md text-[10px] font-bold"
            style={{
              backgroundColor: `${news.color}20`,
              color: news.color,
            }}
          >
            {news.categoryLabel}
          </span>

          <span className="text-[11px] text-slate-500">{news.country}</span>
        </div>

        {/* 제목 */}
        <h3 className="text-[15px] font-semibold text-white leading-snug line-clamp-3">
          {news.title}
        </h3>
      </div>
    </div>
  );
}
