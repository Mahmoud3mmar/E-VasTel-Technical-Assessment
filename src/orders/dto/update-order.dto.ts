import { IsString, IsEmail, IsArray, IsNumber, Min, IsInt, MinLength, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class UpdateItemDTO {
  @ApiPropertyOptional({
    description: 'Item name',
    example: 'Pizza Margherita'
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({
    description: 'Item price',
    example: 15.99,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Item quantity',
    example: 2,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class UpdateOrderDTO {
  @ApiPropertyOptional({
    description: 'Customer full name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'john.doe@example.com'
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'List of items in the order',
    type: [UpdateItemDTO]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateItemDTO)
  items?: UpdateItemDTO[];

  

}