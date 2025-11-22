# 🚀 Render Deployment Guide for MediSense AI

## ✨ Why Render?

- ✅ **No Size Limits** - All your ML dependencies work (LangChain, ChromaDB, FAISS)
- ✅ **Free Tier** - Generous free plan for both backend and frontend
- ✅ **Auto-Deploy** - Automatic deployments from GitHub
- ✅ **Built-in SSL** - Free HTTPS certificates
- ✅ **Easy Setup** - 5 minutes to deploy

---

## 🎯 Quick Deploy (Recommended)

### **Option 1: Blueprint Deploy (Easiest)**

1. **Visit:** https://render.com
2. **Sign Up** with your GitHub account
3. **Click:** "New" → "Blueprint"
4. **Connect Repository:** Select `ritik-gupta001/Medisure.AI`
5. **Add Environment Variable:**
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
6. **Click:** "Apply" 
7. **Wait 5-10 minutes** for deployment ✅

**That's it!** Both backend and frontend will deploy automatically.

---

## 📋 Manual Deploy (Step-by-Step)

### **Step 1: Deploy Backend**

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `Medisure.AI`
4. Configure:
   - **Name:** `medisense-ai-backend`
   - **Environment:** `Python 3`
   - **Region:** `Oregon (US West)` or closest to you
   - **Branch:** `main`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Plan:** `Free`

5. **Add Environment Variables:**
   - `OPENAI_API_KEY` = Your OpenAI API key
   - `PYTHON_VERSION` = `3.11.0`

6. Click **"Create Web Service"**
7. **Copy the URL** (e.g., `https://medisense-ai-backend.onrender.com`)

### **Step 2: Deploy Frontend**

1. Click **"New +"** → **"Static Site"**
2. Connect same repository: `Medisure.AI`
3. Configure:
   - **Name:** `medisense-ai-frontend`
   - **Branch:** `main`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`

4. **Add Environment Variable:**
   - `REACT_APP_API_URL` = Your backend URL from Step 1

5. Click **"Create Static Site"**

---

## 🌐 After Deployment

### **Your Live URLs:**
- **Frontend:** `https://medisense-ai-frontend.onrender.com`
- **Backend API:** `https://medisense-ai-backend.onrender.com`
- **API Docs:** `https://medisense-ai-backend.onrender.com/docs`

### **Test Your Deployment:**
1. Visit your frontend URL
2. Upload a medical PDF
3. Test AI analysis
4. Generate SOAP reports
5. Try the chat feature

---

## ⚙️ Configuration Files

### `render.yaml` (Already Created)
This file tells Render how to deploy both services automatically.

### Environment Variables Needed:
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PYTHON_VERSION` - Python 3.11.0 (optional, auto-detected)

---

## 🔄 Auto-Deploy

Once connected, Render will **automatically deploy** when you:
- Push to the `main` branch
- Make any code changes

You can disable auto-deploy in the Render dashboard if needed.

---

## 💰 Pricing

### **Free Tier Includes:**
- ✅ 750 hours/month of runtime
- ✅ Automatic HTTPS
- ✅ Custom domains (optional)
- ✅ Auto-deploy from GitHub
- ✅ Environment variables
- ✅ Health checks

### **Limitations (Free Tier):**
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 512 MB RAM

### **Upgrade Options:**
- **Starter:** $7/month - Always on, 512 MB RAM
- **Standard:** $25/month - 2 GB RAM, faster
- **Pro:** $85/month - 4 GB RAM, priority support

---

## 🐛 Troubleshooting

### **Backend Build Fails**
**Issue:** Dependencies installation error
**Solution:** 
- Check `requirements.txt` is valid
- Ensure Python version is 3.11.0
- Check build logs for specific errors

### **Frontend Build Fails**
**Issue:** npm install error
**Solution:**
- Check `package.json` is valid
- Clear Render cache and retry
- Check Node.js version (auto-detected)

### **App Slow on First Load**
**Issue:** Free tier spins down after inactivity
**Solution:**
- Wait ~30 seconds for cold start
- Upgrade to Starter plan for always-on service
- Use a service like UptimeRobot to ping every 14 minutes

### **API Not Connecting**
**Issue:** CORS or URL mismatch
**Solution:**
- Verify `REACT_APP_API_URL` in frontend settings
- Check backend URL is correct
- Ensure CORS is enabled in `app.py` (already configured)

### **OpenAI Errors**
**Issue:** API key not working
**Solution:**
- Verify `OPENAI_API_KEY` is set correctly
- Check key has credits
- Ensure no extra spaces in the key

---

## 🔒 Security Best Practices

1. ✅ **Never commit** `.env` file to GitHub
2. ✅ Use Render's environment variables for secrets
3. ✅ Enable **2FA** on your Render account
4. ✅ Use **custom domain** with SSL (free on Render)
5. ✅ Monitor your OpenAI API usage

---

## 📊 Monitoring

### **View Logs:**
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. See real-time application logs

### **Health Checks:**
- Backend: `https://your-backend.onrender.com/health`
- Returns: `{"status": "healthy"}`

### **Metrics:**
- CPU usage
- Memory usage
- Request count
- Response times

---

## 🚀 Performance Tips

1. **Enable Caching** - Render has built-in CDN
2. **Use Redis** - Add Redis for session storage (optional)
3. **Optimize Build** - Use build cache for faster deploys
4. **Database** - Add PostgreSQL if you need data persistence
5. **Upgrade Plan** - For production, use Starter plan ($7/mo)

---

## 🔄 Rollback

If deployment fails or has issues:

1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy"
4. Choose a previous successful commit
5. Click "Deploy"

---

## 🆘 Support

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **Status Page:** https://status.render.com
- **Email Support:** support@render.com

---

## ✅ Deployment Checklist

Before deploying, make sure:

- [ ] Code is pushed to GitHub
- [ ] `requirements.txt` is up to date
- [ ] `frontend/package.json` is valid
- [ ] OpenAI API key is ready
- [ ] All environment variables are documented
- [ ] `.gitignore` excludes `.env`, `venv/`, `node_modules/`
- [ ] App works locally on `localhost:8000` and `localhost:3000`

---

## 🎉 You're Ready!

Your MediSense AI app is now deployed on Render with:
- ✅ Professional SOAP medical reports
- ✅ AI-powered analysis with OpenAI GPT-4o-mini
- ✅ Patient-friendly explanations
- ✅ Color-coded severity indicators
- ✅ Intelligent medical icons
- ✅ Auto-deploy from GitHub
- ✅ Free HTTPS/SSL
- ✅ Global CDN

**Live at:** `https://medisense-ai-frontend.onrender.com`

Enjoy your deployment! 🚀
