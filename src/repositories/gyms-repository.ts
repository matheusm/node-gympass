import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearByParams {
  latitude: number
  longitude: number
  page: number
  perPage: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findMany(query: string, page: number): Promise<Gym[]>
  findManyNearBy(params: FindManyNearByParams): Promise<Gym[]>
}
