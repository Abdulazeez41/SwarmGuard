import subprocess
import json
from typing import Dict, List, Optional
from marketplace_collector import MarketplaceDataCollector


class TeamBuilder:
    """
    Universal workforce orchestrator that dynamically searches the OKX.AI marketplace
    and recruits the best agents for any task domain.
    """
    
    def __init__(self):
        self.marketplace = MarketplaceDataCollector()
        
        # Fallback verified agents (used only if marketplace search fails)
        self.verified_agents = {
            # Development & Engineering
            "smart_contract_expert": "5993",
            "frontend_developer": "5889",
            "security_auditor": "5922",
            
            # ═══════════════════════════════════════════════════════
            # Add more verified agents here as you register them:
            # "backend_developer": "XXXX",
            # "data_analyst": "XXXX",
            # "ux_designer": "XXXX",
            # "marketing_strategist": "XXXX",
            # "customer_support": "XXXX",
            # "financial_analyst": "XXXX",
            # "content_writer": "XXXX",
            # "project_manager": "XXXX",
            # "qa_engineer": "XXXX",
            # "devops_engineer": "XXXX",
            # "generalist": "XXXX",  # Fallback for unrecognized tasks
            # ═══════════════════════════════════════════════════════
        }
        
        # Role keyword mapping for requirement analysis
        self.role_keywords = {
            "smart_contract_expert": {
                "keywords": ["defi", "staking", "smart contract", "token", "solidity", "evm", "blockchain", "web3"],
                "priority": "core",
                "base_rate": 200,
                "complexity": "high",
            },
            "frontend_developer": {
                "keywords": ["dashboard", "frontend", "ui", "web app", "wallet", "react", "nextjs", "interface"],
                "priority": "core",
                "base_rate": 150,
                "complexity": "medium",
            },
            "security_auditor": {
                "keywords": ["secure", "audit", "safe", "vulnerability", "pentest", "cryptography", "compliance"],
                "priority": "core",
                "base_rate": 220,
                "complexity": "high",
            },
            "data_analyst": {
                "keywords": ["data", "analytics", "report", "visualization", "statistics", "metrics"],
                "priority": "core",
                "base_rate": 140,
                "complexity": "medium",
            },
            "marketing_strategist": {
                "keywords": ["marketing", "campaign", "seo", "social media", "ads", "growth", "promotion"],
                "priority": "core",
                "base_rate": 140,
                "complexity": "medium",
            },
            "generalist": {
                "keywords": ["task", "help", "assist", "work", "job", "project"],
                "priority": "fallback",
                "base_rate": 100,
                "complexity": "medium",
            },
        }
        
        self.default_hours = {
            "smart_contract_expert": 40,
            "frontend_developer": 60,
            "security_auditor": 20,
            "data_analyst": 35,
            "marketing_strategist": 40,
            "generalist": 40,
        }

    def analyze_project_requirements(self, project_brief: str) -> Dict:
        """Analyzes project brief and extracts required roles."""
        brief_lower = project_brief.lower()
        role_scores = {}
        
        for role, config in self.role_keywords.items():
            score = sum(1 for kw in config["keywords"] if kw in brief_lower)
            if score > 0:
                role_scores[role] = {"score": score, "priority": config["priority"]}
        
        priority_order = {"core": 0, "support": 1, "fallback": 2}
        sorted_roles = sorted(
            role_scores.items(),
            key=lambda x: (-x[1]["score"], priority_order.get(x[1]["priority"], 99))
        )
        
        required_roles = []
        estimated_hours = {}
        
        if sorted_roles:
            for role, data in sorted_roles[:5]:
                required_roles.append(role)
                base_hours = self.default_hours.get(role, 40)
                complexity_multiplier = {"high": 1.3, "medium": 1.0, "low": 0.8}.get(
                    self.role_keywords[role]["complexity"], 1.0
                )
                estimated_hours[role] = int(base_hours * complexity_multiplier)
        
        if not required_roles:
            required_roles.append("generalist")
            estimated_hours["generalist"] = self.default_hours["generalist"]
        
        return {
            "required_roles": required_roles,
            "estimated_hours": estimated_hours,
        }

    def search_marketplace_for_role(self, role: str) -> List[Dict]:
        """
        Searches the OKX.AI marketplace for agents matching a specific role.
        Returns a list of agents sorted by trust score.
        """
        # Map role to search query
        search_queries = {
            "smart_contract_expert": "smart contract blockchain",
            "frontend_developer": "frontend web dashboard",
            "security_auditor": "security audit",
            "data_analyst": "data analytics",
            "marketing_strategist": "marketing campaign",
            "generalist": "general assistant",
        }
        
        query = search_queries.get(role, role.replace("_", " "))
        
        try:
            # Call the onchainos CLI
            result = subprocess.run(
                ["onchainos", "agent", "search", "--query", query],
                capture_output=True,
                text=True,
                timeout=15
            )
            
            if result.returncode != 0:
                print(f"[TeamBuilder] ⚠️ Marketplace search failed for {role}: {result.stderr}")
                return []
            
            # Parse the JSON output
            data = json.loads(result.stdout)
            
            if not data.get("ok") or not data.get("data", {}).get("list"):
                print(f"[TeamBuilder] ⚠️ No agents found for {role}")
                return []
            
            agents = data["data"]["list"]
            
            # Score and rank agents
            scored_agents = []
            for agent in agents:
                feedback_rate = agent.get("feedbackRate", 0)
                security_rate = agent.get("securityRate", 0)
                sold_count = agent.get("soldCount", 0)
                
                # Calculate composite trust score (0-100)
                # Weight: 50% feedback, 30% security, 20% popularity
                trust_score = (
                    (feedback_rate * 0.5) +
                    (security_rate * 20 * 0.3) +  # security_rate is 0-5, scale to 0-100
                    (min(sold_count / 100, 100) * 0.2)  # cap popularity at 100
                )
                
                scored_agents.append({
                    "agent_id": agent.get("agentId"),
                    "name": agent.get("name"),
                    "trust_score": round(trust_score, 2),
                    "feedback_rate": feedback_rate,
                    "security_rate": security_rate,
                    "sold_count": sold_count,
                    "services": agent.get("services", []),
                    "profile_description": agent.get("profileDescription", ""),
                })
            
            # Sort by trust score (highest first)
            scored_agents.sort(key=lambda x: x["trust_score"], reverse=True)
            
            print(f"[TeamBuilder] 🔍 Found {len(scored_agents)} agents for '{query}'")
            if scored_agents:
                top = scored_agents[0]
                print(f"[TeamBuilder] ✅ Top agent: {top['name']} (ID: {top['agent_id']}, Trust: {top['trust_score']})")
            
            return scored_agents
            
        except subprocess.TimeoutExpired:
            print(f"[TeamBuilder] ⚠️ Marketplace search timeout for {role}")
            return []
        except json.JSONDecodeError as e:
            print(f"[TeamBuilder] ⚠️ Failed to parse marketplace response for {role}: {e}")
            return []
        except Exception as e:
            print(f"[TeamBuilder] ⚠️ Unexpected error searching marketplace for {role}: {e}")
            return []

    def get_agent_from_marketplace(self, role: str) -> Dict:
        """
        Gets the best agent for a role from the marketplace.
        Falls back to verified agents if marketplace search fails.
        """
        # Try marketplace first
        marketplace_agents = self.search_marketplace_for_role(role)
        
        if marketplace_agents:
            best_agent = marketplace_agents[0]
            
            # Calculate dynamic hourly rate based on trust score and role complexity
            base_rate = self.role_keywords.get(role, {}).get("base_rate", 100)
            trust_multiplier = 0.8 + (best_agent["trust_score"] / 100) * 0.4
            hourly_rate = int(base_rate * trust_multiplier)
            
            return {
                "agent_id": best_agent["agent_id"],
                "name": best_agent["name"],
                "specialization": role.replace("_", " ").title(),
                "hourly_rate_usd": hourly_rate,
                "availability": "immediate",
                "trust_score": best_agent["trust_score"],
                "marketplace_metrics": {
                    "feedback_rate": best_agent["feedback_rate"],
                    "security_rate": best_agent["security_rate"],
                    "sold_count": best_agent["sold_count"],
                    "services_count": len(best_agent["services"]),
                },
                "data_source": "OKX_MARKETPLACE",
                "verified": False,
            }
        
        # Fallback to verified agent
        print(f"[TeamBuilder] ⚠️ Marketplace search failed for {role}, using verified agent")
        if role in self.verified_agents:
            return self._get_verified_agent(role)
        
        return {"error": f"No agents available for role '{role}'"}

    def _get_verified_agent(self, role: str) -> Dict:
        """Fallback: Gets data for a pre-verified agent."""
        agent_id = self.verified_agents[role]
        
        try:
            marketplace_data = self.marketplace.get_agent_marketplace_data(agent_id)
            score_data = self.marketplace.calculate_transparent_scores(marketplace_data)
            trust_score = score_data["total"]
            
            base_rate = self.role_keywords.get(role, {}).get("base_rate", 100)
            score_multiplier = 0.8 + (trust_score / 100) * 0.4
            
            return {
                "agent_id": agent_id,
                "name": f"Agent {agent_id}",
                "specialization": role.replace("_", " ").title(),
                "hourly_rate_usd": int(base_rate * score_multiplier),
                "availability": "immediate",
                "trust_score": trust_score,
                "score_breakdown": score_data["scores"],
                "data_source": "VERIFIED_AGENT",
                "verified": True,
            }
        except Exception as e:
            return {"error": f"Failed to fetch verified agent {agent_id}: {str(e)}"}

    def build_team(self, project_brief: str, budget_usd: float) -> Dict:
        """Builds a complete team by searching the marketplace for each required role."""
        print(f"\n[TeamBuilder] 🎯 Analyzing project: {project_brief[:80]}...")
        
        requirements = self.analyze_project_requirements(project_brief)
        team = []
        total_cost = 0
        total_hours = 0
        
        for role in requirements["required_roles"]:
            print(f"[TeamBuilder] 🔍 Finding agent for: {role}...")
            agent = self.get_agent_from_marketplace(role)
            
            if "error" not in agent:
                team.append(agent)
                hours = requirements["estimated_hours"][role]
                total_hours += hours
                total_cost += hours * agent["hourly_rate_usd"]
                
                source = "MARKETPLACE" if agent.get("data_source") == "OKX_MARKETPLACE" else "VERIFIED"
                print(f"[TeamBuilder] ✅ Recruited: {agent['name']} (Trust: {agent['trust_score']}, Rate: ${agent['hourly_rate_usd']}/hr, Source: {source})")
            else:
                print(f"[TeamBuilder] ❌ Failed to recruit for {role}: {agent['error']}")
        
        budget_status = "WITHIN_BUDGET"
        budget_utilization = (total_cost / budget_usd * 100) if budget_usd > 0 else 0
        recommendations = []
        
        if total_cost > budget_usd:
            budget_status = "EXCEEDS_BUDGET"
            recommendations.append(f"Requested scope exceeds budget by ${total_cost - budget_usd:,.0f}.")
        elif budget_utilization < 50:
            recommendations.append(f"Budget utilization is only {budget_utilization:.0f}%.")
        
        return {
            "project_brief": project_brief,
            "team_size": len(team),
            "team": team,
            "cost_estimation": {
                "total_hours": total_hours,
                "total_cost_usd": total_cost,
                "average_hourly_rate": int(total_cost / total_hours) if total_hours > 0 else 0,
                "budget_utilization_percent": round(budget_utilization, 1),
            },
            "budget_status": budget_status,
            "recommendations": recommendations,
            "data_source": "OKX_MARKETPLACE_DYNAMIC",
        }