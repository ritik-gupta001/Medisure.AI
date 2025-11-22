"""
Vercel Serverless Function Entry Point for MediSense AI
This file adapts the FastAPI app for Vercel's serverless environment
"""
import sys
import os

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app

# Vercel expects a variable named 'app' or 'handler'
handler = app
