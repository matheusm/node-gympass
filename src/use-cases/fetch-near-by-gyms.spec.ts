import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearByGymsUseCase } from './fetch-near-by-gyms'

let gymsInsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsUseCase

describe('Fetch Near by Gyms Use Case', () => {
  beforeEach(async () => {
    gymsInsRepository = new InMemoryGymsRepository()
    sut = new FetchNearByGymsUseCase(gymsInsRepository)
  })

  it('should be able to fetch near by gyms', async () => {
    await gymsInsRepository.create({
      title: 'Near Gym',
      phone: '82828',
      description: 'tope',
      latitude: -9.6354976,
      longitude: -35.7079223,
    })

    await gymsInsRepository.create({
      title: 'Far Gym',
      phone: '82828',
      description: 'tope',
      latitude: -9.4050132,
      longitude: -35.520859,
    })

    const { gyms } = await sut.execute({
      userLatitude: -9.6354976,
      userLongitude: -35.7079223,
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 11; i++) {
      await gymsInsRepository.create({
        title: `Near Gym ${i}`,
        phone: '82828',
        description: 'tope',
        latitude: -9.6354976,
        longitude: -35.7079223,
      })
    }

    for (let i = 1; i <= 11; i++) {
      await gymsInsRepository.create({
        title: `Far Gym ${i}`,
        phone: '82828',
        description: 'tope',
        latitude: -9.4050132,
        longitude: -35.520859,
      })
    }

    const { gyms } = await sut.execute({
      userLatitude: -9.6354976,
      userLongitude: -35.7079223,
      page: 1,
    })

    expect(gyms).toHaveLength(11)
  })
})
