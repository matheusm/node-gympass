import { prisma } from '@/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  email: string
  name: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, password, email }: RegisterUseCaseRequest) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('Email already exists')
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
