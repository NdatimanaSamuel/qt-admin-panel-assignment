import { Body, Controller, Delete, Param, Patch, Post, Get, Res } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as protobuf from 'protobufjs';
import type { Response } from 'express';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // get all users
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }
@Get('export')
async exportUsers(@Res() res: Response) {
  const buffer = await this.userService.exportUsersProtobuf();
  res.setHeader('Content-Type', 'application/octet-stream');
  res.send(buffer);
}

@Get('public-key')
async getPublicKey() {
  const publicPath = path.join(process.cwd(), 'keys', 'public.pem'); // 👈 points to backend/keys/public.pem
  const pk = fs.readFileSync(publicPath, 'utf8');

  // Convert to SPKI format if needed
  const keyObject = crypto.createPublicKey(pk);
  const spkiPem = keyObject.export({ type: 'spki', format: 'pem' });

  return spkiPem; // frontend can use this
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }

@Get('stats/weekly')
async getWeeklyUserStats() {
  return this.userService.getWeeklyUserStats();
}


}
