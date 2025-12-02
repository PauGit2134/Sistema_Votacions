const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

const isDev = process.env.NODE_ENV === 'development'
let viteProcess

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Permet que els enllaços externs s'obrin al navegador per defecte
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  return mainWindow
}

if (isDev) {
  function startVite() {
    const vitePath = path.resolve(process.cwd(), 'node_modules', '.bin', 'vite')
    
    viteProcess = spawn(vitePath, ['--port', '5173'], {
      cwd: process.cwd(),
      shell: true,
      stdio: 'inherit'
    })

    viteProcess.on('error', (err) => {
      console.error('Failed to start Vite:', err)
      app.quit()
    })

    viteProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Vite process exited with code ${code}`)
        app.quit()
      }
    })
  }

  app.whenReady().then(() => {
    startVite()
    createMainWindow()
  })

} else {
  app.whenReady().then(createMainWindow)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (viteProcess) {
      viteProcess.kill()
    }
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})