import { Type } from 'class-transformer';
import { IsInt, Min, IsUUID } from 'class-validator';

export class AddItemDTO {
  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
