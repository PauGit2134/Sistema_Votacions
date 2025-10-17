<template>
  <v-btn @click="$emit('votar', opcio)">
    Votar opció {{ opcio }} ({{ total }} vots)
  </v-btn>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  opcio: Number,
  total: Number
})
</script>
