import { Injectable, NotFoundException, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'crypto';
import { successResponse } from '../common/response.util';
import * as protobuf from 'protobufjs'
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
  private privateKey: crypto.KeyObject;
  private publicKey: crypto.KeyObject;

  constructor(private prisma: PrismaService) {
const privatePath = path.join(process.cwd(), 'keys', 'private.pem');
const publicPath = path.join(process.cwd(), 'keys', 'public.pem');

this.privateKey = crypto.createPrivateKey(fs.readFileSync(privatePath, 'utf8'));
this.publicKey = crypto.createPublicKey(fs.readFileSync(publicPath, 'utf8'));
  }

  // 🔹 CREATE USER
  async create(createUserDto: CreateUserDto) {
    const { email, role, status } = createUserDto;
   
        if (!email || !role || !status) {
      throw new BadRequestException('Email, role and status are required.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    const emailHash = crypto.createHash('sha384').update(email).digest('hex');
    const signature = crypto.sign('sha384', Buffer.from(emailHash), this.privateKey).toString('hex');

    try {
      const user = await this.prisma.client.user.create({
        data: { email, role, status, signature },
      });

      const publicKey = this.publicKey.export({ type: 'pkcs1', format: 'pem' });
      return successResponse('✅ User created successfully', { user, publicKey });

    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new BadRequestException('A user with this email already exists');
      }
      throw error;
    }
  }

  //  GET ALL USERS
  // async findAll() {
  //   return this.prisma.client.user.findMany();
  // }

  async getWeeklyUserStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

 const users = await this.prisma.client.user.findMany({
  where: {
    createdAt: {
      gte: sevenDaysAgo,
    },
  },
  select: {
    createdAt: true,
  },
});

  // Group users by day
  const stats = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

    const count = users.filter(
      (u) => new Date(u.createdAt).toDateString() === date.toDateString()
    ).length;

    return { day: dayLabel, count };
  });

  return { message: '✅ Weekly user stats fetched successfully', stats };
}

  //  GET SINGLE USER
  async findOne(id: number) {
    const user = await this.prisma.client.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // 🔹 UPDATE USER
  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.client.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: `User with ID ${id} not found.` },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedUser = await this.prisma.client.user.update({
      where: { id },
      data: updateUserDto,
    });

      if (updatedUser.email) {
      const emailHash = crypto.createHash("sha384").update(updatedUser.email).digest("hex");
      const signature = crypto.sign("sha384", Buffer.from(emailHash), this.privateKey).toString("hex");

      // persist the new signature to the database
      await this.prisma.client.user.update({
        where: { id },
        data: { signature },
      });

      // refresh the updatedUser object with latest data
      const refreshedUser = await this.prisma.client.user.findUnique({ where: { id } });
      if (refreshedUser) {
        Object.assign(updatedUser, refreshedUser);
      }
    }


    return { statusCode: HttpStatus.OK, message: 'User updated successfully', data: updatedUser };
  }

  // 🔹 DELETE USER
  async removeUser(id: number) {
    const existingUser = await this.prisma.client.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: `User with ID ${id} not found.` },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.client.user.delete({ where: { id } });
    return { statusCode: HttpStatus.OK, message: 'User deleted successfully' };
  }

  // 🔹 EXPORT USERS IN PROTOBUF
  async exportUsersProtobuf(): Promise<Buffer> {
    const users = await this.prisma.client.user.findMany(); 

    const root = await protobuf.load('src/proto/user.proto');
    const UserList = root.lookupType('user.UserList');

    const payload = {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role === 'ADMIN' ? 0 : 1,
        status: u.status === 'ACTIVE' ? 0 : 1,
        createdAt: u.createdAt.toISOString(),
        signature: u.signature,
      })),
    };

    const errMsg = UserList.verify(payload);
    if (errMsg) throw new Error(errMsg);

    const message = UserList.create(payload);

    return Buffer.from(UserList.encode(message).finish()); // ✅ convert to Buffer
  }

  // 🔹 GET PUBLIC KEY
  getPublicKey(): string {
  return this.publicKey.export({ type: 'pkcs1', format: 'pem' }).toString();
}

}
