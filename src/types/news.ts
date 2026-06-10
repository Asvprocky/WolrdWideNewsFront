export type Category = "ALL" | "WAR" | "ACCIDENT" | "ECONOMY";

export interface NewsPoint {
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
