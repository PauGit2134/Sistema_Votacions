<template>
  <v-container class="fill-height justify-center">
    <v-card width="400" class="pa-4">
      <v-card-title class="text-center">🔑 Accés al Sistema</v-card-title>
      
      <v-card-text>
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mb-4"
          density="compact"
        >
          {{ error }}
        </v-alert>

        <v-text-field 
          v-model="username" 
          label="Usuari" 
          prepend-inner-icon="mdi-account"
          :disabled="loading"
          @input="clearError"
          @keyup.enter="handleLogin"
        ></v-text-field>
        
        <v-text-field 
          v-model="password" 
          label="Contrasenya" 
          type="password"
          prepend-inner-icon="mdi-lock"
          :disabled="loading"
          @input="clearError"
          @keyup.enter="handleLogin"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn 
          block 
          color="primary" 
          size="large" 
          :loading="loading"
          :disabled="loading"
          @click="handleLogin"
        >
          Entrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();
const store = useAppStore();

const handleLogin = () => {
  if (loading.value) return;

  loading.value = true;
  error.value = '';

  setTimeout(() => {
    if (username.value === 'user' && password.value === '123') {
      store.setLoginInfo({
        loggedIn: true,
        username: username.value,
        image: 'avatar.png'
      });
      router.push('/votacions');
    } else {
      error.value = 'Credencials incorrectes. Prova: user / 123';
      password.value = ''; // Netejar el camp de la contrasenya
      loading.value = false;
    }
  }, 500);
};

const clearError = () => {
  error.value = '';
};
</script>