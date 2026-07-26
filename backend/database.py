"""
SwarmGuard Database Configuration

Provides the SQLAlchemy engine and session factory used by both:
- MCP server
- FastAPI server

Both processes connect to the same PostgreSQL database.
"""

import os
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./swarmguard.db")


def normalize_database_url(url: str) -> str:
    """
    Render may provide PostgreSQL URLs using postgres://.
    SQLAlchemy expects postgresql://.
    """
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)

    return url


DATABASE_URL = normalize_database_url(DATABASE_URL)


engine_options = {
    "pool_pre_ping": True,
    "pool_recycle": 300,
}

# SQLite is a safe local-development fallback. Hosted deployments should set
# DATABASE_URL to their managed PostgreSQL connection string.
if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_options)


SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


Base = declarative_base()


@contextmanager
def get_db() -> Generator[Session, None, None]:
    """
    Provides a database session and guarantees cleanup.
    """

    db = SessionLocal()

    try:
        yield db
        db.commit()

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


def init_db():
    """
    Creates all database tables.

    For the MVP this is sufficient.
    Later, replace this with Alembic migrations.
    """

    from models import SwarmTask, SwarmEvent, SwarmMemory

    Base.metadata.create_all(bind=engine)

    print("✅ SwarmGuard database tables initialized.")
