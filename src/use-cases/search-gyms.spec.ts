import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsInsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsInsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsInsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsInsRepository.create({
      title: 'JS Gym',
      phone: '82828',
      description: 'tope',
      latitude: -33,
      longitude: -23,
    })

    await gymsInsRepository.create({
      title: 'TS Gym',
      phone: '82828',
      description: 'tope',
      latitude: -33,
      longitude: -23,
    })

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JS Gym' })])
  })
  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsInsRepository.create({
        title: `JS Gym ${i}`,
        phone: '82828',
        description: 'tope',
        latitude: -33,
        longitude: -23,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JS',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JS Gym 21' }),
      expect.objectContaining({ title: 'JS Gym 22' }),
    ])
  })
})
