import { createPinia } from 'pinia'
const pinia = createPinia()

if (import.meta.env.DEV) {
  pinia.use(({ store }) => {
    store.$subscribe((mutation, state) => {
      console.log(`[${mutation.storeId}] ${mutation.type}`, state)
    })
  })
}

export default pinia