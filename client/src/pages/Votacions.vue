<template>
  <v-container>
    <div class="text-center mb-5">
      <h1>Panell de Votacions</h1>
      <h3 class="text-subtitle-1">Hola, {{ store.loginInfo.username }}!</h3>
    </div>

    <v-row justify="center" class="mb-5">
      <v-col v-for="(vots, key) in store.votos" :key="key" cols="auto">
        <BotoVotar
          :index="key" 
          :total="vots"
          @votar="registrarVot"
        />
      </v-col>
    </v-row>

    <GraficVots />
  </v-container>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import BotoVotar from '@/components/BotoVotar.vue'
import GraficVots from '@/components/GraficVots.vue'
import WebSocketService from '@/services/WebSocketService'

const store = useAppStore()
const router = useRouter()
let wsService = null

onMounted(() => {
  // 1. Protecció de ruta
  if (!store.isLoggedIn) {
    router.push('/')
    return
  }

  // 2. Connexió WebSocket (Port 3000 segons docker-compose.yml)
  wsService = new WebSocketService()
  wsService.connect()

  // 3. Quan arriben vots, actualitzem el store
  wsService.onVoteUpdate((nousVots) => {
    console.log('Dades rebudes:', nousVots);
    store.setVotos(nousVots);
  })
})

onUnmounted(() => {
  if (wsService && wsService.ws) {
    wsService.ws.close()
  }
})

function registrarVot(opcio) {
  if (wsService) {
    wsService.sendVote(opcio)
  }
}
</script>