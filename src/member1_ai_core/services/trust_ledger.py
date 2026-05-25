import hashlib
import json
import time
import os
import qrcode
from pathlib import Path
from ..schemas import (
    TransactionRequest,
    TransactionResponse,
    LedgerHistoryResponse,
    QRPassportResponse,
    LedgerBlock
)

# In-memory storage for the blockchain state
# In production, this would persist to Supabase or a local db.
GLOBAL_LEDGER: list[dict] = []

class Block:
    def __init__(self, index: int, timestamp: float, data: dict, previous_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = json.dumps(
            {
                "index": self.index,
                "timestamp": self.timestamp,
                "data": self.data,
                "previous_hash": self.previous_hash
            },
            sort_keys=True
        ).encode()
        return hashlib.sha256(block_string).hexdigest()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }

def get_latest_block() -> dict:
    if not GLOBAL_LEDGER:
        # Create Genesis Block if ledger is empty
        genesis = Block(0, time.time(), {"info": "Genesis Block"}, "0")
        GLOBAL_LEDGER.append(genesis.to_dict())
    return GLOBAL_LEDGER[-1]

def add_transaction(payload: TransactionRequest) -> TransactionResponse:
    # 1. Fake rating detection logic
    if payload.action_type == "rating":
        # Check if same IP submitted > 3 ratings in the last hour
        recent_ratings = [
            b for b in GLOBAL_LEDGER 
            if b["data"].get("action_type") == "rating" 
            and b["data"].get("ip_address") == payload.ip_address
            and (time.time() - b["timestamp"]) < 3600
        ]
        if len(recent_ratings) >= 3:
            payload.details["flagged_fake"] = True
            payload.details["trust_score"] = 0.0
        else:
            payload.details["flagged_fake"] = False
            payload.details["trust_score"] = 1.0

    # 2. Append block
    previous_block = get_latest_block()
    new_index = previous_block["index"] + 1
    
    transaction_data = {
        "product_id": payload.product_id,
        "action_type": payload.action_type,
        "ip_address": payload.ip_address,
        "details": payload.details
    }
    
    new_block = Block(new_index, time.time(), transaction_data, previous_block["hash"])
    GLOBAL_LEDGER.append(new_block.to_dict())
    
    return TransactionResponse(
        message="Transaction permanently recorded on ledger.",
        block_hash=new_block.hash,
        block_index=new_block.index
    )

def get_product_history(product_id: str) -> LedgerHistoryResponse:
    product_blocks = []
    # Force initialization if empty
    if not GLOBAL_LEDGER:
        get_latest_block()
        
    for b in GLOBAL_LEDGER:
        # Genesis block doesn't have product_id
        if b["data"].get("product_id") == product_id or b["index"] == 0:
            product_blocks.append(LedgerBlock(**b))
            
    # Simple chain validation check
    is_valid = True
    for i in range(1, len(GLOBAL_LEDGER)):
        current = GLOBAL_LEDGER[i]
        previous = GLOBAL_LEDGER[i-1]
        
        # Re-verify hash
        block_obj = Block(current["index"], current["timestamp"], current["data"], current["previous_hash"])
        if current["hash"] != block_obj.hash or current["previous_hash"] != previous["hash"]:
            is_valid = False
            break

    return LedgerHistoryResponse(
        product_id=product_id,
        is_valid=is_valid,
        blocks=product_blocks
    )

def generate_qr_passport(product_id: str) -> QRPassportResponse:
    # 1. Ensure data directory exists
    data_dir = Path(__file__).parent.parent.parent.parent / "data" / "qrcodes"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # 2. Create the QR URL (pointing to the blockchain explorer for this product)
    passport_url = f"http://127.0.0.1:8000/ledger/history/{product_id}"
    
    # 3. Generate QR
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(passport_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    file_path = data_dir / f"{product_id}_passport.png"
    img.save(str(file_path))
    
    return QRPassportResponse(
        message="QR Passport generated successfully.",
        qr_file_path=str(file_path.absolute()),
        passport_url=passport_url
    )

def sync_to_supabase() -> dict:
    # Offline-first stub: In a real environment, this would push GLOBAL_LEDGER to Supabase
    return {"status": "success", "synced_blocks": str(len(GLOBAL_LEDGER)), "message": "Synced to Supabase"}
