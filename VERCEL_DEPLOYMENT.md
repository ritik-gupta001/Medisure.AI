# 🚀 Deploying MediSense AI to Vercel

This guide will help you deploy MediSense AI to Vercel with both frontend and backend.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be on GitHub
3. **OpenAI API Key**: Get it from [platform.openai.com](https://platform.openai.com)

## 🔧 Deployment Steps

### 1️⃣ Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2️⃣ Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com/new](https://vercel.com/new)**
2. **Import your GitHub repository** (ritik-gupta001/Medisure.AI)
3. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: `./` (leave as root)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `OPENAI_API_KEY` = `your-openai-api-key-here`
   - Environment: Production, Preview, Development (select all)

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (~3-5 minutes)

### 3️⃣ Deploy via Vercel CLI

Alternatively, deploy from your terminal:

```bash
# Login to Vercel
vercel login

# Navigate to project directory
cd "C:\Users\ritik\OneDrive\Desktop\MediSense AI"

# Deploy to production
vercel --prod

# When prompted:
# - Set up and deploy? Yes
# - Link to existing project? No
# - Project name: medisense-ai (or your choice)
# - Directory: ./ (press Enter)
```

After deployment, add environment variables:

```bash
# Add OpenAI API key
vercel env add OPENAI_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development
```

Then redeploy:

```bash
vercel --prod
```

## 🌐 Post-Deployment

After successful deployment, you'll receive URLs:

- **Production**: `https://medisense-ai.vercel.app` (your custom domain)
- **Preview**: `https://medisense-ai-xyz123.vercel.app`

### Testing Your Deployment

1. Open your Vercel URL in a browser
2. Try uploading a medical PDF or click "Try Demo"
3. Verify AI analysis works
4. Test the SOAP report generation
5. Check theme toggle and downloads

## 🔐 Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |

## 📁 Project Structure for Vercel

```
MediSense AI/
├── vercel.json                 # Vercel configuration
├── api/
│   └── index.py               # Serverless function entry point
├── app.py                     # FastAPI backend
├── requirements-vercel.txt    # Python dependencies
├── frontend/
│   ├── package.json           # Frontend dependencies
│   ├── build/                 # Production build (auto-generated)
│   └── src/
│       └── services/
│           └── api.js         # Updated API config
```

## ⚙️ Configuration Files

### `vercel.json`
Routes API requests to `/api/*` and serves frontend from `/`

### `api/index.py`
Vercel serverless function handler for FastAPI backend

### `requirements-vercel.txt`
Optimized Python dependencies for Vercel

### `frontend/src/services/api.js`
Automatically detects production vs development environment

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

Vercel will:
1. Detect the push
2. Build your application
3. Deploy to production
4. Update your live URL

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json` and `requirements-vercel.txt`
- Ensure Python version compatibility (Vercel uses Python 3.9+)

### API Not Working
- Verify `OPENAI_API_KEY` is set in Environment Variables
- Check `/api/health` endpoint: `https://your-app.vercel.app/api/health`
- Review Function Logs in Vercel dashboard

### Frontend Shows Errors
- Clear browser cache
- Check browser console for errors
- Verify API base URL in production build

### Large File Size Warning
- Vercel has 50MB limit per serverless function
- If exceeded, consider splitting large dependencies
- Use Vercel Edge Functions for lighter workloads

## 📊 Vercel Limits (Free Tier)

- **Bandwidth**: 100GB/month
- **Serverless Function Execution**: 100GB-hours
- **Build Minutes**: 6,000 minutes/month
- **Function Size**: 50MB max
- **Function Duration**: 10 seconds max

For production with high traffic, consider upgrading to Pro plan.

## 🎯 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `medisense.yourdomain.com`)
3. Update DNS records as instructed by Vercel
4. SSL certificate is auto-generated

## 📝 Additional Notes

- **Cold Starts**: First request might be slow (serverless warm-up)
- **Caching**: Vercel automatically caches static assets
- **Logs**: View real-time logs in Vercel dashboard
- **Rollbacks**: Easy rollback to previous deployments

## ✅ Verification Checklist

- [ ] Project deployed successfully
- [ ] Environment variables configured
- [ ] Frontend loads correctly
- [ ] API endpoints respond (`/api/health`, `/api/demo`)
- [ ] File upload works
- [ ] AI analysis functions
- [ ] SOAP reports generate
- [ ] Theme toggle works
- [ ] Downloads function properly

## 🆘 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Issues**: [GitHub Issues](https://github.com/ritik-gupta001/Medisure.AI/issues)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

**🎉 Congratulations!** Your MediSense AI application is now live on Vercel!

Share your deployment URL: `https://medisense-ai.vercel.app`
