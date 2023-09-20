import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = (await import('@/app')).app

    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'Johm Doe',
      email: 'johndoe@ex.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@ex.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@ex.com',
      }),
    )
  })
})
