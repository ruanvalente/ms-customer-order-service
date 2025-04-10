import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CustomerRequestDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @ApiProperty({
    example: 'John Doe',
    description: 'Customer name',
    default: 'John Doe',
  })
  name: string;

  @IsEmail({}, { message: 'Invalid e-mail format.' })
  @IsNotEmpty({ message: 'E-mail is required ' })
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Customer e-mail',
    default: 'john.doe@example.com',
    uniqueItems: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'phoneNumber is required ' })
  @Matches(/^\d{2} \d{9}$/, {
    message: 'Phone number must follow the format: 99 999999999',
  })
  @ApiProperty({
    example: '99 99999999',
    description: 'Customer phone number',
    default: '99 99999999',
  })
  phoneNumber: string;
}
