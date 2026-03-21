# Pokedex (MERN)

A full-stack Pokedex app with:

- Express + MongoDB (Mongoose) backend
- React frontend (Create React App)
- Heroku-ready deployment setup

## Local Development

1. Set backend env vars:

```bash
cp backend/.env.example backend/.env
```

2. Update `backend/.env` with your MongoDB URI.

3. Install dependencies:

```bash
npm install
```

4. Run backend:

```bash
npm --prefix backend run dev
```

5. Run frontend (in a second terminal):

```bash
npm --prefix frontend start
```

## Production Build (Local)

```bash
npm run build
npm start
```

The backend serves the frontend build in production mode.

## React Native App (Expo)

A React Native version of this app is now available in `mobile/`.

### 1) Install mobile dependencies

```bash
npm --prefix mobile install
```

### 2) Run backend API

```bash
npm --prefix backend run dev
```

### 3) Configure API base URL for Expo

Copy the template and adjust it if needed:

```bash
cp mobile/.env.example mobile/.env
```

Then start the app:

```bash
npm --prefix mobile start
```

For physical devices, replace `localhost` with your computer's LAN IP (for example `http://192.168.1.10:8000/api/v1`).

### 4) Launch on simulator/device

Use Expo CLI options (`i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go).

## Heroku Deployment

1. Create a Heroku app and connect your repo.
2. In Heroku Config Vars, set:
   - `DATABASE_URL`
   - `NODE_ENV=production`
3. Deploy the `main` branch.

The root `package.json` is configured so Heroku:

- installs frontend/backend dependencies
- builds the React app
- starts the backend server

## API Endpoints

Base URL: `/api/v1`

- `GET /pokemon`
- `GET /pokemon/:id`
- `POST /pokemon`
- `PATCH /pokemon/:id`
- `DELETE /pokemon/:id`
- `GET /health`

Example payload for create/update:

```json
{
  "name": "Charizard",
  "types": ["Fire", "Flying"],
  "level": 36
}
```
