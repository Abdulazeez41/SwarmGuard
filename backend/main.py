from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Truora MCP Trust Service")

# --- Data Models ---
class AgentTrustRequest(BaseModel):
    wallet_address: str

class AgentTrustResponse(BaseModel):
    trustScore: int
    riskLevel: str
    walletAge: int

# --- Service Logic ---
def calculate_trust_and_risk(wallet_address: str):
    if not wallet_address:
        raise ValueError("Wallet address cannot be empty")

    if wallet_address.startswith("0x"):
        trust_score = 75 + (len(wallet_address) % 25)
    else:
        trust_score = 60 + (len(wallet_address) % 15)

    trust_score = max(0, min(100, trust_score))

    if trust_score > 80:
        risk_level = "Low"
    elif trust_score > 60:
        risk_level = "Medium"
    else:
        risk_level = "High"

    wallet_age = 730

    return AgentTrustResponse(
        trustScore=trust_score,
        riskLevel=risk_level,
        walletAge=wallet_age
    )

# --- API Endpoints ---
@app.post("/check_agent_trust", response_model=AgentTrustResponse)
async def check_agent_trust_endpoint(request: AgentTrustRequest):
    if not request.wallet_address:
        raise HTTPException(status_code=400, detail="Wallet address is required")
    
    try:
        return calculate_trust_and_risk(request.wallet_address)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "Truora MCP Trust Service is running", "status": "healthy"}
