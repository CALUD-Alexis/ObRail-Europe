import { test } from '@japa/runner'

test.group('GET /stats/volumes', () => {
  test('returns 200 with statistics object', async ({ client }) => {
    const response = await client.get('/stats/volumes')
    response.assertStatus(200)
  })

  test('contains total count greater than zero', async ({ client, assert }) => {
    const response = await client.get('/stats/volumes')
    response.assertStatus(200)
    const body = response.body()
    assert.isNumber(body.total)
    assert.isAbove(body.total, 0)
  })

  test('byServiceType includes Jour and Nuit', async ({ client, assert }) => {
    const response = await client.get('/stats/volumes')
    response.assertStatus(200)
    const { byServiceType } = response.body()
    assert.isArray(byServiceType)
    const types = byServiceType.map((item: any) => item.serviceType)
    assert.include(types, 'Jour')
    assert.include(types, 'Nuit')
  })

  test('dayPercentage and nightPercentage sum to 100', async ({ client, assert }) => {
    const response = await client.get('/stats/volumes')
    response.assertStatus(200)
    const { dayPercentage, nightPercentage } = response.body()
    const sum = parseFloat(dayPercentage) + parseFloat(nightPercentage)
    assert.approximately(sum, 100, 1)
  })

  test('topAgencies is a non-empty array', async ({ client, assert }) => {
    const response = await client.get('/stats/volumes')
    response.assertStatus(200)
    const { topAgencies } = response.body()
    assert.isArray(topAgencies)
    assert.isAbove(topAgencies.length, 0)
    assert.property(topAgencies[0], 'agencyId')
    assert.property(topAgencies[0], 'count')
  })

  test('averages contains distanceKm and carbonEmissionKg', async ({ client, assert }) => {
    const response = await client.get('/stats/volumes')
    response.assertStatus(200)
    const { averages } = response.body()
    assert.property(averages, 'distanceKm')
    assert.property(averages, 'carbonEmissionKg')
  })
})
