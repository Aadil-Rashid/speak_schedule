from fastapi import FastAPI
from .constants import FRONTEND_URL
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Speak it. Schedule it. Done.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


