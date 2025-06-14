import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DailySalesReport } from './interfaces/report.interface';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { DailySalesReportDto } from './dto/daily-sales-report.dto';

@ApiTags('reports') 
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-sales')
  @ApiOperation({ summary: 'Generate daily sales report' })
  @ApiQuery({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Daily sales report', type: DailySalesReportDto })
  async getDailySalesReport(@Query('date') date: string): Promise<DailySalesReport> {
    return this.reportsService.generateDailySalesReport(date);
  }
}