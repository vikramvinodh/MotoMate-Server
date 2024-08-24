import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  imageUrl: string;

  @Prop({ default: 0 })
  discount: number; // Discount in percentage

  @Prop({ default: null })
  offer: string; // Text describing any offers, e.g., "Buy 1 Get 1 Free"

  @Prop({ default: Date.now })
  addedOn: Date;

  @Prop({ default: 'generic' })
  category: string; // Category of the spare part, e.g., "engine", "brakes", "wheels"

  @Prop()
  brand: string; 

  @Prop()
  compatibleBikes: string[]; 

  @Prop({ default: false })
  isFeatured: boolean; 

  @Prop()
  warrantyPeriod: string; 

  @Prop()
  manufacturerDetails: string; 
}

export const ProductSchema = SchemaFactory.createForClass(Product);
