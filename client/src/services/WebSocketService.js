function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const WEBSOCKET_URL = 'ws://localhost:3999';

export default class WebSocketService {
  constructor() {
    this.url = WEBSOCKET_URL;
    this.ws = null
    this.callbacks = []
    this.clientId = this._generateClientId(); // Generar un nuevo ID de cliente cada vez
    this.hasVoted = false; // Nuevo estado para controlar si el cliente ya votó en esta sesión/pestaña
  }

  _generateClientId() {
    return generateUUID();
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket ya conectado o conectando. No se intenta una nueva conexión.');
      return;
    }

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('WebSocket connectat a', this.url)
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        // El servidor envia directament l'objecte de vots o un estado
        if (data.status === 'already_voted') {
          console.warn('Ya has votado en esta sesión. Tu voto anterior ha sido registrado.');
        } else {
          this.callbacks.forEach((cb) => cb(data))
        }
      } catch (err) {
        console.error('Error processant missatge WebSocket:', err)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket desconnectat.');
      console.log('Reconectando en 3s...');
      setTimeout(() => this.connect(), 3000);
    }

    this.ws.onerror = (err) => {
      console.error('Error de connexió WebSocket. Assegura-te que el servidor està funcionant al port correcte.', err)
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    }
  }

  onVoteUpdate(callback) {
    this.callbacks.push(callback)
  }

  sendVote(opcio) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && !this.hasVoted) {
      // El servidor espera un objeto JSON con clientId y votedOptionIndex
      const message = JSON.stringify({
        clientId: this.clientId,
        votedOptionIndex: opcio
      });
      this.ws.send(message);
      this.hasVoted = true; // Marcar que el cliente ha votado en esta sesión
    } else if (this.hasVoted) {
      console.warn('Ya has votado en esta sesión, no puedes votar de nuevo.');
    } else {
      console.warn('WebSocket no está conectado para enviar voto.');
    }
  }
}