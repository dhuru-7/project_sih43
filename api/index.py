import os
import sys

# Ensure backend and repository root directories are in Python sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
repo_root = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.join(repo_root, "backend")

for p in [backend_dir, repo_root]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app import create_app

# Create Flask WSGI application instance for Vercel Serverless Functions
app = create_app(os.getenv("FLASK_ENV", "production"))
