import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}