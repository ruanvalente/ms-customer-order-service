import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
