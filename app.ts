import { Application } from './deps.ts'
import { router } from './router.ts'

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

console.log('listen on 8000')
app.listen({ port: 8000 })
