import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UserDto, EditUserDto } from './dto';
import { UserService } from './user.service';

@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOkResponse({ type: UserDto })
  getMe(@GetUser() user: UserDto) {
    return user;
  }

  @Patch()
  @ApiOkResponse({ type: UserDto })
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
