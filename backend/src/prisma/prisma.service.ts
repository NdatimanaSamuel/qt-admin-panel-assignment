// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('✅ Connected to SQLite database via Prisma');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // expose Prisma methods
  get client(): PrismaClient {
    return this.prisma;
  }
}
