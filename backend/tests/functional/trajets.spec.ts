import { test } from '@japa/runner'

test.group('GET /trajets', () => {
  test('returns 200 with paginated data', async ({ client, assert }) => {
    const response = await client.get('/trajets')
    response.assertStatus(200)
    const body = response.body()
    assert.isArray(body.data)
    assert.property(body, 'meta')
    assert.isNumber(body.meta.total)
    assert.isNumber(body.meta.currentPage)
  })

  test('respects limit query param', async ({ client, assert }) => {
    const response = await client.get('/trajets').qs({ limit: 5 })
    response.assertStatus(200)
    const body = response.body()
    assert.isAtMost(body.data.length, 5)
  })

  test('filters by serviceType=Nuit', async ({ client, assert }) => {
    const response = await client.get('/trajets').qs({ serviceType: 'Nuit', limit: 20 })
    response.assertStatus(200)
    const body = response.body()
    body.data.forEach((trajet: any) => {
      assert.equal(trajet.serviceType, 'Nuit')
    })
  })

  test('returns non-empty list (real data loaded)', async ({ client, assert }) => {
    const response = await client.get('/trajets')
    response.assertStatus(200)
    assert.isAbove(response.body().meta.total, 0)
  })
})

test.group('GET /trajets/:id', () => {
  test('returns 404 for unknown trip id', async ({ client }) => {
    const response = await client.get('/trajets/NONEXISTENT_TRIP_ID_999')
    response.assertStatus(404)
  })

  test('returns trip details for a valid id', async ({ client, assert }) => {
    const listResponse = await client.get('/trajets').qs({ limit: 1 })
    listResponse.assertStatus(200)
    const { data } = listResponse.body()
    if (data.length > 0) {
      const tripId = data[0].tripId
      const response = await client.get(`/trajets/${tripId}`)
      response.assertStatus(200)
      assert.equal(response.body().tripId, tripId)
    }
  })

  test('returned trip has expected fields', async ({ client, assert }) => {
    const listResponse = await client.get('/trajets').qs({ limit: 1 })
    const { data } = listResponse.body()
    if (data.length > 0) {
      const response = await client.get(`/trajets/${data[0].tripId}`)
      response.assertStatus(200)
      const trajet = response.body()
      assert.property(trajet, 'tripId')
      assert.property(trajet, 'agencyId')
      assert.property(trajet, 'originCity')
      assert.property(trajet, 'destinationCity')
    }
  })
})
