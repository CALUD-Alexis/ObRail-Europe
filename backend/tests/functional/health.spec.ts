import { test } from '@japa/runner'

test.group('GET /health', () => {
  test('returns 200 with healthy status', async ({ client }) => {
    const response = await client.get('/health')
    response.assertStatus(200)
    response.assertBodyContains({ status: 'healthy' })
  })

  test('includes timestamp and uptime fields', async ({ client, assert }) => {
    const response = await client.get('/health')
    response.assertStatus(200)
    const body = response.body()
    assert.property(body, 'timestamp')
    assert.property(body, 'uptime')
    assert.isNumber(body.uptime)
  })

  test('reports database as healthy', async ({ client, assert }) => {
    const response = await client.get('/health')
    response.assertStatus(200)
    const body = response.body()
    assert.deepPropertyVal(body, 'checks.database.status', 'healthy')
    assert.property(body.checks.database, 'latency')
  })
})
