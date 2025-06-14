import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Item } from './item.schema';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ type: [Item], required: true })
  items: Item[];

  @Prop({ required: true })
  totalPrice: number;

}

export const OrderSchema = SchemaFactory.createForClass(Order);