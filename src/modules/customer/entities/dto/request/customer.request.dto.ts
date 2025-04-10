import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CustomerRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
    default: 'John Doe',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Customer e-mail',
    default: 'john.doe@example.com',
    uniqueItems: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '99 99999999',
    description: 'Customer phone number',
    default: '99 99999999',
  })
  phoneNumber: string;
}
