"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import RadarHeader from "@/components/layout/RadarHeader";
import CategoryFilter from "@/components/layout/CategoryFilter";
import WorldMap from "@/components/map/WorldMap";
import NewsSidebar from "@/components/news/NewsSideBar";
import { Category, NewsPoint } from "@/types/news";
import Navbar from "@/components/layout/Navbar";

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
        categoryLabel: "경제·유가",
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
        categoryLabel: "전쟁·분쟁",
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
        categoryLabel: "경제·유가",
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
        categoryLabel: "사건·사고",
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
        categoryLabel: "경제·유가",
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
        categoryLabel: "사건·사고",
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

  const groupedNews = useMemo(() => {
    const groups: Record<string, NewsPoint[]> = {};

    const filtered = newsData.filter((news) =>
      selectedCategory === "ALL" ? true : news.category === selectedCategory,
    );

    filtered.forEach((news) => {
      if (!groups[news.country]) {
        groups[news.country] = [];
      }

      groups[news.country].push(news);
    });

    return groups;
  }, [newsData, selectedCategory]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setActiveNewsDetail(null);

    if (category === "ALL") {
      setSelectedCountryNews([]);
      return;
    }

    const filtered = newsData.filter((news) => news.category === category);

    setSelectedCountryNews(filtered);
  };

  const handleCountryMarkerClick = (country: string) => {
    setSelectedCountryNews(groupedNews[country]);
    setActiveNewsDetail(null);
  };

  const closeSidebar = () => {
    setSelectedCountryNews([]);
    setActiveNewsDetail(null);
  };

  const isSidebarOpen = selectedCountryNews.length > 0;

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.invalidateSize({ animate: true });

    const interval = setInterval(() => {
      mapRef.current?.invalidateSize({
        animate: true,
        pan: true,
      });
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
    }, 550);
  }, [isSidebarOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090d16] flex flex-col">
      {/* 1. 상단 네브바 공간 */}
      <div className="h-16 shrink-0 z-[1100]">
        <Navbar>
          {/* Navbar 내부로 이동! 이제 absolute가 아니어도 됩니다 */}
          <CategoryFilter selectedCategory={selectedCategory} onSelect={handleCategoryClick} />
        </Navbar>
      </div>

      {/* 2. 메인 컨텐츠 영역 (여기서 flex 사용) */}
      <div className="flex flex-1 w-full h-full overflow-hidden">
        {/* 지도 영역: 사이드바가 열리면 flex-1이 줄어들며 자연스럽게 왼쪽으로 밀림 */}
        <div className="relative flex-1 h-full min-w-0 transition-all duration-500 ease-in-out">
          <WorldMap
            groupedNews={groupedNews}
            mapRef={mapRef}
            onMarkerClick={handleCountryMarkerClick}
          />
        </div>

        {/* 3. 사이드바 영역: flex 구조 안에 배치하여 지도를 밀어냄 */}
        {isSidebarOpen && (
          <div className="h-full z-[1050] transition-all duration-500 ease-in-out">
            <NewsSidebar
              isOpen={isSidebarOpen}
              selectedCategory={selectedCategory}
              newsList={selectedCountryNews}
              activeNews={activeNewsDetail}
              onSelectNews={setActiveNewsDetail}
              onBack={() => setActiveNewsDetail(null)}
              onClose={closeSidebar}
            />
          </div>
        )}
      </div>
    </div>
  );
}
