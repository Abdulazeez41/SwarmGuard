"""
SwarmGuard Application Runtime

Creates the shared application services used by the REST API
and MCP interface.

IMPORTANT:
This runtime shares state only within the same Python process.
If api_server.py and mcp_server.py run as separate processes,
persistent storage must be used for cross-process state.
"""

from swarm_orchestrator import SwarmOrchestrator

# Single shared orchestrator instance
orchestrator = SwarmOrchestrator()