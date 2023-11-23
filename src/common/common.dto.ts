import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty({ example: 'successful', description: 'Success message' })
  message: string;
}
