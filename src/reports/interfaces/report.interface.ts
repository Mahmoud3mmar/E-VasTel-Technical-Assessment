export interface DailySalesReport {
    date: string;
    totalRevenue: number;
    totalOrders: number;
    topSellingItems: { name: string; count: number }[];
  }