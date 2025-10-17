export default class WebSocketService {
  constructor(url) {
    this.url = url
    this.ws = null
    this.callbacks = []
  }

  // Connecta al servidor WebSocket
  connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('WebSocket connectat a', this.url)
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // Notifica tots els callbacks registrats amb les dades rebudes
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
      console.error('WebSocket error:', err)
      this.ws.close()
    }
  }

  // Registrar un callback per rebre actualitzacions de vots
  onVoteUpdate(callback) {
    this.callbacks.push(callback)
  }

  // Enviar un vot al servidor
  sendVote(opcio) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(String(opcio))
      console.log('Vot enviat per opcio:', opcio)
    } else {
      console.warn('WebSocket no està connectat. No es pot enviar el vot.')
    }
  }
}
