import { prisma } from '@/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return userWithSameEmail
  }

  async findByEmail(email: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return userWithSameEmail
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
