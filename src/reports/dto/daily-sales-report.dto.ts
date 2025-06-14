import { ApiProperty } from '@nestjs/swagger';

export class TopSellingItemDto {
  @ApiProperty({ description: 'Item name', example: 'Pizza Margherita' })
  name: string;

  @ApiProperty({ description: 'Number of items sold', example: 15 })
  count: number;
}

export class DailySalesReportDto {
  @ApiProperty({ 
    description: 'Report date in YYYY-MM-DD format', 
    example: '2025-01-01' 
  })
  date: string;

  @ApiProperty({ 
    description: 'Total revenue for the day', 
    example: 1250.50 
  })
  totalRevenue: number;

  @ApiProperty({ 
    description: 'Total number of completed orders', 
    example: 25 
  })
  totalOrders: number;

  @ApiProperty({ 
    description: 'Top 5 selling items for the day',
    type: [TopSellingItemDto]
  })
  topSellingItems: TopSellingItemDto[];
} 