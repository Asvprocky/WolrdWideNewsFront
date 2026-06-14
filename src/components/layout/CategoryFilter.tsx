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
    POLITICS: "정치",
  };

  return (
    // [수정된 부분]
    // top-20, left-1/2, -translate-x-1/2 등 위치 속성 제거
    // flex, justify-center 등을 사용하여 부모의 가로 폭에 맞춰지게 함
    <div className="z-1000 flex gap-1.5 p-1 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-xl justify-center w-full">
      {(["ALL", "WAR", "ACCIDENT", "ECONOMY", "POLITICS"] as Category[]).map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all whitespace-nowrap ${
            // whitespace-nowrap 추가
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
