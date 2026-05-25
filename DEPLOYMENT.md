# Deployment Guide

This repository is a MERN application with separate frontend and backend folders.

## 1. Prepare the project

- Frontend: `client/` (Vite + React)
- Backend: `server/` (Express)
- Database: MongoDB Atlas

### Confirm scripts
- `client/package.json` should include `build: "vite build"`
- `server/package.json` should include `start: "node server.js"`
- `server/server.js` should listen on `process.env.PORT || 5002`

### Ignore local env files
The repo already ignores `.env*` in `.gitignore`, so local secrets are not committed.

## 2. Push code to GitHub

If this repository is not yet pushed, run:

```powershell
cd c:\Users\Vaji\OneDrive\Documents\teampulseai-final
git add .
git commit -m "Prepare project for deployment"
git push origin main
```

If the repo already has a remote, just commit and push your changes.

## 3. Deploy backend on Render

1. Sign in to Render.
2. Create a new `Web Service`.
3. Connect your GitHub repository.
4. Set `Root Directory` to `server`.
5. Use these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`
   - Branch: `main`

### Required environment variables
Set these values in the Render dashboard under service `Environment`:

- `MONGO_URI` = `mongodb+srv://<USER>:<PASSWORD>@cluster0.mongodb.net/<DB_NAME>?retryWrites=true&w=majority`
- `JWT_SECRET` = `your_jwt_secret_here`
- `CLIENT_URL` = `https://your-frontend.vercel.app`
- `NODE_ENV` = `production`

Render will provide the backend URL after deployment, for example:

`https://your-backend.onrender.com`

## 4. Deploy frontend on Vercel

1. Sign in to Vercel.
2. Create a new project and import your GitHub repo.
3. Set `Root Directory` to `client`.
4. Use these settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Add Vercel environment variable
In Vercel project settings, add:

- `VITE_API_URL` = `https://your-backend.onrender.com`

## 5. Connect frontend with backend URL

Your frontend reads the backend URL from `client/src/config.js`:

```js
export const API_URL = import.meta.env.VITE_API_URL || "";
```

That means all client API calls will use the deployed backend URL when Vercel builds the app.

## 6. Common deployment errors

### CORS errors
- Ensure Render `CLIENT_URL` is the exact Vercel app URL.
- In `server/app.js`, CORS is configured with `origin: process.env.CLIENT_URL || "http://localhost:5173"`.
- If you still see blocked requests, verify the frontend URL and backend URL are correct.

### API not working / 404
- Frontend API requests should use `/api/...` routes.
- Backend routes are mounted at `/api`, so the full URL is:
  `https://your-backend.onrender.com/api/<route>`

### MongoDB connection failures
- Check MongoDB Atlas user and password.
- Ensure the cluster allows network access from your backend.
- Use the correct Atlas URI format in `MONGO_URI`.

### Vercel build failures
- Make sure `client` is the root directory.
- Ensure `dist` is the output directory for Vite.
- Confirm `VITE_API_URL` is defined in Vercel.

## Notes

- Do not commit `.env` files.
- Keep secrets only in Render and Vercel environment settings.
- If you want, you can also create a `server/render.yaml` or `client/vercel.json`, but they are not required for manual deployment.
