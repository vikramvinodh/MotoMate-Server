import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  create(createProductDto: Partial<Product>): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: Partial<Product>): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (result === null) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async filter(filters: {
    name?: string;
    category?: string;
    brand?: string;
    isFeatured?: boolean;
  }) {

    const pipeline: any[] = [];

    if (filters.name) {
      pipeline.push({
        $match: { name: { $regex: filters.name, $options: 'i' } },
      });
    }

    if (filters.category) {
      pipeline.push({
        $match: { category: filters.category },
      });
    }

    if (filters.brand) {
      pipeline.push({
        $match: { brand: filters.brand },
      });
    }

    if (filters.isFeatured !== undefined) {
      pipeline.push({
        $match: { isFeatured: filters.isFeatured },
      });
    }


    return this.productModel.aggregate(pipeline).exec();
  }
}
