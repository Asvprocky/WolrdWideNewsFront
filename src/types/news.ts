export type Category = "ALL" | "WAR" | "ACCIDENT" | "ECONOMY" | "POLITICS";

export interface NewsPoint {
  id: number;
  country: string;
  category: Category;
  categoryLabel: string;
  title: string;
  originalContent: string;
  thumbnailUrl?: string;
  isBookmarked: boolean;
  date: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
}
