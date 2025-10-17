import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3999; // Port configurable
const VOTOS_FILE = path.resolve('./votos.json');

const server = createServer(app);
const wss = new WebSocketServer({ server });

// 1️⃣ Inicializamos los votos en memoria
let votos = { '0': 0, '1': 0, '2': 0, '3': 0 };

// 2️⃣ Cargamos el estado inicial desde votos.json o creamos uno nuevo
try {
  if (fs.existsSync(VOTOS_FILE)) {
    const data = fs.readFileSync(VOTOS_FILE, 'utf8');
    votos = JSON.parse(data);
    console.log('Estado inicial de votos cargado desde votos.json');
  } else {
    fs.writeFileSync(VOTOS_FILE, JSON.stringify(votos, null, 2));
    console.log('votos.json no existía, se ha creado uno nuevo.');
  }
} catch (err) {
  console.error('Error al leer o crear votos.json:', err.message);
}

// Función para difundir mensaje a todos los clientes
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

// Conexión WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado al WebSocket');

  // 3️⃣ Enviar estado actual al nuevo cliente
  ws.send(JSON.stringify(votos));

  ws.on('message', (message) => {
    const votedOption = message.toString();
    console.log('Recibido voto para opción:', votedOption);

    if (votos.hasOwnProperty(votedOption)) {
      votos[votedOption]++;

      // Guardamos los votos actualizados
      fs.writeFile(VOTOS_FILE, JSON.stringify(votos, null, 2), (err) => {
        if (err) {
          console.error('Error al guardar votos.json:', err);
          return;
        }
        console.log('Votos actualizados:', votos);
        broadcast(votos);
      });
    } else {
      console.warn(`Opción "${votedOption}" no válida.`);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Endpoint opcional para debug / ver votos actuales en JSON
app.get('/votos', (req, res) => {
  res.json(votos);
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
