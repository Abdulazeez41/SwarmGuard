"""
SwarmGuard SQLAlchemy Models
"""

from datetime import datetime, timezone
from typing import Any, Dict

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    JSON,
    Boolean,
)

from database import Base


def utc_now():
    return datetime.now(timezone.utc)


class SwarmTask(Base):
    """
    Persistent swarm task.

    This replaces the in-memory:
        orchestrator.active_tasks[task_id]
    """

    __tablename__ = "swarm_tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)

    task_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    brief = Column(Text, nullable=False)

    budget_original = Column(Float, nullable=False)

    budget_remaining = Column(Float, nullable=False)

    status = Column(
        String(50),
        nullable=False,
        default="IN_PROGRESS",
    )

    current_milestone = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Complete team state.
    # We intentionally store this as JSON for MVP simplicity.
    team = Column(
        JSON,
        nullable=False,
        default=list,
    )

    # Chronological event logs.
    logs = Column(
        JSON,
        nullable=False,
        default=list,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )


class SwarmEvent(Base):
    """
    Immutable event/audit history.

    This gives us a proper audit trail separate from the
    current swarm state.
    """

    __tablename__ = "swarm_events"

    id = Column(Integer, primary_key=True, autoincrement=True)

    task_id = Column(
        String(100),
        nullable=False,
        index=True,
    )

    event_type = Column(
        String(100),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    event_data = Column(
        JSON,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )


class SwarmMemory(Base):
    """
    Persistent global SwarmGuard memory.

    This replaces the mutable global portions of swarm_memory.json.
    """

    __tablename__ = "swarm_memory"

    id = Column(
        Integer,
        primary_key=True,
        default=1,
    )

    lessons_learned = Column(
        JSON,
        nullable=False,
        default=list,
    )

    agent_penalties = Column(
        JSON,
        nullable=False,
        default=dict,
    )

    agent_reputation_downgrades = Column(
        JSON,
        nullable=False,
        default=dict,
    )

    completed_projects = Column(
        Integer,
        nullable=False,
        default=0,
    )

    total_budget_managed = Column(
        Float,
        nullable=False,
        default=0.0,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
        nullable=False,
    )
