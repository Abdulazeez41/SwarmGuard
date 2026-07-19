from typing import Dict, List, Optional, Tuple
import re
from marketplace_collector import MarketplaceDataCollector


class TeamBuilder:
    """
    Universal workforce orchestrator that dynamically builds teams
    for ANY task domain by analyzing project requirements and matching
    them against the OKX.AI marketplace.
    """
    
    def __init__(self):
        self.marketplace = MarketplaceDataCollector()
        
        # ═══════════════════════════════════════════════════════════
        # VERIFIED AGENT POOL - Real, registered OKX agent IDs
        # These are your "known good" agents with proven track records.
        # Add more as you register them on OKX.AI.
        # ═══════════════════════════════════════════════════════════
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
        
        # ═══════════════════════════════════════════════════════════
        # COMPREHENSIVE ROLE KEYWORD MAPPING
        # ═══════════════════════════════════════════════════════════
        self.role_keywords = {
            # ── Development & Engineering ──
            "smart_contract_expert": {
                "keywords": ["defi", "staking", "smart contract", "token", "solidity", "evm", 
                           "blockchain", "web3", "nft", "dao", "yield", "liquidity", "vault"],
                "priority": "core",
                "base_rate": 200,
                "complexity": "high",
            },
            "frontend_developer": {
                "keywords": ["dashboard", "frontend", "ui", "web app", "wallet", "react", 
                           "nextjs", "interface", "landing page", "website", "responsive",
                           "mobile app", "ios", "android", "flutter"],
                "priority": "core",
                "base_rate": 150,
                "complexity": "medium",
            },
            "backend_developer": {
                "keywords": ["api", "backend", "server", "database", "microservice", 
                           "nodejs", "python", "rest", "graphql", "sql", "mongodb",
                           "infrastructure", "architecture"],
                "priority": "core",
                "base_rate": 160,
                "complexity": "high",
            },
            "security_auditor": {
                "keywords": ["secure", "audit", "safe", "vulnerability", "pentest", 
                           "cryptography", "encryption", "compliance", "gdpr", "hipaa",
                           "risk assessment", "threat model"],
                "priority": "core",
                "base_rate": 220,
                "complexity": "high",
            },
            "qa_engineer": {
                "keywords": ["testing", "qa", "quality assurance", "automation", 
                           "bug", "regression", "integration test", "e2e"],
                "priority": "support",
                "base_rate": 120,
                "complexity": "medium",
            },
            "devops_engineer": {
                "keywords": ["deploy", "ci/cd", "docker", "kubernetes", "aws", "gcp",
                           "azure", "infrastructure", "monitoring", "scaling"],
                "priority": "support",
                "base_rate": 170,
                "complexity": "high",
            },
            
            # ── Data & Analytics ──
            "data_analyst": {
                "keywords": ["data", "analytics", "report", "dashboard", "visualization",
                           "statistics", "metrics", "kpi", "insights", "business intelligence",
                           "predict", "forecast", "trend"],
                "priority": "core",
                "base_rate": 140,
                "complexity": "medium",
            },
            "ml_engineer": {
                "keywords": ["machine learning", "ai model", "neural", "training",
                           "prediction", "classification", "nlp", "computer vision",
                           "llm", "gpt", "transformer"],
                "priority": "core",
                "base_rate": 240,
                "complexity": "high",
            },
            
            # ── Design & Creative ──
            "ux_designer": {
                "keywords": ["design", "ux", "ui design", "figma", "prototype",
                           "user experience", "wireframe", "branding", "visual"],
                "priority": "support",
                "base_rate": 130,
                "complexity": "medium",
            },
            "content_writer": {
                "keywords": ["content", "writing", "copy", "blog", "article",
                           "documentation", "technical writing", "storytelling",
                           "script", "narrative"],
                "priority": "support",
                "base_rate": 90,
                "complexity": "low",
            },
            
            # ── Business & Operations ──
            "marketing_strategist": {
                "keywords": ["marketing", "campaign", "seo", "social media", "ads",
                           "growth", "promotion", "brand", "outreach", "influencer"],
                "priority": "core",
                "base_rate": 140,
                "complexity": "medium",
            },
            "customer_support": {
                "keywords": ["support", "customer service", "help desk", "ticket",
                           "onboarding", "user assistance", "faq", "troubleshoot"],
                "priority": "support",
                "base_rate": 80,
                "complexity": "low",
            },
            "project_manager": {
                "keywords": ["manage", "coordinate", "timeline", "milestone", "agile",
                           "scrum", "sprint", "roadmap", "planning", "organize"],
                "priority": "core",
                "base_rate": 160,
                "complexity": "medium",
            },
            
            # ── Finance & Legal ──
            "financial_analyst": {
                "keywords": ["finance", "accounting", "budget", "forecast", "tax",
                           "investment", "portfolio", "valuation", "revenue", "profit"],
                "priority": "support",
                "base_rate": 170,
                "complexity": "high",
            },
            "legal_advisor": {
                "keywords": ["legal", "contract review", "compliance", "regulation",
                           "terms of service", "privacy policy", "licensing", "ip"],
                "priority": "support",
                "base_rate": 200,
                "complexity": "high",
            },
            
            # ── Research & Strategy ──
            "research_analyst": {
                "keywords": ["research", "investigate", "study", "survey", "literature",
                           "competitive analysis", "market research", "due diligence"],
                "priority": "support",
                "base_rate": 130,
                "complexity": "medium",
            },
            
            # ── Fallback ──
            "generalist": {
                "keywords": ["task", "help", "assist", "work", "job", "project"],
                "priority": "fallback",
                "base_rate": 100,
                "complexity": "medium",
            },
        }
        
        # Estimated hours per role based on typical project scope
        self.default_hours = {
            "smart_contract_expert": 40,
            "frontend_developer": 60,
            "backend_developer": 50,
            "security_auditor": 20,
            "qa_engineer": 30,
            "devops_engineer": 25,
            "data_analyst": 35,
            "ml_engineer": 50,
            "ux_designer": 30,
            "content_writer": 20,
            "marketing_strategist": 40,
            "customer_support": 25,
            "project_manager": 35,
            "financial_analyst": 30,
            "legal_advisor": 15,
            "research_analyst": 25,
            "generalist": 40,
        }
    
    # ═══════════════════════════════════════════════════════════
    # INTELLIGENT REQUIREMENT ANALYSIS
    # ═══════════════════════════════════════════════════════════
    
    def analyze_project_requirements(self, project_brief: str) -> Dict:
        """
        Analyzes a natural-language project brief and extracts:
        - Required roles (with priority ranking)
        - Estimated hours per role
        - Project complexity score
        - Domain classification
        """
        brief_lower = project_brief.lower()
        
        # Score each role based on keyword matches
        role_scores = {}
        for role, config in self.role_keywords.items():
            score = sum(1 for kw in config["keywords"] if kw in brief_lower)
            if score > 0:
                role_scores[role] = {
                    "score": score,
                    "priority": config["priority"],
                    "matched_keywords": [kw for kw in config["keywords"] if kw in brief_lower],
                }
        
        # Sort by score (descending), then by priority
        priority_order = {"core": 0, "support": 1, "fallback": 2}
        sorted_roles = sorted(
            role_scores.items(),
            key=lambda x: (-x[1]["score"], priority_order.get(x[1]["priority"], 99))
        )
        
        # Select required roles (top scorers, at least 1, max 5)
        required_roles = []
        estimated_hours = {}
        
        # Always include at least the top-scoring role
        if sorted_roles:
            for role, data in sorted_roles[:5]:
                required_roles.append(role)
                # Adjust hours based on complexity
                base_hours = self.default_hours.get(role, 40)
                complexity_multiplier = {
                    "high": 1.3,
                    "medium": 1.0,
                    "low": 0.8,
                }.get(self.role_keywords[role]["complexity"], 1.0)
                estimated_hours[role] = int(base_hours * complexity_multiplier)
        
        # Fallback: if no keywords matched, use generalist
        if not required_roles:
            required_roles.append("generalist")
            estimated_hours["generalist"] = self.default_hours["generalist"]
        
        # Calculate overall project complexity
        complexity_score = min(100, sum(data["score"] * 10 for _, data in sorted_roles[:3]))
        
        # Detect primary domain
        domain = self._detect_primary_domain(sorted_roles)
        
        return {
            "required_roles": required_roles,
            "estimated_hours": estimated_hours,
            "project_complexity": complexity_score,
            "primary_domain": domain,
            "role_analysis": {role: data for role, data in sorted_roles[:5]},
        }
    
    def _detect_primary_domain(self, sorted_roles: List[Tuple]) -> str:
        """Determines the primary domain based on top-scoring roles."""
        if not sorted_roles:
            return "general"
        
        top_role = sorted_roles[0][0]
        domain_map = {
            "smart_contract_expert": "blockchain",
            "frontend_developer": "development",
            "backend_developer": "development",
            "security_auditor": "security",
            "qa_engineer": "development",
            "devops_engineer": "infrastructure",
            "data_analyst": "analytics",
            "ml_engineer": "ai/ml",
            "ux_designer": "design",
            "content_writer": "content",
            "marketing_strategist": "marketing",
            "customer_support": "operations",
            "project_manager": "management",
            "financial_analyst": "finance",
            "legal_advisor": "legal",
            "research_analyst": "research",
            "generalist": "general",
        }
        return domain_map.get(top_role, "general")
    
    # ═══════════════════════════════════════════════════════════
    # LIVE AGENT DATA FETCHING
    # ═══════════════════════════════════════════════════════════
    
    def _get_live_agent_data(self, role: str, agent_id: str) -> Dict:
        """
        Fetches LIVE on-chain data for a real agent and calculates
        their trust score dynamically. NO MOCKS.
        """
        try:
            marketplace_data = self.marketplace.get_agent_marketplace_data(agent_id)
            score_data = self.marketplace.calculate_transparent_scores(marketplace_data)
            trust_score = score_data["total"]
            
            # Dynamic rate calculation based on role complexity and trust
            base_rate = self.role_keywords.get(role, {}).get("base_rate", 100)
            score_multiplier = 0.8 + (trust_score / 100) * 0.4
            hourly_rate = int(base_rate * score_multiplier)
            
            return {
                "agent_id": agent_id,
                "name": f"Agent {agent_id}",
                "specialization": role.replace("_", " ").title(),
                "hourly_rate_usd": hourly_rate,
                "availability": "immediate",
                "trust_score": trust_score,
                "score_breakdown": score_data["scores"],
                "marketplace_metrics": {
                    "completed_jobs": marketplace_data.get("raw_metrics", {}).get("completed_jobs", 0),
                    "average_rating": marketplace_data.get("raw_metrics", {}).get("average_rating", 0.0),
                    "wallet_balance_eth": marketplace_data.get("raw_metrics", {}).get("wallet_balance_eth", 0.0),
                    "transaction_count": marketplace_data.get("raw_metrics", {}).get("transaction_count", 0)
                },
                "data_source": "LIVE_XLAYER_BLOCKCHAIN",
                "verified": True,
            }
            
        except Exception as e:
            print(f"[TeamBuilder] ⚠️ Error fetching live data for agent {agent_id}: {e}")
            return {
                "error": f"Failed to fetch live on-chain data for agent {agent_id}: {str(e)}",
                "agent_id": agent_id,
                "role": role,
            }
    
    # ═══════════════════════════════════════════════════════════
    # AGENT SELECTION WITH INTELLIGENT FALLBACKS
    # ═══════════════════════════════════════════════════════════
    
    def find_best_agent_for_role(self, role: str) -> Dict:
        """
        Finds the best agent for a given role with intelligent fallbacks:
        1. Use verified agent if available
        2. Fall back to closest matching role
        3. Fall back to generalist
        """
        # Exact match with verified agent
        if role in self.verified_agents:
            agent_id = self.verified_agents[role]
            result = self._get_live_agent_data(role, agent_id)
            if "error" not in result:
                return result
        
        # Find closest role with a verified agent
        similar_roles = self._find_similar_roles(role)
        for similar_role in similar_roles:
            if similar_role in self.verified_agents:
                agent_id = self.verified_agents[similar_role]
                result = self._get_live_agent_data(similar_role, agent_id)
                if "error" not in result:
                    # Mark as "adapted" since it's not an exact match
                    result["adapted_from"] = similar_role
                    result["requested_role"] = role
                    return result
        
        # Fall back to generalist
        if "generalist" in self.verified_agents:
            agent_id = self.verified_agents["generalist"]
            result = self._get_live_agent_data("generalist", agent_id)
            if "error" not in result:
                result["adapted_from"] = "generalist"
                result["requested_role"] = role
                return result
        
        # Last resort: Return error (no agents available)
        return {
            "error": f"No verified agents available for role '{role}' or suitable fallbacks",
            "requested_role": role,
            "suggestion": "Register a new agent on OKX.AI for this specialization",
        }
    
    def _find_similar_roles(self, role: str) -> List[str]:
        """
        Finds roles that are similar to the requested role.
        Used for intelligent fallback when exact match isn't available.
        """
        similarity_map = {
            "backend_developer": ["smart_contract_expert", "devops_engineer"],
            "qa_engineer": ["frontend_developer", "backend_developer"],
            "devops_engineer": ["backend_developer", "security_auditor"],
            "data_analyst": ["ml_engineer", "research_analyst"],
            "ml_engineer": ["data_analyst", "backend_developer"],
            "ux_designer": ["frontend_developer", "content_writer"],
            "content_writer": ["ux_designer", "marketing_strategist"],
            "marketing_strategist": ["content_writer", "research_analyst"],
            "customer_support": ["project_manager", "generalist"],
            "project_manager": ["generalist", "customer_support"],
            "financial_analyst": ["data_analyst", "research_analyst"],
            "legal_advisor": ["security_auditor", "research_analyst"],
            "research_analyst": ["data_analyst", "financial_analyst"],
            "generalist": ["project_manager", "customer_support"],
        }
        return similarity_map.get(role, ["generalist"])
    
    # ═══════════════════════════════════════════════════════════
    # TEAM BUILDING
    # ═══════════════════════════════════════════════════════════
    
    def build_team(self, project_brief: str, budget_usd: float) -> Dict:
        """
        Builds a complete team for any project by:
        1. Analyzing requirements across all domains
        2. Selecting the best agents with intelligent fallbacks
        3. Calculating realistic cost estimates
        4. Providing budget recommendations
        """
        print(f"\n[TeamBuilder] 🎯 Analyzing project: {project_brief[:80]}...")
        
        requirements = self.analyze_project_requirements(project_brief)
        team = []
        total_cost = 0
        total_hours = 0
        fallbacks_used = []
        
        print(f"[TeamBuilder] 📊 Required roles: {requirements['required_roles']}")
        print(f"[TeamBuilder] 🌐 Primary domain: {requirements['primary_domain']}")
        print(f"[TeamBuilder] ⚡ Complexity score: {requirements['project_complexity']}")
        
        for role in requirements["required_roles"]:
            print(f"[TeamBuilder] 🔍 Finding agent for: {role}...")
            agent = self.find_best_agent_for_role(role)
            
            if "error" not in agent:
                team.append(agent)
                hours = requirements["estimated_hours"][role]
                total_hours += hours
                total_cost += hours * agent["hourly_rate_usd"]
                
                if "adapted_from" in agent:
                    fallbacks_used.append({
                        "requested": role,
                        "provided": agent.get("adapted_from"),
                        "agent_id": agent["agent_id"],
                    })
                    print(f"[TeamBuilder] ⚠️ Used fallback: {role} → {agent.get('adapted_from')} (Agent {agent['agent_id']})")
                else:
                    print(f"[TeamBuilder] ✅ Recruited: {agent['name']} (Trust: {agent['trust_score']}, Rate: ${agent['hourly_rate_usd']}/hr)")
            else:
                print(f"[TeamBuilder] ❌ Failed to recruit for {role}: {agent['error']}")
        
        # Budget analysis
        budget_status = "WITHIN_BUDGET"
        budget_utilization = (total_cost / budget_usd * 100) if budget_usd > 0 else 0
        recommendations = []
        
        if total_cost > budget_usd:
            budget_status = "EXCEEDS_BUDGET"
            overage = total_cost - budget_usd
            recommendations.append(
                f"Requested scope exceeds budget by ${overage:,.0f}. "
                f"Consider reducing scope, increasing budget, or hiring fewer specialists."
            )
        elif budget_utilization < 50:
            recommendations.append(
                f"Budget utilization is only {budget_utilization:.0f}%. "
                f"Consider expanding scope or reducing budget allocation."
            )
        
        # Add fallback warnings
        if fallbacks_used:
            fallback_roles = [f["requested"] for f in fallbacks_used]
            recommendations.append(
                f"Fallback agents used for: {', '.join(fallback_roles)}. "
                f"Register specialized agents on OKX.AI for optimal results."
            )
        
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
            "fallbacks_used": fallbacks_used,
            "project_analysis": {
                "primary_domain": requirements["primary_domain"],
                "complexity_score": requirements["project_complexity"],
                "required_roles": requirements["required_roles"],
            },
            "data_source": "LIVE_XLAYER_BLOCKCHAIN",
        }