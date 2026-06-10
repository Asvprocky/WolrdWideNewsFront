import { NewsPoint } from "../../types/news";

interface Props {
  news: NewsPoint;
  onClick: () => void;
}

export default function NewsCard({ news, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-[#111827]/60 hover:bg-slate-900 rounded-xl border border-slate-900 cursor-pointer transition-all"
    >
      <span className="text-[10px] font-bold" style={{ color: news.color }}>
        {news.categoryLabel}
      </span>

      <h3 className="text-[13px] font-bold text-slate-200 mt-2 line-clamp-2">{news.title}</h3>
    </div>
  );
}
