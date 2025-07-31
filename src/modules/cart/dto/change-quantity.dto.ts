import { IsUUID } from 'class-validator';

export class ChangeQuantityDTO {
  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;
}
