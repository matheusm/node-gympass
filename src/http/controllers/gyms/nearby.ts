import { makeFetchNearByGymsUseCase } from '@/use-cases/factories/make-fetch-near-by-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearBy(req: FastifyRequest, res: FastifyReply) {
  const nearByGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearByGymsQuerySchema.parse(req.query)

  const fetchNearByGymsUseCase = makeFetchNearByGymsUseCase()

  const { gyms } = await fetchNearByGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    page: 1,
  })

  return res.status(200).send({
    gyms,
  })
}
