"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import CategoryFilter from "@/components/layout/CategoryFilter";
import WorldMap from "@/components/map/WorldMap";
import NewsSidebar from "@/components/news/NewsSideBar";
import { Category, NewsPoint } from "@/types/news";

export default function MainMapPage() {
  const [newsData, setNewsData] = useState<NewsPoint[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("ALL");
  const [selectedCountryNews, setSelectedCountryNews] = useState<NewsPoint[]>([]);
  const [activeNewsDetail, setActiveNewsDetail] = useState<NewsPoint | null>(null);
  const mapRef = useRef<any>(null);

  const mapToCategory = (cat: string): Category => {
    return (cat as Category) || "ECONOMY";
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:8080/articles/all");
        const data = await res.json();
        const mappedData = data.map((n: any) => ({ ...n, category: mapToCategory(n.category) }));
        setNewsData(mappedData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchNews();
  }, []);

  const groupedNews = useMemo(() => {
    const groups: Record<string, NewsPoint[]> = {};
    const filtered = newsData.filter(
      (n) => selectedCategory === "ALL" || n.category === selectedCategory,
    );
    filtered.forEach((n) => {
      if (!groups[n.country]) groups[n.country] = [];

      groups[n.country].push(n);
    });
    return groups;
  }, [newsData, selectedCategory]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setActiveNewsDetail(null);
  };

  const handleCountryMarkerClick = async (name: string) => {
    try {
      // 1. 요청 전 로깅 (디버깅용)
      console.log("클릭된 이름:", name);

      const res = await fetch(`http://localhost:8080/articles/country/${encodeURIComponent(name)}`);

      // 2. 서버 에러(400 등) 체크
      if (!res.ok) {
        console.warn("국가 조회 실패, 언론사 조회로 전환 시도...");
        // 여기서 언론사 API로 다시 시도하거나 에러를 던짐
        throw new Error("서버 응답 오류");
      }

      const data = await res.json();

      // 3. 배열인지 확인하고 상태 업데이트
      if (Array.isArray(data)) {
        const mappedData = data.map((n: any) => ({ ...n, category: mapToCategory(n.category) }));
        setSelectedCountryNews(mappedData);
        setActiveNewsDetail(null);
      }
    } catch (e) {
      console.error("데이터 로드 실패:", e);
      alert("해당 지역/언론사의 뉴스를 불러올 수 없습니다.");
    }
  };

  // 사이드바가 열릴 때 지도 크기 갱신
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize({ animate: true });
    }
  }, [selectedCountryNews.length]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090d16] flex flex-col">
      <div className="h-16 shrink-0 z-[1100]">
        <Navbar>
          <CategoryFilter selectedCategory={selectedCategory} onSelect={handleCategoryClick} />
        </Navbar>
      </div>

      <div className="flex flex-1 w-full h-full overflow-hidden">
        {/* 지도 영역: 사이드바가 나타나면 자동으로 줄어듦 */}
        <div className="flex-1 h-full min-w-0 transition-all duration-500 ease-in-out">
          <WorldMap
            groupedNews={groupedNews}
            mapRef={mapRef}
            onMarkerClick={handleCountryMarkerClick}
          />
        </div>

        {/* 사이드바 영역: flex 구조 안에 배치하여 지도를 밀어냄 */}
        {selectedCountryNews.length > 0 && (
          <div className="h-full flex-shrink-0 transition-all duration-500 ease-in-out shadow-2xl">
            <NewsSidebar
              isOpen={true}
              selectedCategory={selectedCategory}
              newsList={selectedCountryNews}
              activeNews={activeNewsDetail}
              onSelectNews={setActiveNewsDetail}
              onBack={() => setActiveNewsDetail(null)}
              onClose={() => setSelectedCountryNews([])}
            />
          </div>
        )}
      </div>
    </div>
  );
}
