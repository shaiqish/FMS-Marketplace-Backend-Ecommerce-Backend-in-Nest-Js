import { IsString, IsOptional, IsUrl, IsPhoneNumber } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber('PK')
  phoneNumber?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
