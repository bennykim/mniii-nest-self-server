import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  nickname: string | null;

  @ApiProperty()
  firstName: string | null;

  @ApiProperty()
  lastName: string | null;
}
