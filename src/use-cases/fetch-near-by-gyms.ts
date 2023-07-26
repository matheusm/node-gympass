import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface FetchNearByGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
  page: number
}

interface FetchNearByGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearByGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearByGymsUseCaseRequest): Promise<FetchNearByGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
      page,
    })

    return {
      gyms,
    }
  }
}
