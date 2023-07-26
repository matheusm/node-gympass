import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIns Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'top',
      description: 'Javascript',
      latitude: new Decimal(-9.6354976),
      longitude: new Decimal(-35.7079223),
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6354976,
      userLongitude: -35.7079223,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6354976,
      userLongitude: -35.7079223,
    })

    vi.setSystemTime(new Date(2022, 0, 20, 2, 0, 0))

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -9.6354976,
        userLongitude: -35.7079223,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6354976,
      userLongitude: -35.7079223,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 0, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -9.6354976,
      userLongitude: -35.7079223,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be not able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'top',
      description: 'Javascript',
      latitude: new Decimal(-9.5690645),
      longitude: new Decimal(-35.646768),
      phone: '',
    })

    await expect(
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -9.6354976,
        userLongitude: -35.7079223,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
