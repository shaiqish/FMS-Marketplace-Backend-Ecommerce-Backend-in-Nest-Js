import { Type } from 'class-transformer';
import { IsInt, Min, IsUUID } from 'class-validator';

export class AddItemDTO {
  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
