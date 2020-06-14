import { Router } from './deps.ts'
import { buzz } from './buzz/app.ts'

export const router = new Router()
router
  .get('/', async (ctx) => {
    await buzz.launch()
    ctx.response.body = 'hello moment!'
  })
  .get('/start', async (ctx) => {
    await buzz.launch()
    ctx.response.body = 'start ok!'
  })
  .get('/stop', async (ctx) => {
    await buzz.stop()
    ctx.response.body = 'stop ok!'
  })

// export function getRouter() {
//   return router
// }