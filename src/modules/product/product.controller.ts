import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImageUploadInterceptor } from 'src/common/Interceptors/ProductImageUploadInterceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(ProductImageUploadInterceptor())
  async create(
    @UploadedFiles()
    files: { images?: Express.Multer.File[] } = {},
    @Body() body: CreateProductDto,
  ) {
    const imageFilenames =
      files.images?.map((file) => `/uploads/${file.filename}`) || [];

    const data = {
      ...body,
      availableQuantity: Number(body.availableQuantity),
      unitPrice: Number(body.unitPrice),
      images: imageFilenames,
    };
    return this.productService.create(data);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(ProductImageUploadInterceptor())
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] } = {},
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const imageFilenames =
      files.images?.map((file) => `/uploads/${file.filename}`) || [];

    const updatedData = {
      ...updateProductDto,
      ...(imageFilenames.length > 0 && { images: imageFilenames }),
    };

    return this.productService.update(id, updatedData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
