import { Inject, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { DailySalesReport } from './interfaces/report.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/orders/schemas/order.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, 
  ) {}

  async generateDailySalesReport(date: string): Promise<DailySalesReport> {
    // Validate date format
    this.validateDateFormat(date);
    
    const cacheKey = `daily_sales_report_${date}`;
    
    // Try to get from cache first
    const cachedReport = await this.getCachedReport(cacheKey);
    if (cachedReport) {
      return cachedReport;
    }

    try {
      const { startOfDay, endOfDay } = this.getDateRange(date);
      const report = await this.aggregateDailySalesData(startOfDay, endOfDay, date);
      
      const result: DailySalesReport = report[0] || this.getEmptyReport(date);

      // Cache the report for 1 hour (3600 seconds)
      await this.cacheReport(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('Error generating sales report:', error);
      throw new InternalServerErrorException('Failed to generate sales report');  
    }
  }

  private validateDateFormat(date: string): void {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new BadRequestException('Date must be in YYYY-MM-DD format');
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException('Invalid date provided');
    }

    // Check if date is not in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (parsedDate > today) {
      throw new BadRequestException('Cannot generate report for future dates');
    }
  }

  private getDateRange(date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  }

  private async getCachedReport(cacheKey: string): Promise<DailySalesReport | null> {
    try {
      const cachedData = await this.cacheManager.get<DailySalesReport>(cacheKey);
      
      return cachedData || null;
    } catch (error) {
      console.warn('Failed to retrieve from cache:', error);
      return null;
    }
  }

  private async cacheReport(cacheKey: string, report: DailySalesReport): Promise<void> {
    try {
      await this.cacheManager.set(cacheKey, report, 3600); // 1 hour TTL
    } catch (error) {
      // Don't throw error, just log it - caching failure shouldn't break the response
    }
  }

  private getEmptyReport(date: string): DailySalesReport {
    return {
      date,
      totalRevenue: 0,
      totalOrders: 0,
      topSellingItems: [],
    };
  }

  private async aggregateDailySalesData(startOfDay: Date, endOfDay: Date, date: string) {
    return await this.orderModel.aggregate([
      // Stage 1: Match orders for the specific date
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      
      // Stage 2: Group all orders to get totals and collect all items
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          allItems: { $push: '$items' },
        },
      },
      
      // Stage 3: Unwind the allItems array to get individual item arrays
      {
        $unwind: {
          path: '$allItems',
          preserveNullAndEmptyArrays: true,
        },
      },
      
      // Stage 4: Unwind individual items
      {
        $unwind: {
          path: '$allItems',
          preserveNullAndEmptyArrays: true,
        },
      },
      
      // Stage 5: Group by item name to calculate quantities sold
      {
        $group: {
          _id: '$allItems.name',
          count: { $sum: '$allItems.quantity' },
          totalRevenue: { $first: '$totalRevenue' },
          totalOrders: { $first: '$totalOrders' },
        },
      },
      
      // Stage 6: Sort by count (most sold items first)
      {
        $sort: { count: -1 },
      },
      
      // Stage 7: Limit to top 5 selling items
      {
        $limit: 5,
      },
      
      // Stage 8: Group back to create final report structure
      {
        $group: {
          _id: null,
          totalRevenue: { $first: '$totalRevenue' },
          totalOrders: { $first: '$totalOrders' },
          topSellingItems: {
            $push: { 
              name: '$_id', 
              count: '$count' 
            },
          },
        },
      },
      
      // Stage 9:  final structure
      {
        $project: {
          _id: 0,
          date: { $literal: date },
          totalRevenue: 1,
          totalOrders: 1,
          topSellingItems: 1,
        },
      },
    ]);
  }
}