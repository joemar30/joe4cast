import sys
import os

# Add the project root to sys.path so joe4cast_api can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from joe4cast_api.wsgi import application

# This is the entry point for Vercel
app = application
