<template>
  <v-container class="d-flex flex-column align-center justify-center" style="height: 100vh;">
    <h1>Benvingut al Sistema de Votacions</h1>
    <v-text-field label="Usuari" v-model="username" />
    <v-text-field label="Contrasenya" v-model="password" type="password" />
    <v-btn color="primary" @click="login">Entrar</v-btn>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'

const username = ref('')
const password = ref('')
const router = useRouter()
const store = useAppStore()

function login() {
  if (username.value === 'user' && password.value === '123') {
    store.setLoginInfo({ loggedIn: true, username: username.value, image: '' })
    router.push('/votacions')
  } else {
    alert('Credencials incorrectes')
  }
}
</script>
