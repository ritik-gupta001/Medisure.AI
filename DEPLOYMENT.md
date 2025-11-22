# 🚀 MediSense AI - Render Deployment Guide

This guide will help you deploy MediSense AI to Render with both backend and frontend services.

## 📋 Prerequisites

- GitHub account with your MediSense AI repository
- [Render account](https://render.com) (free tier available)
- OpenAI API key

## 🎯 Deployment Options

### Option 1: Using render.yaml (Blueprint) - Recommended

This method deploys both backend and frontend automatically using the `render.yaml` configuration.

#### Step 1: Prepare Your Repository

1. Ensure all files are committed and pushed to GitHub:
```bash
git add .
git commit -m "🚀 Add Render deployment configuration"
git push origin main
```

#### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository: `ritik-gupta001/Medisure.AI`
4. Render will detect the `render.yaml` file
5. Click **"Apply"** to create both services

#### Step 3: Configure Environment Variables

After deployment starts, configure the backend service:

1. Go to your **medisense-ai-backend** service
2. Navigate to **Environment** tab
3. Add the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: `gpt-4o-mini`
   - `CHROMA_PERSIST_DIRECTORY`: `./chroma_db`
   - `FAISS_INDEX_PATH`: `./faiss_index`

4. Click **"Save Changes"** - This will trigger a redeploy

#### Step 4: Update Frontend API URL

1. Go to your **medisense-ai-frontend** service
2. Navigate to **Environment** tab
3. Add/Update:
   - `REACT_APP_API_URL`: `https://medisense-ai-backend.onrender.com`
4. Click **"Save Changes"**

---

### Option 2: Manual Deployment (Alternative)

If you prefer to deploy services separately:

#### Deploy Backend Service

1. In Render Dashboard, click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `medisense-ai-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
4. Add Environment Variables (see Step 3 above)
5. Click **"Create Web Service"**

#### Deploy Frontend Service

1. In Render Dashboard, click **"New"** → **Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `medisense-ai-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Add Environment Variable:
   - `REACT_APP_API_URL`: `https://medisense-ai-backend.onrender.com`
5. Click **"Create Static Site"**

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings (Already Done)

The backend `app.py` already includes Render URLs in CORS configuration:
```python
allow_origins=[
    "https://*.onrender.com",
    "https://medisense-ai-frontend.onrender.com"
]
```

### 2. Test Your Deployment

Once both services are deployed:

1. **Backend Health Check**: 
   - Visit: `https://medisense-ai-backend.onrender.com/health`
   - Should return: `{"status": "healthy"}`

2. **Frontend**:
   - Visit: `https://medisense-ai-frontend.onrender.com`
   - You should see the MediSense AI interface

3. **Test Analysis**:
   - Upload a medical PDF
   - Verify AI analysis works

### 3. Custom Domain (Optional)

1. In Render Dashboard, go to your frontend service
2. Navigate to **Settings** → **Custom Domains**
3. Add your custom domain and follow DNS setup instructions

---

## ⚙️ Environment Variables Reference

### Backend Service

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes |
| `OPENAI_MODEL` | `gpt-4o-mini` | ✅ Yes |
| `PYTHON_VERSION` | `3.11.0` | Auto-set |
| `CHROMA_PERSIST_DIRECTORY` | `./chroma_db` | Optional |
| `FAISS_INDEX_PATH` | `./faiss_index` | Optional |

### Frontend Service

| Variable | Value | Required |
|----------|-------|----------|
| `REACT_APP_API_URL` | Backend URL from Render | ✅ Yes |
| `NODE_VERSION` | `18.17.0` | Auto-set |

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails with dependency errors
- **Solution**: Check `requirements.txt` and ensure all packages are compatible
- Run locally: `pip install -r requirements.txt` to verify

**Problem**: App crashes on startup
- **Solution**: Check Render logs for errors
- Verify `OPENAI_API_KEY` is set correctly
- Ensure port is set to `$PORT` in start command

**Problem**: 503 Service Unavailable
- **Solution**: Free tier services spin down after inactivity
- First request may take 30-60 seconds to wake up

### Frontend Issues

**Problem**: API calls fail with CORS errors
- **Solution**: Verify `REACT_APP_API_URL` points to correct backend URL
- Check backend CORS configuration includes frontend URL

**Problem**: Blank page or build errors
- **Solution**: Check Render build logs
- Verify all npm dependencies are in `package.json`
- Test build locally: `npm run build`

**Problem**: Environment variables not working
- **Solution**: Environment variables must start with `REACT_APP_`
- Redeploy frontend after changing env vars

---

## 💰 Pricing Information

### Free Tier Includes:
- ✅ 750 hours/month of runtime
- ✅ Automatic SSL certificates
- ✅ Continuous deployment from Git
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ 100GB bandwidth/month

### Upgrade to Paid:
- 💪 Services stay always-on
- 💪 More resources and bandwidth
- 💪 Priority support

---

## 📊 Monitoring Your Deployment

### View Logs

1. Go to your service in Render Dashboard
2. Click **"Logs"** tab
3. Monitor real-time application logs

### Check Metrics

1. Navigate to **"Metrics"** tab
2. View CPU, memory, and bandwidth usage

---

## 🔄 Updating Your Deployment

### Automatic Deployment (Default)

Render automatically deploys when you push to your GitHub repository:

```bash
# Make changes to your code
git add .
git commit -m "🎨 Update feature"
git push origin main
# Render will automatically redeploy
```

### Manual Deployment

1. Go to your service in Render Dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🎉 Success Checklist

- [ ] Backend service deployed and healthy
- [ ] Frontend static site deployed
- [ ] Environment variables configured
- [ ] Health endpoint returns success
- [ ] Frontend loads correctly
- [ ] Can upload and analyze medical PDFs
- [ ] AI chat interface works
- [ ] Download reports function works

---

## 📧 Support

If you encounter issues:

1. Check [Render Documentation](https://render.com/docs)
2. Review application logs in Render Dashboard
3. Open an issue on [GitHub](https://github.com/ritik-gupta001/Medisure.AI/issues)

---

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com/)
- [Render Python Docs](https://render.com/docs/deploy-fastapi)
- [Render Static Site Docs](https://render.com/docs/deploy-create-react-app)
- [GitHub Repository](https://github.com/ritik-gupta001/Medisure.AI)

---

**🎊 Congratulations! Your MediSense AI is now live on Render!**

Access your deployed application at:
- **Frontend**: `https://medisense-ai-frontend.onrender.com`
- **Backend API**: `https://medisense-ai-backend.onrender.com`
- **API Docs**: `https://medisense-ai-backend.onrender.com/docs`
