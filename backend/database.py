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


DATABASE_URL = os.getenv("DATABASE_URL")


def normalize_database_url(url: str) -> str:
    """
    Render may provide PostgreSQL URLs using postgres://.
    SQLAlchemy expects postgresql://.
    """
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)

    return url


if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not configured. "
        "Set DATABASE_URL before starting SwarmGuard."
    )


DATABASE_URL = normalize_database_url(DATABASE_URL)


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)


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
