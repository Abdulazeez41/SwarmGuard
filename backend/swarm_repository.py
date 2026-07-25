"""
SwarmGuard Persistent Repository

All swarm state is stored in PostgreSQL.

MCP and REST API processes can therefore operate on the
same swarm tasks.
"""

from typing import Dict, Optional, List, Any

from sqlalchemy import desc

from database import SessionLocal
from models import SwarmTask, SwarmEvent, SwarmMemory


class SwarmRepository:

    # =========================================================
    # TASKS
    # =========================================================

    def create_task(self, task_id: str, task_data: Dict) -> Dict:
        with SessionLocal() as db:

            task = SwarmTask(
                task_id=task_id,
                brief=task_data["brief"],
                budget_original=task_data["budget_original"],
                budget_remaining=task_data["budget_remaining"],
                status=task_data["status"],
                current_milestone=task_data["current_milestone"],
                team=task_data["team"],
                logs=task_data["logs"],
            )

            db.add(task)
            db.commit()
            db.refresh(task)

            return self._task_to_dict(task)

    def get_task(self, task_id: str) -> Optional[Dict]:
        with SessionLocal() as db:

            task = (
                db.query(SwarmTask)
                .filter(SwarmTask.task_id == task_id)
                .first()
            )

            if not task:
                return None

            return self._task_to_dict(task)

    def update_task(self, task_id: str, task_data: Dict) -> Optional[Dict]:
        with SessionLocal() as db:

            task = (
                db.query(SwarmTask)
                .filter(SwarmTask.task_id == task_id)
                .first()
            )

            if not task:
                return None

            task.brief = task_data["brief"]
            task.budget_original = task_data["budget_original"]
            task.budget_remaining = task_data["budget_remaining"]
            task.status = task_data["status"]
            task.current_milestone = task_data["current_milestone"]
            task.team = task_data["team"]
            task.logs = task_data["logs"]

            db.commit()
            db.refresh(task)

            return self._task_to_dict(task)

    def get_latest_task(self) -> Optional[Dict]:
        with SessionLocal() as db:

            task = (
                db.query(SwarmTask)
                .order_by(desc(SwarmTask.created_at))
                .first()
            )

            if not task:
                return None

            return self._task_to_dict(task)

    def get_all_tasks(self) -> List[Dict]:
        with SessionLocal() as db:

            tasks = (
                db.query(SwarmTask)
                .order_by(desc(SwarmTask.created_at))
                .all()
            )

            return [
                self._task_to_dict(task)
                for task in tasks
            ]

    def _task_to_dict(self, task: SwarmTask) -> Dict:

        return {
            "task_id": task.task_id,
            "brief": task.brief,
            "budget_original": task.budget_original,
            "budget_remaining": task.budget_remaining,
            "status": task.status,
            "current_milestone": task.current_milestone,
            "team": task.team or [],
            "logs": task.logs or [],
            "created_at": (
                task.created_at.isoformat()
                if task.created_at
                else None
            ),
            "updated_at": (
                task.updated_at.isoformat()
                if task.updated_at
                else None
            ),
        }

    # =========================================================
    # EVENTS
    # =========================================================

    def add_event(
        self,
        task_id: str,
        event_type: str,
        message: str,
        event_data: Optional[Dict[str, Any]] = None,
    ):

        with SessionLocal() as db:

            event = SwarmEvent(
                task_id=task_id,
                event_type=event_type,
                message=message,
                event_data=event_data,
            )

            db.add(event)
            db.commit()

    def get_events(self, task_id: str) -> List[Dict]:

        with SessionLocal() as db:

            events = (
                db.query(SwarmEvent)
                .filter(SwarmEvent.task_id == task_id)
                .order_by(SwarmEvent.created_at.asc())
                .all()
            )

            return [
                {
                    "id": event.id,
                    "task_id": event.task_id,
                    "event_type": event.event_type,
                    "message": event.message,
                    "event_data": event.event_data,
                    "created_at": (
                        event.created_at.isoformat()
                        if event.created_at
                        else None
                    ),
                }
                for event in events
            ]

    # =========================================================
    # GLOBAL MEMORY
    # =========================================================

    def get_or_create_memory(self) -> Dict:

        with SessionLocal() as db:

            memory = (
                db.query(SwarmMemory)
                .filter(SwarmMemory.id == 1)
                .first()
            )

            if not memory:

                memory = SwarmMemory(
                    id=1,
                    lessons_learned=[],
                    agent_penalties={},
                    agent_reputation_downgrades={},
                    completed_projects=0,
                    total_budget_managed=0.0,
                )

                db.add(memory)
                db.commit()
                db.refresh(memory)

            return self._memory_to_dict(memory)

    def update_memory(self, memory_data: Dict):

        with SessionLocal() as db:

            memory = (
                db.query(SwarmMemory)
                .filter(SwarmMemory.id == 1)
                .first()
            )

            if not memory:
                memory = SwarmMemory(id=1)
                db.add(memory)

            memory.lessons_learned = memory_data.get(
                "lessons_learned",
                [],
            )

            memory.agent_penalties = memory_data.get(
                "agent_penalties",
                {},
            )

            memory.agent_reputation_downgrades = memory_data.get(
                "agent_reputation_downgrades",
                {},
            )

            memory.completed_projects = memory_data.get(
                "completed_projects",
                0,
            )

            memory.total_budget_managed = memory_data.get(
                "total_budget_managed",
                0.0,
            )

            db.commit()

    def _memory_to_dict(self, memory: SwarmMemory) -> Dict:

        return {
            "lessons_learned": memory.lessons_learned or [],
            "agent_penalties": memory.agent_penalties or {},
            "agent_reputation_downgrades": (
                memory.agent_reputation_downgrades or {}
            ),
            "completed_projects": memory.completed_projects or 0,
            "total_budget_managed": (
                memory.total_budget_managed or 0.0
            ),
        }
