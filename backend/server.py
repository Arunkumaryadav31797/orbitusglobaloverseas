from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
ALERT_EMAIL = os.environ.get("ALERT_EMAIL", "Contact.orbitusglobal@gmail.com")

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class LeadCreate(BaseModel):
    qualification: str = Field(min_length=1)
    degree: str = Field(min_length=1)
    countries: List[str] = Field(min_length=1)
    intake: str = Field(min_length=1)
    english: str = Field(min_length=1)
    budget: str = Field(min_length=1)
    full_name: str = Field(min_length=2)
    email: EmailStr
    phone: str = Field(pattern=r"^\+?[0-9\s-]{9,}$")
    city: str = Field(min_length=2)
    consent: bool

    @field_validator("consent")
    @classmethod
    def consent_must_be_true(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Consent is required")
        return value

class LeadResponse(LeadCreate):
    id: str
    created_at: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Orbitus Global Overseas API"}

async def send_lead_alert(lead: dict):
    if not RESEND_API_KEY:
        logger.info("RESEND_API_KEY not set; skipping lead alert email for %s", lead.get("email"))
        return
    rows = "".join(
        f'<tr><td style="padding:8px 14px;border:1px solid #e5e0d5;font-size:12px;color:#64748b">{label}</td>'
        f'<td style="padding:8px 14px;border:1px solid #e5e0d5;font-size:12px;color:#0A192F;font-weight:600">{value}</td></tr>'
        for label, value in [
            ("Name", lead["full_name"]), ("Email", lead["email"]), ("Phone / WhatsApp", lead["phone"]),
            ("City / Nationality", lead["city"]), ("Qualification", lead["qualification"]),
            ("Target degree", lead["degree"]), ("Countries", ", ".join(lead["countries"])),
            ("Intake", lead["intake"]), ("English test", lead["english"]), ("Annual budget", lead["budget"]),
        ]
    )
    html = (
        '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">'
        '<div style="background:#071426;padding:20px 24px"><span style="color:#F59E0B;font-size:13px;letter-spacing:2px;font-weight:bold">ORBITUS GLOBAL OVERSEAS</span></div>'
        '<div style="padding:24px;border:1px solid #e5e0d5;border-top:0">'
        f'<h2 style="margin:0 0 6px;font-size:20px;color:#0A192F">New profile assessment</h2>'
        '<p style="margin:0 0 18px;font-size:12px;color:#64748b">A student just completed the free assessment on the website.</p>'
        f'<table style="border-collapse:collapse;width:100%">{rows}</table>'
        '<p style="margin:18px 0 0;font-size:11px;color:#94a3b8">Reply within one business day to keep the momentum going.</p>'
        '</div></div>'
    )
    params = {"from": SENDER_EMAIL, "to": [ALERT_EMAIL], "subject": f"New lead: {lead['full_name']} — {', '.join(lead['countries'])}", "html": html}
    try:
        resend.api_key = RESEND_API_KEY
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info("Lead alert email sent for %s", lead.get("email"))
    except Exception as exc:
        logger.error("Failed to send lead alert email: %s", exc)

@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(input: LeadCreate):
    lead = input.model_dump()
    lead_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    doc = {**lead, "id": lead_id, "created_at": created_at}
    await db.leads.insert_one(doc)
    asyncio.create_task(send_lead_alert(lead))
    return LeadResponse(**doc)

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()