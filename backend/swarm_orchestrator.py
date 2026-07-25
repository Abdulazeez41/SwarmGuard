import subprocess
import time
import os
from typing import Any, Dict, List, Optional

from team_builder import TeamBuilder
from marketplace_collector import MarketplaceDataCollector
from evaluator import AutonomousEvaluator
from swarm_repository import SwarmRepository


class SwarmOrchestrator:

    def __init__(self, repository: Optional[SwarmRepository] = None,):
        self.team_builder = TeamBuilder()
        self.marketplace = MarketplaceDataCollector()
        self.evaluator = AutonomousEvaluator()

        self.repository = (
            repository
            if repository is not None
            else SwarmRepository()
        )

    # =========================================================
    # PERSISTENT STATE HELPERS
    # =========================================================

    @property
    def swarm_memory(self) -> Dict:
        """
        Always read the latest global swarm memory from PostgreSQL.

        PostgreSQL is the source of truth.
        This prevents stale in-memory state between
        MCP and FastAPI processes.
        """
        return self.repository.get_or_create_memory()


    def _save_memory(self, memory: Optional[Dict] = None):
        """
        Persist swarm memory to PostgreSQL.

        If memory is not explicitly supplied, fetch the
        latest memory from the repository first.
        """
        try:
            if memory is None:
                memory = self.repository.get_or_create_memory()

            self.repository.update_memory(memory)

        except Exception as e:
            print(
                f"Warning: Could not save swarm memory: {e}"
            )


    def _get_task(self, task_id: str) -> Optional[Dict]:
        """
        Always retrieve the task from PostgreSQL.

        No in-memory active_tasks cache is required.
        """
        return self.repository.get_task(task_id)


    def _save_task(
        self,
        task_id: str,
        task: Dict,
    ) -> Optional[Dict]:
        """
        Persist the latest task state to PostgreSQL.
        """
        try:
            return self.repository.update_task(
                task_id,
                task,
            )

        except Exception as e:
            print(
                f"Warning: Could not save task "
                f"{task_id}: {e}"
            )
            return None


    def get_latest_task(self) -> Optional[Dict]:
        """
        Retrieve the latest task from PostgreSQL.
        """
        return self.repository.get_latest_task()


    def get_all_tasks(self) -> List[Dict]:
        """
        Retrieve all tasks from PostgreSQL.
        """
        return self.repository.get_all_tasks()

    
    def get_latest_task_id(self) -> Optional[str]:
        """Return the ID of the most recently created task."""
        task = self.repository.get_latest_task()
        if not task:
            return None
        return task.get("task_id")

    # =========================================================
    # CLI
    # =========================================================

    def _run_cli(self, command: List[str]) -> Dict:

        try:

            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True,
                timeout=15,
            )

            import json

            return json.loads(result.stdout)

        except Exception as e:

            return {
                "ok": False,
                "error": str(e),
            }

    # =========================================================
    # LIVE AGENT DATA
    # =========================================================

    def _get_live_agent_data_for_id(
        self,
        agent_id: str,
        role_key: str,
    ) -> Dict:

        try:

            marketplace_data = (
                self.marketplace
                .get_agent_marketplace_data(agent_id)
            )

            score_data = (
                self.marketplace
                .calculate_transparent_scores(
                    marketplace_data
                )
            )

            base_rates = {
                "smart_contract_expert": 200,
                "frontend_developer": 150,
                "backend_developer": 160,
                "security_auditor": 220,
                "qa_engineer": 120,
                "devops_engineer": 170,
                "data_analyst": 140,
                "ml_engineer": 240,
                "ux_designer": 130,
                "content_writer": 90,
                "marketing_strategist": 140,
                "customer_support": 80,
                "project_manager": 160,
                "financial_analyst": 170,
                "legal_advisor": 200,
                "research_analyst": 130,
                "generalist": 100,
            }

            base_rate = base_rates.get(
                role_key,
                100,
            )

            trust_score = score_data["total"]

            score_multiplier = (
                0.8
                + (trust_score / 100) * 0.4
            )

            return {
                "agent_id": agent_id,
                "name": f"Agent {agent_id}",
                "specialization": (
                    role_key
                    .replace("_", " ")
                    .title()
                ),
                "hourly_rate_usd": int(
                    base_rate * score_multiplier
                ),
                "availability": "immediate",
                "trust_score": trust_score,
                "score_breakdown": score_data["scores"],
                "data_source": (
                    "LIVE_XLAYER_BLOCKCHAIN"
                ),
            }

        except Exception as e:

            return {
                "error": (
                    f"Failed to fetch live data "
                    f"for agent {agent_id}: {str(e)}"
                )
            }

    # =========================================================
    # INITIATE SWARM
    # =========================================================

    def initiate_swarm(
        self,
        project_brief: str,
        budget_usd: float,
    ) -> Dict:

        team_plan = (
            self.team_builder
            .build_team(
                project_brief,
                budget_usd,
            )
        )

        if "error" in team_plan:

            return {
                "status": "FAILED",
                "error": team_plan["error"],
            }

        # =====================================================
        # AUTO-SCALE
        # =====================================================

        if (
            team_plan.get("budget_status")
            == "EXCEEDS_BUDGET"
        ):

            estimated_cost = (
                team_plan["cost_estimation"]
                ["total_cost_usd"]
            )

            scale_factor = (
                budget_usd / estimated_cost
            )

            scaled_team = []
            scaled_total_cost = 0

            for agent in team_plan["team"]:

                original_hours = agent.get(
                    "estimated_hours",
                    40,
                )

                scaled_hours = max(
                    10,
                    int(
                        original_hours
                        * scale_factor
                    ),
                )

                agent_cost = (
                    agent["hourly_rate_usd"]
                    * scaled_hours
                )

                scaled_total_cost += agent_cost

                scaled_agent = agent.copy()

                scaled_agent[
                    "estimated_hours"
                ] = scaled_hours

                scaled_agent[
                    "estimated_cost"
                ] = agent_cost

                scaled_team.append(
                    scaled_agent
                )

            team_plan["team"] = scaled_team

            team_plan[
                "cost_estimation"
            ][
                "total_cost_usd"
            ] = scaled_total_cost

            team_plan[
                "budget_status"
            ] = "WITHIN_BUDGET"

            team_plan[
                "recommendations"
            ] = [
                (
                    f"Auto-scaled team hours by "
                    f"{int(scale_factor * 100)}% "
                    f"to fit the "
                    f"${budget_usd:,.0f} budget."
                )
            ]

        if (
            team_plan["budget_status"]
            != "WITHIN_BUDGET"
        ):

            return {
                "status": "BUDGET_EXCEEDED",
                "estimated_cost": (
                    team_plan[
                        "cost_estimation"
                    ][
                        "total_cost_usd"
                    ]
                ),
                "requested_budget": budget_usd,
                "recommendations": (
                    team_plan.get(
                        "recommendations",
                        [],
                    )
                ),
                "message": (
                    "Deployment halted. "
                    "SwarmGuard prevents "
                    "budget overruns."
                ),
            }

        # =====================================================
        # CREATE PERSISTENT TASK
        # =====================================================

        task_id = (
            f"SWARM-{int(time.time() * 1000)}"
        )

        logs = [
            (
                "Swarm initialized. "
                f"Budget locked: "
                f"${budget_usd} USDT "
                "in sub-escrow."
            )
        ]

        for agent in team_plan["team"]:

            logs.append(
                (
                    f"HIRED: Agent "
                    f"{agent['agent_id']} "
                    f"({agent['specialization']}) "
                    f"| Truora Score: "
                    f"{agent['trust_score']}/100 "
                    f"| Performance Bond: "
                    f"5 OKB locked"
                )
            )

        task = {
            "brief": project_brief,
            "budget_remaining": budget_usd,
            "budget_original": budget_usd,
            "team": team_plan["team"],
            "status": "IN_PROGRESS",
            "current_milestone": 0,
            "logs": logs,
        }

        # Persist in PostgreSQL.
        self.repository.create_task(
            task_id,
            task,
        )

        # =====================================================
        # GLOBAL MEMORY
        # =====================================================
        memory = self.repository.get_or_create_memory()

        memory["completed_projects"] += 1
        memory["total_budget_managed"] += budget_usd

        self._save_memory(memory)

        self.repository.add_event(
            task_id=task_id,
            event_type="SWARM_INITIALIZED",
            message=(
                "Autonomous workforce deployed."
            ),
            event_data={
                "budget": budget_usd,
                "team_size": len(
                    team_plan["team"]
                ),
            },
        )

        return {
            "status": "SUCCESS",
            "task_id": task_id,
            "team_size": len(
                team_plan["team"]
            ),
            "estimated_cost": (
                team_plan[
                    "cost_estimation"
                ][
                    "total_cost_usd"
                ]
            ),
            "budget_remaining": budget_usd,
            "team_details": [
                (
                    f"Agent {a['agent_id']} "
                    f"({a['specialization']}) "
                    f"| Truora: "
                    f"{a['trust_score']}/100 "
                    f"| Rate: "
                    f"${a['hourly_rate_usd']}/hr"
                )
                for a in team_plan["team"]
            ],
            "score_breakdowns": [
                {
                    a["agent_id"]:
                    a.get(
                        "score_breakdown",
                        {},
                    )
                }
                for a in team_plan["team"]
            ],
            "message": (
                "Autonomous workforce deployed. "
                "SwarmGuard auto-scaled the team "
                f"to fit your "
                f"${budget_usd:,.0f} budget."
            ),
            "next_step": (
                "Call 'evaluate_and_heal' "
                "with task_id and "
                "deliverable_summary."
            ),
        }
    
    # =========================================================
    # EVALUATE AND HEAL
    # =========================================================

    def evaluate_and_heal(
        self,
        task_id: str,
        deliverable_summary: str,
    ) -> Dict:
        """
        Evaluate the current swarm milestone and autonomously
        heal failures by penalizing the failed agent and
        attempting to hire a replacement.

        All task state and global swarm memory are persisted
        through SwarmRepository.

        PostgreSQL is the source of truth.
        """

        # =========================================================
        # LOAD PERSISTENT TASK
        # =========================================================

        task = self._get_task(task_id)

        if not task:
            return {
                "status": "ERROR",
                "message": "Task ID not found.",
            }

        # =========================================================
        # LOAD PERSISTENT GLOBAL MEMORY
        # =========================================================

        memory = self.repository.get_or_create_memory()

        # =========================================================
        # CHECK MILESTONE STATE
        # =========================================================

        if (
            task["current_milestone"]
            >= len(task["team"])
        ):
            return {
                "status": "COMPLETED",
                "task_id": task_id,
                "message": (
                    "All milestones already verified."
                ),
            }

        # =========================================================
        # GET CURRENT AGENT
        # =========================================================

        current_agent = task["team"][
            task["current_milestone"]
        ]

        # =========================================================
        # RUN AUTONOMOUS EVALUATION
        # =========================================================

        evaluation = (
            self.evaluator.evaluate_deliverable(
                deliverable_summary,
                current_agent["specialization"],
            )
        )

        is_success = evaluation.get(
            "is_success",
            False,
        )

        # =========================================================
        # BUILD EVENT LOG
        # =========================================================

        log_entry = (
            f"\n--- MILESTONE EVALUATION: "
            f"{current_agent['specialization']} ---"
        )

        log_entry += (
            f"\n🔍 AUTO-EVALUATOR "
            f"({evaluation.get('method', 'UNKNOWN')}): "
            "Analyzing deliverable summary..."
        )

        log_entry += (
            f"\n📊 EVALUATION CONFIDENCE: "
            f"{evaluation.get('confidence', 0):.0f}%"
        )

        # =========================================================
        # SUCCESS PATH
        # =========================================================

        if is_success:

            estimated_cost = current_agent.get(
                "estimated_cost"
            )

            if estimated_cost is not None:

                payment = float(
                    estimated_cost
                )

            else:

                hourly_rate = float(
                    current_agent.get(
                        "hourly_rate_usd",
                        0,
                    )
                )

                estimated_hours = float(
                    current_agent.get(
                        "estimated_hours",
                        0,
                    )
                )

                payment = (
                    hourly_rate
                    * estimated_hours
                )

            # =====================================================
            # BUDGET SAFETY CHECK
            # =====================================================

            if payment > task["budget_remaining"]:

                task["status"] = "BUDGET_EXCEEDED"

                log_entry += (
                    f"\n⚠️ PAYMENT BLOCKED: "
                    f"Required payment of "
                    f"${payment:,.2f} exceeds the "
                    f"remaining task budget of "
                    f"${task['budget_remaining']:,.2f}."
                )

                log_entry += (
                    "\n🛑 MILESTONE PAUSED: "
                    "Payment was not released and "
                    "the milestone was not advanced."
                )

            else:

                # =================================================
                # RELEASE PAYMENT
                # =================================================

                task["budget_remaining"] -= payment

                log_entry += (
                    f"\n💰 PAYMENT: Released "
                    f"${payment:,.2f} USDT to Agent "
                    f"{current_agent['agent_id']}."
                )

                log_entry += (
                    f"\n💼 BUDGET: "
                    f"${task['budget_remaining'] + payment:,.2f} → "
                    f"${task['budget_remaining']:,.2f} USDT."
                )

                task["current_milestone"] += 1

                # =================================================
                # CHECK FOR MISSION COMPLETION
                # =================================================

                if (
                    task["current_milestone"]
                    >= len(task["team"])
                ):

                    task["status"] = "COMPLETED"

                    log_entry += (
                        "\n🎉 SWARM MISSION "
                        "ACCOMPLISHED. "
                        "All milestones verified."
                    )


        # =========================================================
        # FAILURE / SELF-HEALING PATH
        # =========================================================

        else:

            reputation_penalty = 5

            original_score = current_agent[
                "trust_score"
            ]

            # =====================================================
            # PENALIZE CURRENT AGENT
            # =====================================================

            current_agent[
                "trust_score"
            ] = max(
                0,
                current_agent["trust_score"]
                - reputation_penalty,
            )

            agent_identifier = current_agent.get(
                "agent_id",
                "UNKNOWN",
            )

            # =====================================================
            # UPDATE AGENT PENALTY COUNT
            # =====================================================

            memory["agent_penalties"][
                agent_identifier
            ] = (
                memory["agent_penalties"].get(
                    agent_identifier,
                    0,
                )
                + 1
            )

            # =====================================================
            # UPDATE REPUTATION DOWNGRADE
            # =====================================================

            memory[
                "agent_reputation_downgrades"
            ][
                agent_identifier
            ] = (
                memory[
                    "agent_reputation_downgrades"
                ].get(
                    agent_identifier,
                    0,
                )
                + reputation_penalty
            )

            # =====================================================
            # FORFEIT PERFORMANCE BOND
            # =====================================================

            bond_forfeited = 5

            bond_refund_value = (
                bond_forfeited
                * 100
            )

            task[
                "budget_remaining"
            ] += bond_refund_value

            log_entry += (
                "\n❌ FAIL: Objective "
                "criteria not met."
            )

            log_entry += (
                "\n⚖️ PENALTY: 5 OKB "
                "performance bond forfeited "
                "to client escrow."
            )

            log_entry += (
                f"\n💰 REFUND: "
                f"${bond_refund_value:,.2f} USDT "
                "returned to budget."
            )

            log_entry += (
                f"\n📉 REPUTATION: Agent "
                f"{agent_identifier}'s Truora score: "
                f"{original_score} → "
                f"{current_agent['trust_score']}/100."
            )

            # =====================================================
            # RECORD LESSON IN PERSISTENT MEMORY
            # =====================================================

            lesson = (
                f"LESSON: Agent "
                f"{agent_identifier} failed "
                f"{current_agent['specialization']} "
                f"- {deliverable_summary[:50]}..."
            )

            memory[
                "lessons_learned"
            ].append(
                lesson
            )

            log_entry += (
                f"\n🧠 SWARM MEMORY: Recorded. "
                f"This agent now has "
                f"{memory['agent_penalties'][agent_identifier]} "
                "penalty record(s)."
            )

            # =====================================================
            # FIND REPLACEMENT
            # =====================================================

            log_entry += (
                "\n🔄 OPTIMIZATION: "
                "Querying Truora DI "
                "for replacement..."
            )

            task["team"].pop(
                task["current_milestone"]
            )

            role_key = (
                current_agent[
                    "specialization"
                ]
                .lower()
                .replace(
                    " ",
                    "_",
                )
            )

            # =====================================================
            # SEARCH FOR REPLACEMENT
            # =====================================================

            replacement = (
                self._find_replacement_agent(
                    role_key,
                    task[
                        "budget_remaining"
                    ],
                )
            )

            # =====================================================
            # REPLACEMENT FOUND
            # =====================================================

            if (
                replacement
                and "error"
                not in replacement
            ):

                task[
                    "team"
                ].insert(
                    task[
                        "current_milestone"
                    ],
                    replacement,
                )

                log_entry += (
                    f"\n✅ REPLACEMENT HIRED: "
                    f"Agent "
                    f"{replacement['agent_id']} "
                    f"(Truora: "
                    f"{replacement['trust_score']}/100, "
                    f"Confidence: "
                    f"{replacement.get('confidence', 80)}%)."
                )

                log_entry += (
                    f"\n🔄 RE-ASSIGNING MILESTONE "
                    f"to Agent "
                    f"{replacement['agent_id']}..."
                )

            # =====================================================
            # NO REPLACEMENT FOUND
            # =====================================================

            else:

                task["status"] = "STALLED"

                log_entry += (
                    "\n⚠️ WARNING: "
                    "No suitable replacement "
                    "found. Task stalled."
                )
            # =========================================================
            # APPEND LOG TO TASK
            # =========================================================

            task[
                "logs"
            ].append(
                log_entry
            )

            # =========================================================
            # PERSIST TASK STATE
            # =========================================================

            self._save_task(
                task_id,
                task,
            )

            # =========================================================
            # PERSIST GLOBAL MEMORY
            # =========================================================

            self._save_memory(
                memory
            )

            # =========================================================
            # RECORD AUDIT EVENT
            # =========================================================

            self.repository.add_event(
                task_id=task_id,
                event_type=(
                    "MILESTONE_SUCCESS"
                    if is_success
                    else "MILESTONE_FAILURE"
                ),
                message=log_entry,
                event_data=evaluation,
            )

            # =========================================================
            # RETURN RESULT
            # =========================================================

            return {
                "status": task["status"],
                "task_id": task_id,
                "action_taken": (
                    "SUCCESS_PAYMENT"
                    if is_success
                    else "BOND_FORFEITURE_AND_OPTIMIZATION"
                ),
                "current_team": [
                    (
                        f"Agent "
                        f"{a['agent_id']} "
                        f"({a['specialization']}) "
                        f"- Truora: "
                        f"{a['trust_score']}"
                    )
                    for a in task["team"]
                ],
                "budget_remaining": (
                    task["budget_remaining"]
                ),
                "event_log": log_entry,
                "next_step": (
                    "Call 'get_swarm_status' "
                    "to view the updated audit trail."
                ),
            }

    # =========================================================
    # REPLACEMENT
    # =========================================================

    def _find_replacement_agent(
        self,
        role_key: str,
        remaining_budget: float,
    ) -> Dict:

        search_query = (
            role_key.split("_")[0]
        )

        res = self._run_cli(
            [
                "onchainos",
                "agent",
                "asp-match",
                "--task-desc",
                search_query,
                "--format",
                "json",
            ]
        )

        if (
            res.get("ok")
            and res.get("data")
            and len(res["data"]) > 0
        ):

            top_agent = res[
                "data"
            ][0]

            agent_id = str(
                top_agent.get(
                    "agentId",
                    "UNKNOWN",
                )
            )

            return (
                self._get_live_agent_data_for_id(
                    agent_id,
                    role_key,
                )
            )

        backup_agents = {
            "frontend_developer": "6011",
            "backend_developer": "6021",
            "smart_contract_expert": "6031",
            "security_auditor": "6041",
            "generalist": "6099",
        }

        backup_id = (
            backup_agents.get(
                role_key,
                "6099",
            )
        )

        print(
            "[SwarmOrchestrator] "
            "Live search unavailable. "
            f"Fetching live data for "
            f"backup agent {backup_id}."
        )

        replacement_data = (
            self._get_live_agent_data_for_id(
                backup_id,
                role_key,
            )
        )

        if (
            "error"
            not in replacement_data
        ):

            replacement_data[
                "confidence"
            ] = 82

        return replacement_data

    # =========================================================
    # GET STATUS
    # =========================================================

    def get_swarm_status(
        self,
        task_id: str,
    ) -> Dict:

        # Always query PostgreSQL.
        task = self._get_task(task_id)

        if not task:

            return {
                "status": "ERROR",
                "message": (
                    "Task ID not found."
                ),
            }

        # Refresh memory too.
        memory = self.repository.get_or_create_memory()

        events = (
            self.repository
            .get_events(task_id)
        )

        return {
            "task_id": task_id,
            "status": task["status"],
            "budget_remaining": (
                task[
                    "budget_remaining"
                ]
            ),
            "budget_original": (
                task[
                    "budget_original"
                ]
            ),
            "active_team": [
                (
                    f"Agent "
                    f"{a['agent_id']} "
                    f"({a['specialization']}) "
                    f"- Truora: "
                    f"{a['trust_score']}"
                )
                for a in task["team"]
            ],
            "swarm_memory_lessons": (
                memory[
                    "lessons_learned"
                ][-5:]
            ),
            "agent_penalties": (
                memory[
                    "agent_penalties"
                ]
            ),
            "global_stats": {
                "projects_managed": (
                    memory[
                        "completed_projects"
                    ]
                ),
                "total_budget_managed": (
                    memory[
                        "total_budget_managed"
                    ]
                ),
            },
            "full_event_log": "\n".join(
                task["logs"]
            ),
            "events": events,
            "current_milestone": (
                task[
                    "current_milestone"
                ]
            ),
            "created_at": (
                task.get(
                    "created_at"
                )
            ),
            "updated_at": (
                task.get(
                    "updated_at"
                )
            ),
        }
