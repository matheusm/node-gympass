import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositoy'
import { UserAlreadyExists } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUseCase } from '@/use-cases/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    await registerUseCase.execute({ email, name, password })
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return res.status(409).send()
    }

    throw error
  }

  return res.status(201).send()
}
