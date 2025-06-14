import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../common/dto/paginated-response.dto';
import { Order } from '../schemas/order.schema';

export class PaginatedOrdersResponseDto {
  @ApiProperty({ 
    description: 'Array of orders',
    type: [Order]
  })
  data: Order[];

  @ApiProperty({ 
    description: 'Pagination metadata',
    type: PaginationMetaDto 
  })
  meta: PaginationMetaDto;
} 