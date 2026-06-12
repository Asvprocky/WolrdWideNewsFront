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
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:8080/articles/all");
        const data = await res.json();

        console.log(
          "🧪 CATEGORY CHECK:",
          data.map((n: any) => n.category),
        );
        console.log(
          "🌍 COUNTRY CHECK:",
          data.map((n: any) => n.country),
        );
        console.log("🔥 RAW API DATA:", data); // 여기
        setNewsData(data);
      } catch (e) {
        console.error("기사 로딩 실패", e);
      }
    };

    fetchNews();
  }, []);

  const groupedNews = useMemo(() => {
    const groups: Record<string, NewsPoint[]> = {};
    console.log("🧠 grouped keys:", Object.keys(groups));

    const filtered = newsData.filter((news) =>
      selectedCategory === "ALL" ? true : news.category === selectedCategory,
    );

    filtered.forEach((news) => {
      if (!groups[news.country]) {
        groups[news.country] = [];
      }

      groups[news.country].push(news);
    });
    console.log("🌍 grouped keys:", Object.keys(groups)); //  여기

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

  const handleCountryMarkerClick = async (name: string) => {
    // country -> name으로 변경
    try {
      const res = await fetch(`http://localhost:8080/articles/country/${encodeURIComponent(name)}`);
      const data = await res.json();

      console.log("받아온 뉴스 데이터:", data);

      setSelectedCountryNews(data);
      setActiveNewsDetail(null);
    } catch (e) {
      console.error("국가 기사 로딩 실패", e);
    }
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
          {/* Navbar */}
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
