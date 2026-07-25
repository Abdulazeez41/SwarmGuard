"""
SwarmGuard MCP Server
"""

import re

from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
from web3 import Web3

load_dotenv()

from database import init_db
from marketplace_collector import MarketplaceDataCollector
from runtime import orchestrator


# ============================================================
# MCP SERVER
# ============================================================

mcp = FastMCP(
    "SwarmGuard: Autonomous Workforce OS"
)


# ============================================================
# BLOCKCHAIN CONFIGURATION
# ============================================================

XLayer_RPC = "https://testrpc.xlayer.tech"

w3 = Web3(
    Web3.HTTPProvider(XLayer_RPC)
)


# ============================================================
# MARKETPLACE DATA COLLECTOR
# ============================================================

marketplace = MarketplaceDataCollector()


# ============================================================
# CONSTANTS
# ============================================================

DEMO_AGENT_WALLET = (
    "0x1b2f5d07f1ed46bdbbeb019ee7797f65d8d2dbfd"
)

KNOWN_AGENT_IDS = {
    "5889",
    "5922",
    "5765",
    "5993",
}


# ============================================================
# HELPERS
# ============================================================

def is_valid_evm_address(address: str) -> bool:
    """
    Validate a basic EVM wallet address.

    Example:

        0x1234567890123456789012345678901234567890
    """

    return bool(
        re.fullmatch(
            r"0x[a-fA-F0-9]{40}",
            address,
        )
    )


def resolve_agent_identity(
    agent_identifier: str,
) -> tuple[str | None, str]:
    """
    Resolve an agent identifier into:

        (agent_id, wallet_address)

    Supported inputs:

    1. Known agent ID
    2. Direct EVM wallet address

    Returns:

        ("5993", "0x...")
        or
        (None, "0x...")
    """

    agent_identifier = agent_identifier.strip()

    # Agent ID
    if agent_identifier.isdigit():

        agent_id = agent_identifier

        if agent_id in KNOWN_AGENT_IDS:
            return (
                agent_id,
                DEMO_AGENT_WALLET,
            )

        return (
            agent_id,
            "",
        )

    # Direct wallet address
    if is_valid_evm_address(agent_identifier):
        return (
            None,
            agent_identifier,
        )

    return (
        None,
        "",
    )


# ============================================================
# MCP TOOL 1
# CREDIT / DECISION INTELLIGENCE REPORT
# ============================================================

