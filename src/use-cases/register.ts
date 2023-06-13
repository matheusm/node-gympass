import { prisma } from '@/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repositoy'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  email: string
  name: string
  password: string
}

export async function registerUseCase({
  name,
  password,
  email,
}: RegisterUseCaseRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('Email already exists')
  }

  const password_hash = await hash(password, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
