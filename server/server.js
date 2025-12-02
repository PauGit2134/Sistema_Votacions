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

// 1️⃣ Inicializamos los votos en memoria como un array
let votos = [0, 0, 0, 0]; 

// 2️⃣ Cargamos el estado inicial desde votos.json o creamos uno nuevo
try {
  if (fs.existsSync(VOTOS_FILE)) {
    const data = fs.readFileSync(VOTOS_FILE, 'utf8');
    const parsedVotos = JSON.parse(data);
    // Asegurarse de que sea un array y tenga el tamaño esperado
    if (Array.isArray(parsedVotos) && parsedVotos.length === 4) {
      votos = parsedVotos;
      console.log('Estado inicial de votos cargado desde votos.json');
    } else {
      console.warn('votos.json contiene un formato inesperado, inicializando con valores predeterminados.');
      fs.writeFileSync(VOTOS_FILE, JSON.stringify(votos, null, 2));
    }
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
    const votedOptionIndex = parseInt(message.toString(), 10); // Convertir a número
    console.log('Recibido voto para opción (índice):', votedOptionIndex);

    // Validar que el índice sea válido
    if (!isNaN(votedOptionIndex) && votedOptionIndex >= 0 && votedOptionIndex < votos.length) {
      votos[votedOptionIndex]++;

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
      console.warn(`Opción de voto (índice) "${votedOptionIndex}" no válida.`);
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
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});