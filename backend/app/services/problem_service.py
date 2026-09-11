import os
import json
import sqlite3
import random
from datetime import datetime
from app.ai.classifier import classify_problem
from app.ai.prioritizer import calculate_priority_score
from app.ai.deduplicator import find_duplicate_problems

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
DB_PATH = os.path.join(DB_DIR, "setu_problems.db")

def _get_db():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def _init_db():
    with _get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS problems (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                category TEXT,
                department TEXT,
                severity TEXT,
                score REAL,
                status TEXT,
                impact_count TEXT,
                impact_description TEXT,
                reporter_type TEXT,
                group_name TEXT,
                author TEXT,
                author_id TEXT,
                address TEXT,
                village_city TEXT,
                subdistrict TEXT,
                district TEXT,
                state TEXT,
                pincode TEXT,
                latitude REAL,
                longitude REAL,
                thumbnail TEXT,
                evidence_urls TEXT,
                upvotes INTEGER DEFAULT 1,
                safety_status TEXT DEFAULT 'SAFE',
                raw_transcripts TEXT,
                created_at TEXT,
                updated_at TEXT
            )
        """)
        conn.commit()

        # Safe migrations for pre-existing tables
        migration_cols = [
            ("group_name", "TEXT"),
            ("upvotes", "INTEGER DEFAULT 1"),
            ("safety_status", "TEXT DEFAULT 'SAFE'"),
            ("raw_transcripts", "TEXT"),
            ("updated_at", "TEXT")
        ]
        for col_name, col_type in migration_cols:
            try:
                conn.execute(f"ALTER TABLE problems ADD COLUMN {col_name} {col_type}")
                conn.commit()
            except Exception:
                pass

# Ensure table exists on import
_init_db()

class ProblemService:
    @staticmethod
    def _format_row(row):
        if not row:
            return None
        item = dict(row)
        if item.get("evidence_urls"):
            try:
                item["evidenceUrls"] = json.loads(item["evidence_urls"])
            except Exception:
                item["evidenceUrls"] = []
        else:
            item["evidenceUrls"] = []

        if item.get("raw_transcripts"):
            try:
                item["rawTranscripts"] = json.loads(item["raw_transcripts"])
            except Exception:
                item["rawTranscripts"] = {}
        else:
            item["rawTranscripts"] = {}

        # Expose camelCase properties for frontend compatibility
        item["impactCount"] = item.get("impact_count") or "50-150 residents"
        item["impactDescription"] = item.get("impact_description") or ""
        item["reporterType"] = item.get("reporter_type") or "Citizen"
        item["groupName"] = item.get("group_name") or ""
        item["villageCity"] = item.get("village_city") or ""
        item["subdistrict"] = item.get("subdistrict") or ""
        item["pincode"] = item.get("pincode") or ""
        item["upvotes"] = item.get("upvotes") if item.get("upvotes") is not None else 1
        item["safetyStatus"] = item.get("safety_status") or "SAFE"
        item["createdAt"] = item.get("created_at")
        item["updatedAt"] = item.get("updated_at")
        return item

    @staticmethod
    def get_all(category=None, status=None, author_id=None, author=None, search=None, include_flagged=False):
        query = "SELECT * FROM problems WHERE 1=1"
        params = []

        # By default exclude policy violation and deleted reports
        if not include_flagged:
            query += " AND (safety_status IS NULL OR (safety_status != 'FLAGGED_POLICY_VIOLATION' AND safety_status != 'DELETED'))"

        if category:
            query += " AND category = ?"
            params.append(category)
        if status:
            query += " AND status = ?"
            params.append(status)
        if author_id:
            query += " AND author_id = ?"
            params.append(author_id)
        elif author:
            query += " AND author LIKE ?"
            params.append(f"%{author}%")
        if search:
            query += " AND (title LIKE ? OR description LIKE ? OR address LIKE ?)"
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

        query += " ORDER BY created_at DESC"

        with _get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [ProblemService._format_row(row) for row in rows]

    @staticmethod
    def get_by_id(problem_id):
        with _get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM problems WHERE id = ?", (problem_id,))
            row = cursor.fetchone()
            return ProblemService._format_row(row)

    @staticmethod
    def create_problem(data):
        # Generate official SETU reference ID, e.g., SETU-7294
        raw_id = data.get("id")
        if raw_id and raw_id.startswith("SETU-"):
            prob_id = raw_id
        else:
            prob_id = f"SETU-{random.randint(1000, 9999)}"

        title = data.get("title", "").strip()
        description = data.get("description", "").strip()
        
        # 1. AI Classification if not provided or valid
        category = data.get("category")
        if not category:
            ai_res = classify_problem(f"{title} {description}")
            category = ai_res["category"]
            
        # 2. Duplicate Detection against existing DB records
        existing = ProblemService.get_all()
        duplicates = find_duplicate_problems({
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "category": category
        }, existing)
        
        # 3. Severity & Priority Scoring
        priority_res = calculate_priority_score(title, description, duplicate_count=len(duplicates))
        severity = data.get("severity") or priority_res["severity"]
        score = priority_res["score"]

        created_at = datetime.utcnow().isoformat() + "Z"
        evidence_urls = data.get("evidenceUrls", [])
        evidence_json = json.dumps(evidence_urls) if isinstance(evidence_urls, list) else "[]"
        
        raw_transcripts = data.get("rawTranscripts") or data.get("transcripts") or {}
        transcripts_json = json.dumps(raw_transcripts) if isinstance(raw_transcripts, (dict, list)) else str(raw_transcripts)

        thumbnail = data.get("thumbnail") or (evidence_urls[0] if evidence_urls else None)
        reporter_type = data.get("reporterType") or data.get("reporter_type") or "Citizen"
        group_name = data.get("groupName") or data.get("group_name") or ""
        impact_count = data.get("impactCount") or data.get("impact_count") or "Local community"
        impact_description = data.get("impactDescription") or data.get("impact_description") or ""
        safety_status = data.get("safetyStatus") or data.get("safety_status") or "SAFE"
        upvotes = data.get("upvotes", 1)

        with _get_db() as conn:
            conn.execute("""
                INSERT OR REPLACE INTO problems (
                    id, title, description, category, department, severity, score, status,
                    impact_count, impact_description, reporter_type, group_name, author, author_id,
                    address, village_city, subdistrict, district, state, pincode,
                    latitude, longitude, thumbnail, evidence_urls, upvotes, safety_status,
                    raw_transcripts, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                prob_id,
                title,
                description,
                category,
                data.get("department", "DHTE Nodal Evaluation Cell"),
                severity,
                score,
                "SUBMITTED" if not duplicates else "FLAGGED_DUPLICATE",
                str(impact_count),
                impact_description,
                reporter_type,
                group_name,
                data.get("author", "Citizen"),
                data.get("authorId") or data.get("author_id") or "cit-anonymous",
                data.get("address", ""),
                data.get("villageCity") or data.get("village_city") or "",
                data.get("subdistrict", ""),
                data.get("district", ""),
                data.get("state", ""),
                data.get("pincode", ""),
                data.get("latitude"),
                data.get("longitude"),
                thumbnail,
                evidence_json,
                upvotes,
                safety_status,
                transcripts_json,
                created_at,
                created_at
            ))
            conn.commit()

        return ProblemService.get_by_id(prob_id)

    @staticmethod
    def upvote(problem_id):
        with _get_db() as conn:
            conn.execute("""
                UPDATE problems
                SET upvotes = COALESCE(upvotes, 0) + 1
                WHERE id = ?
            """, (problem_id,))
            conn.commit()
        return ProblemService.get_by_id(problem_id)

    @staticmethod
    def update_status(problem_id, status):
        now = datetime.utcnow().isoformat() + "Z"
        with _get_db() as conn:
            conn.execute("""
                UPDATE problems
                SET status = ?, updated_at = ?
                WHERE id = ?
            """, (status, now, problem_id))
            conn.commit()
        return ProblemService.get_by_id(problem_id)

    @staticmethod
    def update_problem(problem_id, data):
        allowed_fields = [
            "title", "description", "category", "department", "severity", "status",
            "impact_count", "impact_description", "address", "village_city", "subdistrict",
            "district", "state", "pincode", "latitude", "longitude", "safety_status", "upvotes"
        ]
        updates = []
        params = []
        for k, v in data.items():
            # handle camelCase to snake_case
            snake_k = k
            if k == "impactCount": snake_k = "impact_count"
            elif k == "impactDescription": snake_k = "impact_description"
            elif k == "villageCity": snake_k = "village_city"
            elif k == "safetyStatus": snake_k = "safety_status"

            if snake_k in allowed_fields:
                updates.append(f"{snake_k} = ?")
                params.append(v)

        if not updates:
            return ProblemService.get_by_id(problem_id)

        now = datetime.utcnow().isoformat() + "Z"
        updates.append("updated_at = ?")
        params.append(now)

        params.append(problem_id)
        query = f"UPDATE problems SET {', '.join(updates)} WHERE id = ?"
        with _get_db() as conn:
            conn.execute(query, params)
            conn.commit()

        return ProblemService.get_by_id(problem_id)

    @staticmethod
    def delete_problem(problem_id):
        with _get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM problems WHERE id = ?", (problem_id,))
            conn.commit()
            return cursor.rowcount > 0
