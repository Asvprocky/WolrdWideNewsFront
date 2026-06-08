"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), {
  ssr: false,
});
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

type Category = "ALL" | "WAR" | "ACCIDENT" | "ECONOMY";

interface NewsPoint {
  id: number;
  country: string;
  category: Category;
  categoryLabel: string;
  title: string;
  content: string;
  date: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
}

export default function MainMapPage() {
  const [newsData, setNewsData] = useState<NewsPoint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("ALL");
  const [selectedCountryNews, setSelectedCountryNews] = useState<NewsPoint[]>([]);
  const [activeNewsDetail, setActiveNewsDetail] = useState<NewsPoint | null>(null);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    const mockNews: NewsPoint[] = [
      {
        id: 1,
        country: "미국",
        category: "ECONOMY",
        categoryLabel: "경제·유가 📈",
        title: "워싱턴 주요 경제 금리 인상 발표",
        content: "미국 연방준비제도(Fed)가 오늘 새벽 기준금리를 현행 수준에서 동결하고...",
        date: "2026-06-08",
        lat: 38.9072,
        lng: -77.0369,
        size: 9,
        color: "#10b981",
      },
      {
        id: 2,
        country: "미국",
        category: "WAR",
        categoryLabel: "전쟁·분쟁 ⚔️",
        title: "백악관 중동 분쟁 지역 긴급 군사 원조 승인",
        content:
          "미국 행정부가 중동 지역의 안보 안정을 위해 대규모 방공 미사일 및 군사 장비 공급 보조금을 긴급 편성했습니다...",
        date: "2026-06-08",
        lat: 35.0,
        lng: -98.0,
        size: 11,
        color: "#ef4444",
      },
      {
        id: 3,
        country: "영국",
        category: "ECONOMY",
        categoryLabel: "경제·유가 📈",
        title: "런던 금융 시장 파운드화 폭락 유가 변동",
        content: "영국 런던 증시가 개장 직후 글로벌 공급망 악재 소식에 하락세를 면치 못하고...",
        date: "2026-06-08",
        lat: 51.5074,
        lng: -0.1278,
        size: 7,
        color: "#10b981",
      },
      {
        id: 4,
        country: "대한민국",
        category: "ACCIDENT",
        categoryLabel: "사건·사고 🚨",
        title: "서울 글로벌 IT 허브 테크 밸리 통신망 장애 발생",
        content:
          "오늘 오후 서울 강남 테크 밸리 일대 스타트업 클러스터의 메인 백본망에 원인 불명의 물리적 단선 사고가 일어나 대다수 IT 인프라가...",
        date: "2026-06-08",
        lat: 37.5665,
        lng: 126.978,
        size: 10,
        color: "#f59e0b",
      },
      {
        id: 5,
        country: "대한민국",
        category: "ECONOMY",
        categoryLabel: "경제·유가 📈",
        title: "한국 스타트업 특별 육성 자금 10조 원 편성",
        content:
          "중소벤처기업부는 글로벌 테크 허브 도약을 위해 총 10조 원 규모의 매칭 펀드를 결성하고 해외 우수 개발자 유치 비자 절차를...",
        date: "2026-06-07",
        lat: 36.5,
        lng: 127.5,
        size: 12,
        color: "#10b981",
      },
      {
        id: 6,
        country: "호주",
        category: "ACCIDENT",
        categoryLabel: "사건·사고 🚨",
        title: "시드니 환경 포럼 탄소 배출 규제 강화 수립",
        content: "호주 정부가 2030년까지 탄소 배출량을 전년 대비 43% 감축하겠다는...",
        date: "2026-06-08",
        lat: -33.8688,
        lng: 151.2093,
        size: 8,
        color: "#f59e0b",
      },
    ];
    setNewsData(mockNews);
  }, []);

  // 💡 [통합] 국가별 그룹화 로직
  const groupedNews = useMemo(() => {
    const groups: { [key: string]: NewsPoint[] } = {};
    const filtered = newsData.filter((n) =>
      selectedCategory === "ALL" ? true : n.category === selectedCategory,
    );
    filtered.forEach((n) => {
      if (!groups[n.country]) groups[n.country] = [];
      groups[n.country].push(n);
    });
    return groups;
  }, [newsData, selectedCategory]);

  const handleCountryMarkerClick = (country: string) => {
    setSelectedCountryNews(groupedNews[country]);
    setActiveNewsDetail(null);
  };

  const isSidebarOpen = selectedCountryNews.length > 0;
  const closeSidebar = () => {
    setSelectedCountryNews([]);
    setActiveNewsDetail(null);
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize({ animate: true });
      const interval = setInterval(
        () => mapRef.current?.invalidateSize({ animate: true, pan: true }),
        50,
      );
      setTimeout(() => clearInterval(interval), 550);
    }
  }, [isSidebarOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090d16] font-sans text-slate-200 flex">
      <div className="relative flex-1 h-full min-w-0 transition-all duration-500 ease-in-out">
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-3 px-4 py-2 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-lg">
          <span className="animate-ping h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
          <h1 className="text-[11px] font-bold tracking-wider text-slate-200 font-mono">
            RADAR SYSTEM
          </h1>
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex gap-1.5 p-1 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-xl">
          {(["ALL", "WAR", "ACCIDENT", "ECONOMY"] as Category[]).map((cat) => {
            const labelMap = {
              ALL: "전체 보기 🌐",
              WAR: "전쟁",
              ACCIDENT: "사건·사고",
              ECONOMY: "경제·유가",
            };
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  closeSidebar();
                }}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all ${selectedCategory === cat ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
              >
                {labelMap[cat]}
              </button>
            );
          })}
        </div>

        <MapContainer
          center={[38, 30]}
          zoom={3}
          minZoom={2}
          maxZoom={6}
          className="w-full h-full bg-[#090d16]"
          zoomControl={false}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          maxBoundsViscosity={1.0}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            noWrap={true}
          />
          {Object.entries(groupedNews).map(([country, items]) => (
            <CircleMarker
              key={country}
              center={[items[0].lat, items[0].lng]}
              radius={Math.min(10 + items.length * 2, 25)}
              pathOptions={{
                fillColor: items[0].color,
                color: "#ffffff",
                fillOpacity: 0.8,
                weight: 3,
              }}
              eventHandlers={{ click: () => handleCountryMarkerClick(country) }}
            >
              <Tooltip direction="top" offset={[0, -10]}>
                <div className="px-2 py-1 font-bold">
                  {country} <span className="text-indigo-400">({items.length}건)</span>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div
        className={`h-full bg-[#0d1527] border-l border-slate-900/60 px-6 py-8 flex flex-col transition-all duration-500 shrink-0 ${isSidebarOpen ? "w-[380px] lg:w-[450px] opacity-100" : "w-0 opacity-0 hidden"}`}
      >
        {isSidebarOpen && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-slate-900">
              <span className="text-sm font-bold">{selectedCountryNews[0]?.country}</span>
              <button
                onClick={closeSidebar}
                className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800"
              >
                ESC ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto my-5 pr-1 space-y-3">
              {!activeNewsDetail ? (
                selectedCountryNews.map((news) => (
                  <div
                    key={news.id}
                    onClick={() => setActiveNewsDetail(news)}
                    className="p-4 bg-[#111827]/60 hover:bg-slate-900 rounded-xl border border-slate-900 cursor-pointer transition-all"
                  >
                    <span className="text-[10px] font-bold" style={{ color: news.color }}>
                      {news.categoryLabel}
                    </span>
                    <h3 className="text-[13px] font-bold text-slate-200 mt-2 line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                ))
              ) : (
                <div className="animate-fadeIn">
                  <button
                    onClick={() => setActiveNewsDetail(null)}
                    className="text-[11px] text-indigo-400 mb-4"
                  >
                    ← BACK TO LIST
                  </button>
                  <h2 className="text-base font-bold text-slate-100">{activeNewsDetail.title}</h2>
                  <div className="mt-5 text-[13px] text-slate-400 bg-[#090d16]/50 p-5 rounded-xl border border-slate-900 min-h-[200px] whitespace-pre-line">
                    {activeNewsDetail.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
