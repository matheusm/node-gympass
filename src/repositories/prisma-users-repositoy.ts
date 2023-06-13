import { prisma } from '@/prisma'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    await prisma.user.create({
      data,
    })
  }
}
