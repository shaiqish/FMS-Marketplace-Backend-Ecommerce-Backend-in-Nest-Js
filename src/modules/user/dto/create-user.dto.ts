// src/modules/user/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;
}