@mcp.tool()
def generate_credit_report(
    agent_identifier: str,
) -> dict:
    """
    Generate a Decision Intelligence Report for an agent.

    The agent can be identified by:

    - A supported agent ID
    - An EVM wallet address

    The report combines:

    - Blockchain wallet activity
    - Marketplace history
    - Behavioral profile
    - Risk factors
    - Credit events
    - Delivery prediction
    - Transparent trust scoring
    - Hiring recommendation
    """

    # --------------------------------------------------------
    # Resolve identity
    # --------------------------------------------------------

    agent_id, wallet_address = resolve_agent_identity(
        agent_identifier
    )

    if not wallet_address:
        return {
            "error": (
                "Invalid or unresolved agent identifier. "
                "Provide a supported agent ID or valid "
                "EVM wallet address."
            )
        }

    try:

        # ----------------------------------------------------
        # Validate blockchain connection
        # ----------------------------------------------------

        if not w3.is_connected():
            return {
                "error": (
                    "Unable to connect to XLayer RPC."
                )
            }

        # ----------------------------------------------------
        # Convert to checksum address
        # ----------------------------------------------------

        checksum_address = (
            w3.to_checksum_address(
                wallet_address
            )
        )

        # ----------------------------------------------------
        # Blockchain data
        # ----------------------------------------------------

        nonce = w3.eth.get_transaction_count(
            checksum_address
        )

        balance_wei = w3.eth.get_balance(
            checksum_address
        )

        balance_eth = float(
            w3.from_wei(
                balance_wei,
                "ether",
            )
        )

        # ----------------------------------------------------
        # Marketplace intelligence
        # ----------------------------------------------------

        marketplace_identifier = (
            agent_id
            if agent_id
            else checksum_address
        )

        marketplace_data = (
            marketplace.get_agent_marketplace_data(
                marketplace_identifier
            )
        )

        behavioral_profile = (
            marketplace.generate_behavioral_profile(
                marketplace_data
            )
        )

        risk_factors = (
            marketplace.generate_risk_factors(
                marketplace_data
            )
        )

        credit_events = (
            marketplace.generate_credit_events(
                marketplace_data
            )
        )

        specialization = (
            marketplace.determine_specialization(
                marketplace_data
            )
        )

        prediction = (
            marketplace.predict_delivery_success(
                marketplace_data
            )
        )

        score_data = (
            marketplace.calculate_transparent_scores(
                marketplace_data
            )
        )

        # ----------------------------------------------------
        # Decision Intelligence Score
        # ----------------------------------------------------

        total_score = score_data.get(
            "total",
            0,
        )

        # ----------------------------------------------------
        # Primary strength
        # ----------------------------------------------------

        primary_strength = (
            "Strong behavioral profile"
            if "Proven Track Record"
            in behavioral_profile
            else "Zero adverse disputes (New Agent)"
        )

        # ----------------------------------------------------
        # Primary risk
        # ----------------------------------------------------

        if (
            risk_factors
            and "No significant"
            not in risk_factors[0]
        ):
            primary_risk = risk_factors[0]
        else:
            primary_risk = "None detected"

        # ----------------------------------------------------
        # Hiring recommendation
        # ----------------------------------------------------

        prediction_confidence = prediction.get(
            "confidence",
            0,
        )

        if (
            total_score >= 80
            and prediction_confidence >= 70
        ):

            hiring_verdict = (
                "HIGHLY RECOMMENDED"
            )

            decision_reason = (
                "Strong track record, excellent "
                "behavioral profile, and high "
                "prediction confidence."
            )

        elif total_score >= 60:

            hiring_verdict = (
                "RECOMMENDED WITH CAUTION"
            )

            decision_reason = (
                "Adequate history, but monitor "
                "specific risk factors."
            )

        else:

            hiring_verdict = (
                "NOT RECOMMENDED FOR HIGH-VALUE TASKS"
            )

            decision_reason = (
                "Insufficient data or elevated "
                "risk factors. Consider a "
                "low-value trial."
            )

        # ----------------------------------------------------
        # Return report
        # ----------------------------------------------------

        return {

            "report_type":
                "Decision Intelligence Report",

            "identity": {

                "agent_id":
                    agent_id or "N/A",

                "network":
                    (
                        "XLayer Mainnet"
                        if agent_id
                        in ["5765", "5993"]
                        else "XLayer Testnet"
                    ),

                "wallet":
                    checksum_address,

            },

            "blockchain_activity": {

                "transaction_count":
                    nonce,

                "native_balance":
                    balance_eth,

                "native_balance_unit":
                    "XLayer native asset",

            },

            "specialization":
                specialization,

            "behavioral_profile":
                behavioral_profile,

            "risk_factors":
                risk_factors,

            "credit_events":
                credit_events,

            "prediction_and_confidence": {

                "success_probability":
                    f"{prediction.get('probability', 0)}%",

                "confidence_level":
                    f"{prediction_confidence}%",

            },

            "score_breakdown":
                score_data,

            "hiring_decision": {

                "verdict":
                    hiring_verdict,

                "reason":
                    decision_reason,

            },

            "executive_summary": {

                "overall_decision_intelligence_score":
                    total_score,

                "primary_strength":
                    primary_strength,

                "primary_risk":
                    primary_risk,

            },

        }

    except Exception as e:

        return {
            "error": (
                "Failed to generate credit report: "
                f"{str(e)}"
            )
        }


# ============================================================
# MCP TOOL 2
# INITIATE SWARM TASK
# ============================================================

