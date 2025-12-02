const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3999';

export default class WebSocketService {
  constructor() {
    this.url = WEBSOCKET_URL;
    this.ws = null
    this.callbacks = []
  }

  connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('WebSocket connectat a', this.url)
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // El servidor envia directament l'objecte de vots
        this.callbacks.forEach((cb) => cb(data))
      } catch (err) {
        console.error('Error processant missatge WebSocket:', err)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket desconnectat. Reconnectant en 3s...')
      setTimeout(() => this.connect(), 3000)
    }

    this.ws.onerror = (err) => {
      console.error('Error de connexió WebSocket. Assegura-te que el servidor està funcionant al port correcte.', err)
    }
  }

  onVoteUpdate(callback) {
    this.callbacks.push(callback)
  }

  sendVote(opcio) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // El servidor espera un string (ex: "1")
      this.ws.send(String(opcio))
    } else {
      console.warn('WebSocket no està connectat.')
    }
  }
}