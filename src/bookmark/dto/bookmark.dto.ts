import { ApiProperty } from '@nestjs/swagger';

export class BookmarkDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  userId: number;
}
