import { NewsPoint } from "../../types/news";

interface Props {
  news: NewsPoint;
  onClick: () => void;
}

export default function NewsCard({ news, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="flex gap-4 p-4 bg-[#111827]/60 hover:bg-slate-900 rounded-xl border border-slate-900 cursor-pointer transition-all items-center"
    >
      {/* 1. 썸네일 영역 (flex-shrink-0으로 크기 고정) */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950/80 flex-shrink-0 border border-slate-800/50">
        {news.thumbnailUrl ? (
          <img src={news.thumbnailUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-600 font-bold tracking-wider">
            NO IMAGE
          </div>
        )}
      </div>

      {/* 2. 텍스트 정보 영역 (min-w-0으로 말줄임표 활성화) */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold" style={{ color: news.color }}>
          {news.categoryLabel}
        </span>

        <h3 className="text-[13px] font-bold text-slate-200 mt-1 line-clamp-2 leading-snug">
          {news.title}
        </h3>
      </div>
    </div>
  );
}
