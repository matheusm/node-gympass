import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = (await import('@/app')).app

    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to find nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript gym',
        description: 'The best gym to learn javascript',
        phone: '123456789',
        latitude: -9.6354976,
        longitude: -35.7079223,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript gym',
        description: 'The best gym to learn javascript',
        phone: '123456789',
        latitude: -9.4050132,
        longitude: -35.520859,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: -9.6354976,
        longitude: -35.7079223,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript gym',
      }),
    ])
  })
})
