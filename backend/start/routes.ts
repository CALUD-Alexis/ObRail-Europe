/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const TrajetsController = () => import('#controllers/trajets_controller')
const StatsController = () => import('#controllers/stats_controller')
const HealthController = () => import('#controllers/health_controller')
const MetricsController = () => import('#controllers/metrics_controller')
const DocsController = () => import('#controllers/docs_controller')

router.get('/', async () => {
  return {
    name: 'ObRail Europe API',
    version: '1.0.0',
    description: 'European Railway Observatory API',
    docs: '/docs',
  }
})

// System routes
router.get('/health', [HealthController, 'check'])
router.get('/metrics', [MetricsController, 'index'])

// API Documentation (Swagger UI + spec)
router.get('/docs', [DocsController, 'ui'])
router.get('/docs/swagger.json', [DocsController, 'swagger'])

// Trajets routes
router.get('/trajets', [TrajetsController, 'index'])
router.get('/trajets/:id', [TrajetsController, 'show'])

// Stats routes
router.get('/stats/volumes', [StatsController, 'volumes'])
