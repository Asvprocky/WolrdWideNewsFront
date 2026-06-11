import { Category } from "../../types/news";

interface Props {
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryFilter({ selectedCategory, onSelect }: Props) {
  const labelMap = {
    ALL: "전체 보기 🌐",
    WAR: "전쟁",
    ACCIDENT: "사건·사고",
    ECONOMY: "경제·유가",
  };

  return (
    <div className="top-20 left-1/2 -translate-x-1/2 z-1000 flex gap-1.5 p-1 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-xl">
      {(["ALL", "WAR", "ACCIDENT", "ECONOMY"] as Category[]).map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all ${
            selectedCategory === cat
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {labelMap[cat]}
        </button>
      ))}
    </div>
  );
}
