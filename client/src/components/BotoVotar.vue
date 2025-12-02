<template>
  <v-btn color="secondary" @click="$emit('votar', index)">
    Votar Opció {{ index + 1 }} ({{ total }} vots)
  </v-btn>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  index: Number, // Ahora es un índice numérico
  total: Number
})
</script>