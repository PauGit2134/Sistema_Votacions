# Sistema de Votacions en Temps Real

Aquest projecte és una aplicació completa de votacions que s'actualitza en temps real per a tots els usuaris connectats. Ha estat desenvolupat com a part d'una pràctica per demostrar un stack tecnològic modern.

**Tecnologies utilitzades:**
- **Frontend**: Vue 3 (Composition API), Vuetify, Pinia, Vue Router, Chart.js
- **Backend**: Node.js, WebSockets (llibreria `ws`)
- **Escriptori**: Electron
- **Contenidorització**: Docker, Docker Compose

---

##  Prerequisites

Abans de començar, assegura't de tenir instal·lat el següent software:
- Node.js (versió 18 o superior recomanada)
- Docker i Docker Compose

---

## ⚙️ Instal·lació

1.  Clona aquest repositori al teu ordinador.
2.  Instal·la les dependències tant per al client com per al servidor:

    ```bash
    # Instal·la les dependències del servidor
    cd servidor
    npm install

    # Torna a l'arrel i instal·la les dependències del client
    cd ../client
    npm install
    ```

---

## 🚀 Execució del Projecte

Pots executar l'aplicació de tres maneres diferents, segons les teves necessitats.

### 1. Execució en Local (Mode Desenvolupament Web)

Aquest mètode és ideal per desenvolupar la part web de l'aplicació. Necessitaràs **dos terminals**.

1.  **Terminal 1 (Backend)**: Inicia el servidor de WebSockets.
    ```bash
    cd servidor
    node index.js
    ```
    *El servidor estarà escoltant al port 3999.*

2.  **Terminal 2 (Frontend)**: Inicia el servidor de desenvolupament de Vite.
    ```bash
    cd client
    npm run dev
    ```
    *L'aplicació web serà accessible a http://localhost:3000.*

### 2. Execució amb Docker (Entorn Contenidoritzat)

Aquest mètode utilitza Docker Compose per aixecar tota l'aplicació (client i servidor) amb una sola comanda. És la forma més senzilla de posar-ho tot en marxa.

1.  Assegura't que Docker Desktop estigui funcionant.
2.  Des de la carpeta arrel del projecte, executa:
    ```bash
    docker-compose up
    ```
3.  Un cop els contenidors estiguin en marxa, accedeix a l'aplicació des del teu navegador a:
    **http://localhost:8080**

    Per aturar els contenidors, prem `Ctrl + C` al terminal i després executa `docker-compose down`.

### 3. Execució com a Aplicació d'Escriptori (Electron)

Aquest mètode llança l'aplicació com una finestra d'escriptori nativa. Necessitaràs **tres terminals** per al mode de desenvolupament.

1.  **Terminal 1 (Backend)**: Inicia el servidor de WebSockets.
    ```bash
    cd servidor
    node index.js
    ```

2.  **Terminal 2 (Frontend)**: Inicia el servidor de desenvolupament de Vite.
    ```bash
    cd client
    npm run dev
    ```

3.  **Terminal 3 (Electron)**: Un cop els dos servidors anteriors estiguin funcionant, llança l'aplicació Electron.
    ```bash
    cd client
    npm run electron:dev
    ```
    *S'obrirà una finestra d'escriptori amb l'aplicació carregada.*

---

## 📦 Empaquetament per a Producció

Per crear un executable de l'aplicació d'escriptori (per exemple, un `.exe` per a Windows), segueix aquests passos:

1.  A la carpeta `client`, executa la comanda de build:
    ```bash
    cd client
    npm run electron:build
    ```
2.  Un cop finalitzat, trobaràs l'instal·lador a la carpeta `client/dist`.
