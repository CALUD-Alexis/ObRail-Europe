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
const GaresController = () => import('#controllers/gares_controller')
const OperateursController = () => import('#controllers/operateurs_controller')
const StatsController = () => import('#controllers/stats_controller')
const HealthController = () => import('#controllers/health_controller')

router.get('/', async () => {
  return {
    name: 'ObRail Europe API',
    version: '1.0.0',
    description: 'European Railway Observatory API',
  }
})

router.group(() => {
  // Health check
  router.get('/health', [HealthController, 'check'])

  // Trajets
  router.get('/trajets', [TrajetsController, 'index'])
  router.post('/trajets', [TrajetsController, 'create'])
  router.get('/trajets/:id', [TrajetsController, 'show'])
  router.put('/trajets/:id', [TrajetsController, 'update'])
  router.delete('/trajets/:id', [TrajetsController, 'destroy'])

  // Gares
  router.get('/gares', [GaresController, 'index'])
  router.post('/gares', [GaresController, 'create'])
  router.get('/gares/:id', [GaresController, 'show'])
  router.put('/gares/:id', [GaresController, 'update'])
  router.delete('/gares/:id', [GaresController, 'destroy'])

  // Opérateurs
  router.get('/operateurs', [OperateursController, 'index'])
  router.post('/operateurs', [OperateursController, 'create'])
  router.get('/operateurs/:id', [OperateursController, 'show'])
  router.put('/operateurs/:id', [OperateursController, 'update'])
  router.delete('/operateurs/:id', [OperateursController, 'destroy'])

  // Stats
  router.get('/stats/volumes', [StatsController, 'volumes'])
}).prefix('/api')
