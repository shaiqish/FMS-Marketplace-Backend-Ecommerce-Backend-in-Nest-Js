import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsPhoneNumber('PK')
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber('PK')
  alternatePhoneNumber?: string;

  @IsEmail()
  email: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  postalCode: string;
}
