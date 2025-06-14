import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class DailySalesQueryDto {
  @ApiProperty({
    description: 'Date in YYYY-MM-DD format',
    example: '2025-01-01',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$'
  })
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must be a valid date in YYYY-MM-DD format' })
  date: string;
} 