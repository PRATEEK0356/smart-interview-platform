import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    port: int = 8000
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
