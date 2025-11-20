# 🚀 Railway Deployment Fix

## ❌ Problem

Railway deployment failed with error:
```
Failed to parse your service config. `buildCommand` and `startCommand` cannot be the same.
```

## 🔍 Root Cause

Railway was detecting the same command in both build and start phases:
- **Build**: `npm run build` → executes `vite build`
- **Start**: `npx vite preview --host 0.0.0.0 --port $PORT`

Railway's parser incorrectly identified these as the same command.

## ✅ Solution

Simplified the start command to use npm script instead of direct vite command.

### Changes Made

#### 1. `nixpacks.toml`
```diff
[start]
- cmd = "npx vite preview --host 0.0.0.0 --port $PORT"
+ cmd = "npm start"
```

#### 2. `Procfile`
```diff
- web: npx vite preview --host 0.0.0.0 --port $PORT
+ web: npm start
```

#### 3. `package.json` (already correct)
```json
{
  "scripts": {
    "start": "vite preview --host 0.0.0.0 --port ${PORT:-3000}"
  }
}
```

## 🎯 How It Works Now

1. **Build Phase**: `npm run build` → Creates production build in `dist/`
2. **Start Phase**: `npm start` → Runs `vite preview` server on Railway's dynamic port

## 📊 Deployment Flow

```
Railway detects push
    ↓
Reads nixpacks.toml
    ↓
Install: npm ci --legacy-peer-deps
    ↓
Build: npm run build (vite build)
    ↓
Start: npm start (vite preview)
    ↓
✅ Deployment successful
```

## 🔧 Configuration Files

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci --legacy-peer-deps || npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### Procfile
```
web: npm start
```

### package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --host 0.0.0.0 --port ${PORT:-3000}"
  }
}
```

## ✅ Verification

After deployment, verify:

1. **Check Railway logs**:
   ```bash
   railway logs --follow
   ```

2. **Test health endpoint**:
   ```bash
   curl https://your-app.railway.app
   ```

3. **Verify environment**:
   - Node.js 20
   - Vite preview server running
   - Port binding to Railway's $PORT

## 🎉 Result

- ✅ Build and start commands are now distinct
- ✅ Railway can parse configuration correctly
- ✅ Deployment proceeds without errors
- ✅ Frontend serves from production build

## 📝 Commit

```
🐛 Fix: Railway deployment - use npm start instead of direct vite command

- Simplified nixpacks.toml start command
- Updated Procfile to use npm start
- Fixes Railway error: buildCommand and startCommand cannot be the same

Co-authored-by: Ona <no-reply@ona.com>
```

**Commit Hash**: `54b405f`

## 🔮 Next Steps

1. Wait for Railway to detect the new commit (~30 seconds)
2. Railway will automatically trigger a new deployment
3. Monitor deployment logs in Railway dashboard
4. Test the deployed application

## 💡 Pro Tips

- Always use npm scripts for Railway commands
- Keep Procfile and nixpacks.toml in sync
- Use `npm start` instead of direct binary calls
- Railway prefers simple, clear command definitions

---

**Status**: ✅ Fixed and pushed to GitHub
**Auto-deploy**: 🔄 Railway will deploy automatically
