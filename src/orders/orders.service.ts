import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { PaginatedOrdersResponseDto } from './dto/paginated-orders-response.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async createOrder(createOrderDto: CreateOrderDTO): Promise<Order> {
    const totalPrice = this.calculateTotalPrice(createOrderDto.items);
    this.validateTotalPrice(totalPrice);

    const order = new this.orderModel({
      ...createOrderDto,
      totalPrice,
    });
    return order.save();
  }

  async findAllPaginated(queryDto: OrderQueryDto): Promise<PaginatedOrdersResponseDto> {
    const { page = 1, limit = 10, startDate, endDate, customerName } = queryDto;
    
    const filter = this.buildSearchFilter({ startDate, endDate, customerName });
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      meta: {
        page,
        limit,
        totalCount,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDTO): Promise<Order> {
    const existingOrder = await this.findOne(id);
    
    const updateData = this.buildUpdateData(existingOrder, updateOrderDto);
    
    if (Object.keys(updateData).length === 0) {
      return existingOrder;
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateData, { 
        new: true,
        runValidators: true 
      })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  private buildUpdateData(existingOrder: Order, updateDto: UpdateOrderDTO): any {
    const updateData: any = {};

    // Handle simple field updates
    this.updateSimpleFields(updateData, updateDto);

    // Handle items update with total price recalculation
    if (updateDto.items !== undefined) {
      const updatedItems = this.processItemsUpdate(existingOrder.items, updateDto.items);
      const newTotalPrice = this.calculateTotalPrice(updatedItems);
      
      this.validateTotalPrice(newTotalPrice);
      
      updateData.items = updatedItems;
      updateData.totalPrice = newTotalPrice;
    }

    // Add timestamp if any updates are made
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
    }

    return updateData;
  }

  private updateSimpleFields(updateData: any, updateDto: UpdateOrderDTO): void {
    const simpleFields = ['customerName', 'customerEmail'];
    
    simpleFields.forEach(field => {
      if (updateDto[field] !== undefined) {
        updateData[field] = updateDto[field];
      }
    });
  }

  private processItemsUpdate(existingItems: any[], updateItems: any[]): any[] {
    if (!Array.isArray(updateItems)) {
      throw new BadRequestException('Items must be an array');
    }

    return updateItems.map((updateItem, index) => {
      const existingItem = existingItems[index] || {};
      
      const processedItem = {
        name: updateItem.name ?? existingItem.name,
        price: updateItem.price ?? existingItem.price,
        quantity: updateItem.quantity ?? existingItem.quantity,
      };

      this.validateItem(processedItem, index);
      return processedItem;
    });
  }

  private validateItem(item: any, index?: number): void {
    const prefix = index !== undefined ? `Item at index ${index}` : 'Item';
    
    if (!item.name?.trim()) {
      throw new BadRequestException(`${prefix}: name is required`);
    }
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new BadRequestException(`${prefix}: price must be a non-negative number`);
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new BadRequestException(`${prefix}: quantity must be a positive integer`);
    }
  }

  private calculateTotalPrice(items: Array<{price: number, quantity: number}>): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  private validateTotalPrice(totalPrice: number): void {
    if (totalPrice <= 0) {
      throw new BadRequestException('Total price must be greater than zero');
    }
  }

  private buildSearchFilter(filters: { startDate?: string, endDate?: string, customerName?: string }): any {
    const filter: any = {};
    
    if (filters.startDate || filters.endDate) {
      filter.createdAt = {};
      if (filters.startDate) {
        filter.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDateTime = new Date(filters.endDate);
        endDateTime.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDateTime;
      }
    }
    
    if (filters.customerName) {
      filter.customerName = { $regex: filters.customerName, $options: 'i' };
    }

    return filter;
  }


}