import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    let category: Category | null = null;
    if (createProductDto.category) {
      category = await this.categoryRepository.findOne({
        where: { name: createProductDto.category },
      });
      if (!category) {
        category = await this.categoryRepository.save({
          name: createProductDto.category,
        });
      }
    }
    return this.productRepository.save({
      productName: createProductDto.productName,
      availableQuantity: createProductDto.availableQuantity,
      unit: createProductDto.unit,
      unitPrice: createProductDto.unitPrice,
      productLocation: createProductDto.productLocation,
      description: createProductDto.description,
      images: createProductDto.images,
      ...(category && { category }), // this should be a Category entity object
    });
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let categoryEntity: Category | null = null;

    if (updateProductDto.category) {
      categoryEntity = await this.categoryRepository.findOne({
        where: { name: updateProductDto.category },
      });

      if (!categoryEntity) {
        categoryEntity = await this.categoryRepository.save({
          name: updateProductDto.category,
        });
      }
    }

    const { category, ...rest } = updateProductDto;

    return this.productRepository.update(id, {
      ...rest,
      ...(categoryEntity && { category: categoryEntity }),
    });
  }

  remove(id: string) {
    return this.productRepository.delete(id);
  }
}
