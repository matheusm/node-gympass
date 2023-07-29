import { FetchNearByGymsUseCase } from '../fetch-near-by-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearByGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearByGymsUseCase(gymsRepository)

  return useCase
}
