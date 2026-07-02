import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Trajet from '#models/trajet'

// Sample data matching the real trips table schema from the MSPR2 dataset.
// In production, data is loaded via postgres/init.sql (pg_dump from MSPR2).
export default class extends BaseSeeder {
  async run() {
    await Trajet.createMany([
      {
        tripId: 'TR100001',
        agencyId: 'SNCF',
        originCity: 'Paris',
        destinationCity: 'Milan',
        originCountry: 'FR',
        destinationCountry: 'IT',
        trainType: 'TGV',
        serviceType: 'Jour',
        distanceKm: 1069,
        departureTime: '07:15',
        arrivalTime: '14:30',
        carbonEmissionKg: 3.48,
        frequencyPerWeek: 29,
        dataSource: 'OpenMobilityData',
      },
      {
        tripId: 'TR100002',
        agencyId: 'OBB',
        originCity: 'Paris',
        destinationCity: 'Munich',
        originCountry: 'FR',
        destinationCountry: 'DE',
        trainType: 'Nightjet',
        serviceType: 'Nuit',
        distanceKm: 955,
        departureTime: '21:20',
        arrivalTime: '06:45',
        carbonEmissionKg: 12.99,
        frequencyPerWeek: 6,
        dataSource: 'Eurostat',
      },
      {
        tripId: 'TR100003',
        agencyId: 'EUROSTAR',
        originCity: 'London',
        destinationCity: 'Paris',
        originCountry: 'GB',
        destinationCountry: 'FR',
        trainType: 'Eurostar',
        serviceType: 'Jour',
        distanceKm: 494,
        departureTime: '07:01',
        arrivalTime: '10:17',
        carbonEmissionKg: 4.56,
        frequencyPerWeek: 45,
        dataSource: 'Back-on-Track',
      },
    ])
  }
}
