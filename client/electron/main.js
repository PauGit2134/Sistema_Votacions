const { app, BrowserWindow } = require('electron');
const path = require('path');

// La forma més fiable de saber si estem en desenvolupament amb Electron
// és comprovar si l'aplicació està empaquetada.
const isDev = !app.isPackaged;

function createWindow() {
  // Crea la finestra del navegador.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // El preload és necessari per comunicar de forma segura el procés principal
      // d'Electron amb la teva aplicació Vue, tot i que en aquest projecte
      // el seu contingut no és crític.
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/favicon.ico') // Assegura't que la icona existeix
  });

  // Carrega l'aplicació Vue.
  if (isDev) {
    // En mode desenvolupament, carreguem la URL del servidor de Vite.
    // Aquest servidor s'ha d'engegar manualment en un altre terminal.
    // Assegura't que el port coincideix amb el que utilitza `npm run dev`.
    const devUrl = 'http://localhost:3000'; // <-- CANVIAT AL PORT CORRECTE
    console.log(`Running in development mode, attempting to load URL: ${devUrl}`);
    mainWindow.loadURL(devUrl);
    // Obre les eines de desenvolupament per poder depurar.
    mainWindow.webContents.openDevTools();
  } else {
    // En mode producció (quan l'app està empaquetada), carreguem el fitxer local.
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log(`Running in production mode, loading file: ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // A macOS, torna a crear la finestra si es clica la icona del dock.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  // Tanca l'app quan totes les finestres es tanquen (excepte a macOS).
  if (process.platform !== 'darwin') app.quit();
});