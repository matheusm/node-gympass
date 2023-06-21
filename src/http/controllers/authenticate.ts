import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositoy'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredencialsError } from '@/use-cases/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

    await authenticateUseCase.execute({ email, password })
  } catch (error) {
    if (error instanceof InvalidCredencialsError) {
      return res.status(400).send({ message: error.message })
    }

    throw error
  }

  return res.status(200).send()
}
