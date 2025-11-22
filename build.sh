#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p chroma_db
mkdir -p faiss_index
mkdir -p medical_knowledge_base

echo "Build completed successfully!"
