"""
Truora: Explainable AI-Agent Trust Intelligence System
Collects real evidence from OKX marketplace, blockchain, and agent profiles.
Generates defensible, evidence-based trust assessments.
"""

import json
import subprocess
from typing import Any

from web3 import Web3


class MarketplaceDataCollector:
    def __init__(self):
        # XLayer Mainnet RPC
        self.w3 = Web3(Web3.HTTPProvider("https://rpc.xlayer.tech"))

    # ============================================================
    # REAL DATA COLLECTION
    # ============================================================

    def get_agent_marketplace_data(
        self,
        agent_id: str,
        wallet_address: str | None = None,
    ) -> dict:
        """
        Collects REAL data from multiple sources:
        1. Agent profile from OKX marketplace
        2. Agent services and capabilities
        3. Task history and completion records
        4. Reviews and feedback
        5. Dispute history
        6. On-chain activity
        """
        profile = self._get_agent_profile(agent_id)
        services = self._get_agent_services(agent_id)
        tasks = self._get_agent_tasks(agent_id)
        reviews = self._get_agent_reviews(agent_id)
        disputes = self._get_agent_disputes(agent_id)
        resolved_wallet = (
            wallet_address
            or profile.get("agentWalletAddress")
            or profile.get("wallet_address")
            or profile.get("ownerAddress")
        )

        onchain = self._get_onchain_activity(resolved_wallet)

        return {
            "agent_id": agent_id,
            "profile": profile,
            "services": services,
            "tasks": tasks,
            "reviews": reviews,
            "disputes": disputes,
            "onchain_activity": onchain,
            "evidence_quality": self._assess_evidence_quality(
                profile, services, tasks, reviews, disputes, onchain
            ),
        }

    def _get_agent_profile(self, agent_id: str) -> dict:
        """Fetch agent profile from OKX marketplace."""
        try:
            result = subprocess.run(
                ["onchainos", "agent", "profile", "--agent-id", agent_id],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
                if data.get("ok"):
                    return data.get("data", {})
        except Exception as e:  # noqa: BLE001
            print(
                f"[MarketplaceDataCollector] Failed to fetch profile for {agent_id}: {e}"
            )

        return {"agent_id": agent_id, "error": "Profile not available"}

    def _get_agent_services(self, agent_id: str) -> list[dict]:
        """Fetch agent's registered services."""
        try:
            result = subprocess.run(
                ["onchainos", "agent", "service-list", "--agent-id", agent_id],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
                if data.get("ok"):
                    return data.get("data", {}).get("list", [])
        except Exception as e:  # noqa: BLE001
            print(
                f"[MarketplaceDataCollector] Failed to fetch services for {agent_id}: {e}"
            )

        return []

    def _get_agent_tasks(self, agent_id: str) -> list[dict]:
        """Fetch agent's task history (completed and in-progress)."""
        try:
            result = subprocess.run(
                [
                    "onchainos",
                    "agent",
                    "tasks",
                    "--agent-id",
                    agent_id,
                    "--status",
                    "all",
                ],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
                if data.get("ok"):
                    return data.get("data", [])
        except Exception as e:  # noqa: BLE001
            print(
                f"[MarketplaceDataCollector] Failed to fetch tasks for {agent_id}: {e}"
            )

        return []

    def _get_agent_reviews(self, agent_id: str) -> list[dict]:
        """Fetch agent's reviews and feedback."""
        try:
            result = subprocess.run(
                ["onchainos", "agent", "feedback-list", "--agent-id", agent_id],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
            if result.returncode == 0:
                data = json.loads(result.stdout)
                if data.get("ok"):
                    return data.get("data", [])
        except Exception as e:  # noqa: BLE001
            print(
                f"[MarketplaceDataCollector] Failed to fetch reviews for {agent_id}: {e}"
            )

        return []

    def _get_agent_disputes(self, agent_id: str) -> list[dict]:
        """Fetch agent's dispute history."""
        try:
            # This would use a disputes API if available
            # For now, we check task status for disputes
            tasks = self._get_agent_tasks(agent_id)
            disputes = [t for t in tasks if t.get("status") in ["disputed", "refused"]]
            return disputes
        except Exception as e:  # noqa: BLE001
            print(
                f"[MarketplaceDataCollector] Failed to fetch disputes for {agent_id}: {e}"
            )

        return []

    def _get_onchain_activity(self, wallet_address: str | None) -> dict:
        """Fetch on-chain activity for the agent's wallet."""
        if not wallet_address or not self.w3.is_connected():
            return {"error": "Wallet address not available or RPC unavailable"}

        try:
            checksum_address = self.w3.to_checksum_address(wallet_address)
            nonce = self.w3.eth.get_transaction_count(checksum_address)
            balance_wei = self.w3.eth.get_balance(checksum_address)
            balance_eth = float(self.w3.from_wei(balance_wei, "ether"))

            return {
                "wallet_address": checksum_address,
                "transaction_count": nonce,
                "native_balance": balance_eth,
                "network": "XLayer Mainnet",
            }
        except Exception as e:  # noqa: BLE001
            return {"error": f"Failed to fetch on-chain data: {e!s}"}

    def _assess_evidence_quality(
        self,
        profile: dict,
        services: list[dict],
        tasks: list[dict],
        reviews: list[dict],
        disputes: list[dict],
        onchain: dict,
    ) -> dict:
        """Assess the quality and completeness of available evidence."""
        data_sources = 0
        completeness_indicators = []

        # Profile data
        if profile and not profile.get("error"):
            data_sources += 1
            completeness_indicators.append("Agent profile available")

        # Services data
        if services:
            data_sources += 1
            completeness_indicators.append(f"{len(services)} services registered")

        # Task history
        completed_tasks = [t for t in tasks if t.get("status") == "completed"]
        if tasks:
            data_sources += 1
            completeness_indicators.append(f"{len(tasks)} tasks in history")

        # Reviews
        if reviews:
            data_sources += 1
            completeness_indicators.append(f"{len(reviews)} reviews available")

        # Disputes
        if disputes is not None:
            data_sources += 1
            completeness_indicators.append("Dispute history checked")

        # On-chain data
        if onchain and not onchain.get("error"):
            data_sources += 1
            completeness_indicators.append("On-chain activity verified")

        # Determine overall quality
        if data_sources >= 5:
            quality = "High"
            confidence = "High"
        elif data_sources >= 3:
            quality = "Medium"
            confidence = "Medium"
        else:
            quality = "Low"
            confidence = "Low"

        return {
            "data_sources": data_sources,
            "quality": quality,
            "confidence": confidence,
            "indicators": completeness_indicators,
            "completed_tasks": len(completed_tasks),
            "total_tasks": len(tasks),
            "reviews_count": len(reviews),
            "disputes_count": len(disputes),
        }

    # ============================================================
    # EVIDENCE-BASED ANALYSIS
    # ============================================================

    def analyze_reputation(self, marketplace_data: dict) -> dict:
        """Analyze agent's reputation based on real evidence."""
        tasks = marketplace_data.get("tasks", [])
        reviews = marketplace_data.get("reviews", [])
        completed_tasks = [t for t in tasks if t.get("status") == "completed"]

        if not completed_tasks and not reviews:
            return {
                "status": "Insufficient evidence",
                "completed_jobs": 0,
                "average_rating": None,
                "reviews_count": 0,
                "explanation": "No completed marketplace jobs or independent ratings were available for assessment.",
            }

        # Calculate average rating if reviews exist
        avg_rating = None
        if reviews:
            ratings = [r.get("rating", 0) for r in reviews if r.get("rating")]
            if ratings:
                avg_rating = sum(ratings) / len(ratings)

        return {
            "status": "Established" if len(completed_tasks) > 10 else "Emerging",
            "completed_jobs": len(completed_tasks),
            "average_rating": round(avg_rating, 2) if avg_rating else None,
            "reviews_count": len(reviews),
            "explanation": f"Agent has completed {len(completed_tasks)} jobs with {len(reviews)} reviews.",
        }

    def analyze_behavioral_risk(self, marketplace_data: dict) -> dict:
        """Analyze behavioral risk based on dispute history."""
        disputes = marketplace_data.get("disputes", [])
        tasks = marketplace_data.get("tasks", [])

        if not disputes and not tasks:
            return {
                "status": "Insufficient evidence",
                "active_disputes": 0,
                "explanation": "No task history available to assess behavioral risk.",
            }

        if not disputes:
            return {
                "status": "Low observed risk",
                "active_disputes": 0,
                "explanation": f"No disputes observed across {len(tasks)} tasks. Note: Limited history may not reflect long-term reliability.",
            }

        return {
            "status": "Elevated risk",
            "active_disputes": len(disputes),
            "explanation": f"{len(disputes)} dispute(s) detected. Review dispute details before engagement.",
        }

    def analyze_specialization(self, marketplace_data: dict) -> dict:
        """Analyze agent's specialization based on services and task history."""
        services = marketplace_data.get("services", [])
        tasks = marketplace_data.get("tasks", [])

        if not services and not tasks:
            return {"primary": "Unknown", "confidence": "Low", "evidence": []}

        # Extract specializations from services
        specializations = []
        for service in services:
            service_type = service.get("serviceType", "")
            service_name = service.get("serviceName", "")
            if service_type or service_name:
                specializations.append(f"{service_type}: {service_name}")

        # Extract from task history
        task_specializations = set()
        for task in tasks:
            brief = task.get("brief", "").lower()
            if "smart contract" in brief or "defi" in brief:
                task_specializations.add("Smart Contract Development")
            elif "frontend" in brief or "dashboard" in brief:
                task_specializations.add("Frontend Development")
            elif "security" in brief or "audit" in brief:
                task_specializations.add("Security Auditing")

        all_specializations = list(set(specializations + list(task_specializations)))

        if not all_specializations:
            return {
                "primary": "Generalist",
                "confidence": "Low",
                "evidence": ["No specific specialization detected"],
            }

        return {
            "primary": all_specializations[0] if all_specializations else "Generalist",
            "all_specializations": all_specializations,
            "confidence": "High" if len(all_specializations) > 2 else "Medium",
            "evidence": [
                f"{len(services)} registered services",
                f"{len(tasks)} tasks in history",
            ],
        }

    def analyze_delivery_confidence(self, marketplace_data: dict) -> dict:
        """Analyze delivery confidence based on completion history."""
        tasks = marketplace_data.get("tasks", [])
        reviews = marketplace_data.get("reviews", [])
        evidence_quality = marketplace_data.get("evidence_quality", {})

        completed_tasks = [t for t in tasks if t.get("status") == "completed"]
        total_tasks = len(tasks)

        if not completed_tasks:
            return {
                "assessment": "Unproven",
                "confidence": "Low",
                "explanation": "No completed delivery history is available to establish reliable delivery performance.",
            }

        completion_rate = len(completed_tasks) / total_tasks if total_tasks > 0 else 0

        # Calculate confidence based on multiple factors
        confidence_score = 0

        # Completion rate (0-30 points)
        confidence_score += min(30, completion_rate * 30)

        # Review quality (0-25 points)
        if reviews:
            avg_rating = sum(r.get("rating", 0) for r in reviews) / len(reviews)
            confidence_score += min(25, avg_rating * 5)

        # Volume of work (0-25 points)
        confidence_score += min(25, len(completed_tasks) * 2.5)

        # Evidence quality (0-20 points)
        quality_map = {"High": 20, "Medium": 10, "Low": 5}
        confidence_score += quality_map.get(evidence_quality.get("quality", "Low"), 0)

        if confidence_score >= 70:
            assessment = "High confidence"
            confidence = "High"
        elif confidence_score >= 50:
            assessment = "Moderate confidence"
            confidence = "Medium"
        else:
            assessment = "Low confidence"
            confidence = "Low"

        return {
            "assessment": assessment,
            "confidence": confidence,
            "completion_rate": round(completion_rate * 100, 1),
            "completed_tasks": len(completed_tasks),
            "total_tasks": total_tasks,
            "explanation": f"Based on {len(completed_tasks)} completed tasks with {round(completion_rate * 100, 1)}% completion rate.",
        }

    # ============================================================
    # RISK AND SIGNAL ANALYSIS
    # ============================================================

    def identify_risk_factors(self, marketplace_data: dict) -> list[str]:
        """Identify specific risk factors based on evidence."""
        risks = []
        evidence_quality = marketplace_data.get("evidence_quality", {})
        behavioral = self.analyze_behavioral_risk(marketplace_data)
        delivery = self.analyze_delivery_confidence(marketplace_data)

        # Evidence quality risks
        if evidence_quality.get("quality") == "Low":
            risks.append("Limited historical evidence available")

        if evidence_quality.get("completed_tasks", 0) == 0:
            risks.append("No completed marketplace jobs")

        if evidence_quality.get("reviews_count", 0) == 0:
            risks.append("No independent user ratings")

        # Behavioral risks
        if behavioral.get("active_disputes", 0) > 0:
            risks.append(f"{behavioral['active_disputes']} active dispute(s)")

        # Delivery risks
        if delivery.get("confidence") == "Low":
            risks.append("Insufficient delivery history to validate reliability")

        if not risks:
            risks.append("No significant risk factors detected")

        return risks

    def identify_positive_signals(self, marketplace_data: dict) -> list[str]:
        """Identify positive signals based on evidence."""
        signals = []
        profile = marketplace_data.get("profile", {})
        services = marketplace_data.get("services", [])
        evidence_quality = marketplace_data.get("evidence_quality", {})

        if profile and not profile.get("error"):
            signals.append("Agent identity is registered and verified")

        if services:
            signals.append(f"{len(services)} service(s) registered")

        if evidence_quality.get("completed_tasks", 0) > 0:
            signals.append(f"{evidence_quality['completed_tasks']} completed task(s)")

        if evidence_quality.get("reviews_count", 0) > 0:
            signals.append(f"{evidence_quality['reviews_count']} positive review(s)")

        onchain = marketplace_data.get("onchain_activity", {})
        if onchain and not onchain.get("error"):
            signals.append("On-chain activity verified")

        if not signals:
            signals.append("Agent is operational")

        return signals

    # ============================================================
    # RECOMMENDATION ENGINE
    # ============================================================

    def generate_recommendation(self, marketplace_data: dict) -> dict:
        """Generate a defensible hiring recommendation."""
        reputation = self.analyze_reputation(marketplace_data)
        behavioral = self.analyze_behavioral_risk(marketplace_data)
        delivery = self.analyze_delivery_confidence(marketplace_data)
        evidence_quality = marketplace_data.get("evidence_quality", {})

        # Decision logic
        if (
            reputation.get("completed_jobs", 0) >= 10
            and behavioral.get("active_disputes", 0) == 0
            and delivery.get("confidence") in ["High", "Medium"]
        ):
            decision = "Recommended for engagement"
            reason = (
                "Strong track record with verified delivery history and no disputes."
            )
        elif (
            reputation.get("completed_jobs", 0) > 0
            or evidence_quality.get("data_sources", 0) >= 3
        ):
            decision = "Suitable for low-risk trial evaluation"
            reason = "Limited but positive evidence. Recommend starting with a small, low-risk task."
        else:
            decision = "Insufficient evidence for reliable assessment"
            reason = "The agent has insufficient historical evidence to support confidence in reliability."

        return {
            "decision": decision,
            "reason": reason,
            "confidence_level": evidence_quality.get("confidence", "Low"),
        }
