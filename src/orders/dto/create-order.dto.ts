import { IsString, IsEmail, IsArray, IsNumber, Min, IsInt, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ItemDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  customerName: string;

  @ApiProperty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ type: [ItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDTO)
  items: ItemDTO[];
}