@mcp.tool()
def initiate_swarm_task(
    project_brief: str,
    budget_usd: float,
) -> dict:
    """
    Deploy an autonomous workforce.

    The SwarmOrchestrator:

    1. Analyzes the project.
    2. Builds a team.
    3. Validates the budget.
    4. Creates a persistent swarm task.
    5. Stores the task in PostgreSQL.
    6. Locks performance-bond state.
    7. Returns the persistent task ID.

    The task can later be accessed by:

        evaluate_and_heal_milestone()
        get_swarm_status()

    from either MCP or REST API.
    """

    # --------------------------------------------------------
    # Validate input
    # --------------------------------------------------------

    if not project_brief.strip():
        return {
            "status": "ERROR",
            "message": (
                "Project brief cannot be empty."
            ),
        }

    if budget_usd <= 0:
        return {
            "status": "ERROR",
            "message": (
                "Budget must be greater than zero."
            ),
        }

    # --------------------------------------------------------
    # Delegate to shared orchestrator
    # --------------------------------------------------------

    return orchestrator.initiate_swarm(
        project_brief=project_brief.strip(),
        budget_usd=budget_usd,
    )


# ============================================================
# MCP TOOL 3
# EVALUATE AND HEAL MILESTONE
# ============================================================

@mcp.tool()
def evaluate_and_heal_milestone(
    task_id: str,
    deliverable_summary: str,
) -> dict:
    """
    Evaluate the current milestone of a swarm task.

    On success:

    - Releases milestone payment.
    - Advances the milestone.
    - Returns the performance bond.
    - Persists the updated task.

    On failure:

    - Applies reputation penalty.
    - Records the failure.
    - Forfeits the performance bond.
    - Records a Swarm Memory lesson.
    - Searches for a replacement.
    - Persists the replacement team.
    """

    # --------------------------------------------------------
    # Validate input
    # --------------------------------------------------------

    if not task_id.strip():
        return {
            "status": "ERROR",
            "message": (
                "Task ID cannot be empty."
            ),
        }

    if not deliverable_summary.strip():
        return {
            "status": "ERROR",
            "message": (
                "Deliverable summary cannot be empty."
            ),
        }

    # --------------------------------------------------------
    # Delegate to shared orchestrator
    # --------------------------------------------------------

    return orchestrator.evaluate_and_heal(
        task_id=task_id.strip(),
        deliverable_summary=(
            deliverable_summary.strip()
        ),
    )


# ============================================================
# MCP TOOL 4
# GET SWARM STATUS
# ============================================================

@mcp.tool()
def get_swarm_status(
    task_id: str,
) -> dict:
    """
    Return the current persistent status of a swarm.

    This data is loaded from PostgreSQL through the
    SwarmOrchestrator / SwarmRepository layer.

    Therefore, the task can have been created by:

    - MCP
    - FastAPI
    - Another backend process

    as long as all processes use the same database.
    """

    if not task_id.strip():
        return {
            "status": "ERROR",
            "message": (
                "Task ID cannot be empty."
            ),
        }

    return orchestrator.get_swarm_status(
        task_id.strip()
    )


# ============================================================
# OPTIONAL MCP TOOL 5
# LIST SWARM TASKS
# ============================================================

@mcp.tool()
def list_swarm_tasks() -> dict:
    """
    Return all persisted swarm tasks.

    Useful for discovering task IDs when integrating
    OpenClaw or other MCP clients.
    """

    try:

        tasks = (
            orchestrator.repository.get_all_tasks()
        )

        return {
            "status": "SUCCESS",
            "count": len(tasks),
            "tasks": [
                {
                    "task_id":
                        task["task_id"],

                    "brief":
                        task["brief"],

                    "status":
                        task["status"],

                    "budget_remaining":
                        task["budget_remaining"],

                    "current_milestone":
                        task["current_milestone"],

                    "created_at":
                        task.get("created_at"),

                    "updated_at":
                        task.get("updated_at"),

                }
                for task in tasks
            ],
        }

    except Exception as e:

        return {
            "status": "ERROR",
            "message": (
                f"Failed to list swarm tasks: {str(e)}"
            ),
        }


# ============================================================
# LOCAL MCP STDIO ENTRYPOINT
# ============================================================

if __name__ == "__main__":

    init_db()

    print(
        "🛡️ SwarmGuard MCP Server starting..."
    )

    print(
        "📦 Persistent storage: PostgreSQL"
    )

    print(
        "🧠 Shared orchestrator: runtime.orchestrator"
    )

    print(
        "🔗 MCP transport: stdio"
    )

    mcp.run()