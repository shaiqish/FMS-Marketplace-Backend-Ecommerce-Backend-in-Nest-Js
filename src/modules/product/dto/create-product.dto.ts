import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  productName: string;

  @IsString()
  category: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  availableQuantity: number;

  @IsString()
  unit: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  unitPrice: number;

  @IsString()
  productLocation: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
