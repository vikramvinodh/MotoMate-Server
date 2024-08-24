import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  create(@Body() createProductDto: Partial<Product>) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('filter')
  async filter(
    @Query('name') name?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('isFeatured') isFeatured?: boolean,
  ) {
    return this.productService.filter({
      name,
      category,
      brand,
      isFeatured,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Partial<Product>) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
