import { Controller, Get, Post, Body, Param, HttpCode, Put, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrderQueryDto } from './dto/order-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: Order })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  async create(@Body() createOrderDto: CreateOrderDTO): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get orders with pagination and filters' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of orders', 
    type: PaginatedOrdersResponseDto 
  })
  async findAll(@Query() queryDto: OrderQueryDto): Promise<PaginatedOrdersResponseDto> {
    return this.ordersService.findAllPaginated(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ 
    summary: 'Update order (partial updates supported)',
    description: 'Update any order fields. Only provided fields will be updated. Total price recalculated automatically when items change.'
  })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Invalid update data' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDTO,
  ): Promise<Order> {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }
}