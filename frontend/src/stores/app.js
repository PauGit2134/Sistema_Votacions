import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const loginInfo = ref({ loggedIn: false, username: '', image: '' })
  const votos = ref([0, 0, 0, 0])

  const isLoggedIn = computed(() => loginInfo.value.loggedIn)

  function setLoginInfo({ loggedIn, username, image }) {
    loginInfo.value = { loggedIn, username, image }
  }

  function setVotos(nousVots) {
    votos.value = nousVots
  }

  return { loginInfo, votos, isLoggedIn, setLoginInfo, setVotos }
})
