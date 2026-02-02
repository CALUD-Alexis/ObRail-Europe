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

router.get('/', async () => {
  return {
    name: 'ObRail Europe API',
    version: '1.0.0',
    description: 'European Railway Observatory API',
  }
})

// Trajets routes
router.get('/trajets', [TrajetsController, 'index'])
router.get('/trajets/:id', [TrajetsController, 'show'])
