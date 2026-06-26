import type { HttpContext } from '@adonisjs/core/http'

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ObRail Europe API',
    version: '1.0.0',
    description:
      'API de l\'Observatoire Ferroviaire Européen — MSPR TPRE532. Expose les données de trajets ferroviaires internationaux collectées depuis OpenMobilityData, Eurostat et Back-on-Track.',
    contact: { name: 'ObRail Europe', email: 'contact@obrail.eu' },
    license: { name: 'UNLICENSED' },
  },
  servers: [
    { url: 'http://localhost:3333', description: 'Développement local / Docker' },
  ],
  tags: [
    { name: 'System', description: 'Endpoints système (santé, métriques)' },
    { name: 'Trajets', description: 'Gestion des trajets ferroviaires' },
    { name: 'Statistics', description: 'Statistiques de trafic' },
  ],
  paths: {
    '/health': {
      get: {
        operationId: 'getHealth',
        summary: 'Vérification de l\'état du service',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Service en bonne santé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'number', example: 42.5 },
                    checks: {
                      type: 'object',
                      properties: {
                        database: {
                          type: 'object',
                          properties: {
                            status: { type: 'string', example: 'healthy' },
                            latency: { type: 'number', example: 12 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '503': { description: 'Service dégradé (base de données inaccessible)' },
        },
      },
    },
    '/metrics': {
      get: {
        operationId: 'getMetrics',
        summary: 'Métriques Prometheus',
        description: 'Endpoint scrapé par Prometheus. Expose les métriques Node.js par défaut et les métriques HTTP custom.',
        tags: ['System'],
        responses: {
          '200': {
            description: 'Métriques au format texte Prometheus',
            content: { 'text/plain': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/trajets': {
      get: {
        operationId: 'listTrajets',
        summary: 'Liste paginée des trajets ferroviaires',
        tags: ['Trajets'],
        parameters: [
          { name: 'page', in: 'query', description: 'Numéro de page', schema: { type: 'integer', default: 1, minimum: 1 } },
          { name: 'limit', in: 'query', description: 'Résultats par page (max 100)', schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 } },
          { name: 'agencyId', in: 'query', description: 'Filtrer par opérateur (ex: EUROSTAR, SNCF)', schema: { type: 'string' } },
          { name: 'serviceType', in: 'query', description: 'Filtrer par type de service', schema: { type: 'string', enum: ['Jour', 'Nuit'] } },
          { name: 'originCountry', in: 'query', description: 'Code pays départ (ISO 3166-1 alpha-2)', schema: { type: 'string', example: 'FR' } },
          { name: 'destinationCountry', in: 'query', description: 'Code pays arrivée', schema: { type: 'string', example: 'DE' } },
          { name: 'search', in: 'query', description: 'Recherche textuelle sur ville départ, arrivée et opérateur', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Liste paginée de trajets',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    meta: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer', example: 2456 },
                        perPage: { type: 'integer', example: 20 },
                        currentPage: { type: 'integer', example: 1 },
                        lastPage: { type: 'integer', example: 123 },
                      },
                    },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Trajet' } },
                  },
                },
              },
            },
          },
          '422': { description: 'Paramètres invalides' },
        },
      },
    },
    '/trajets/{id}': {
      get: {
        operationId: 'getTrajet',
        summary: 'Détail d\'un trajet',
        tags: ['Trajets'],
        parameters: [
          { name: 'id', in: 'path', required: true, description: 'Identifiant du trajet (trip_id)', schema: { type: 'string', example: 'TR102898' } },
        ],
        responses: {
          '200': {
            description: 'Détail du trajet',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Trajet' } } },
          },
          '404': {
            description: 'Trajet introuvable',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Trajet not found' },
              },
            },
          },
        },
      },
    },
    '/stats/volumes': {
      get: {
        operationId: 'getStatsVolumes',
        summary: 'Statistiques globales de trafic',
        description: 'Agrégats calculés sur la table trips : total, répartition jour/nuit, top opérateurs, distances et émissions moyennes.',
        tags: ['Statistics'],
        responses: {
          '200': {
            description: 'Statistiques calculées',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Stats' } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Trajet: {
        type: 'object',
        properties: {
          trip_id: { type: 'string', example: 'TR102898' },
          agency_id: { type: 'string', example: 'EUROSTAR' },
          origin_city: { type: 'string', example: 'London' },
          destination_city: { type: 'string', example: 'Paris' },
          origin_country: { type: 'string', example: 'GB' },
          destination_country: { type: 'string', example: 'FR' },
          train_type: { type: 'string', example: 'Eurostar', nullable: true },
          service_type: { type: 'string', enum: ['Jour', 'Nuit'], nullable: true },
          distance_km: { type: 'number', example: 494.2, nullable: true },
          departure_time: { type: 'string', example: '07:01:00', nullable: true },
          arrival_time: { type: 'string', example: '10:17:00', nullable: true },
          carbon_emission_kg: { type: 'number', example: 4.56, nullable: true },
          frequency_per_week: { type: 'integer', example: 45, nullable: true },
          data_source: { type: 'string', example: 'Back-on-Track' },
        },
      },
      Stats: {
        type: 'object',
        properties: {
          total: { type: 'integer', example: 2456 },
          dayPercentage: { type: 'string', example: '63.3' },
          nightPercentage: { type: 'string', example: '36.7' },
          byServiceType: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                serviceType: { type: 'string' },
                count: { type: 'integer' },
                percentage: { type: 'string' },
              },
            },
          },
          topAgencies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                agencyId: { type: 'string', example: 'EUROSTAR' },
                count: { type: 'integer', example: 240 },
              },
            },
          },
          topOriginCountries: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                country: { type: 'string', example: 'FR' },
                count: { type: 'integer', example: 890 },
              },
            },
          },
          averages: {
            type: 'object',
            properties: {
              distanceKm: { type: 'string', example: '621.4' },
              carbonEmissionKg: { type: 'string', example: '7.23' },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Resource not found' },
        },
      },
    },
  },
}

const swaggerHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ObRail Europe — API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; }
    .topbar { display: none !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/docs/swagger.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
      tryItOutEnabled: true,
    })
  </script>
</body>
</html>`

export default class DocsController {
  async swagger({ response }: HttpContext) {
    return response.json(swaggerSpec)
  }

  async ui({ response }: HttpContext) {
    return response.header('Content-Type', 'text/html').send(swaggerHtml)
  }
}
