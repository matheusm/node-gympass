import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = (await import('@/app')).app

    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'Johm Doe',
      email: 'johndoe@ex.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@ex.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
