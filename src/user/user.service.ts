import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(nickname?: string) {
    const query: Prisma.UserFindManyArgs = {};
    if (nickname) {
      query.where = {
        nickname: nickname,
      };
    }
    const users = await this.prisma.user.findMany(query);
    return users.map((user) => {
      delete user.hash;
      return user;
    });
  }

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }
}
