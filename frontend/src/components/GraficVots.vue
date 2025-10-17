<template>
  <DoughnutChart :chart-data="chartData" />
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { DoughnutChart } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const store = useAppStore()

const chartData = computed(() => ({
  labels: ['Opció 0', 'Opció 1', 'Opció 2', 'Opció 3'],
  datasets: [
    {
      label: 'Vots',
      data: store.votos,
      backgroundColor: ['#f87979', '#a1cfff', '#f7dc6f', '#82e0aa']
    }
  ]
}))
</script>
