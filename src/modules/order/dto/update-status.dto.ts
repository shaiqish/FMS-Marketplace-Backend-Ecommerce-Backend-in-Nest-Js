import { IsString, IsUUID } from 'class-validator';

export class UpdateStatusDTO {
  @IsUUID()
  orderId: string;

  @IsString()
  status: string;
}
