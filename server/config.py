import os
from pathlib import Path

from dotenv import load_dotenv


# Load only this backend's local configuration file. It remains git-ignored.
load_dotenv(Path(__file__).with_name(".env"))


class Config:
    """Configuration shared by development, testing, and future API modules."""

    SECRET_KEY = os.getenv("SECRET_KEY", "development-only-change-me")
    DATABASE_URL = os.getenv("DATABASE_URL")
    SQLALCHEMY_DATABASE_URI = DATABASE_URL
    SQLALCHEMY_TRACK_MODIFICATIONS = False
