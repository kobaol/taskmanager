import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from . import models  
from .routers import users, projects, tasks

app = FastAPI(title="Task Manager API")

# CORS for frontend dev server (Vite) and for local usage.
# You can override/extend via env: FRONTEND_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
origins_env = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000",
)
origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Task Manager API is running"}

app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)