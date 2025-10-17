<template>
  <v-container>
    <BotoVotar
      v-for="(vot, index) in store.votos"
      :key="index"
      :total="vot"
      :opcio="index"
      @votar="registrarVot"
    />
    <GraficVots :vots="store.votos" />
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import BotoVotar from '@/components/BotoVotar.vue'
import GraficVots from '@/components/GraficVots.vue'
import WebSocketService from '@/services/WebSocketService'

const store = useAppStore()
const router = useRouter()
let wsService

onMounted(() => {
  if (!store.isLoggedIn) router.push('/')
  wsService = new WebSocketService('ws://localhost:3999')
  wsService.connect()
  wsService.onVoteUpdate((nousVots) => {
    store.setVotos(nousVots)
  })
})

function registrarVot(opcio) {
  if (wsService) wsService.sendVote(opcio)
}
</script>