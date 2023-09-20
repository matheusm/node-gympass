import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = (await import('@/app')).app

    await app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Johm Doe',
      email: 'johndoe@ex.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
  })
})
