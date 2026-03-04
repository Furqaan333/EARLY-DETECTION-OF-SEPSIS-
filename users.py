import sqlite3
import random
import string
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

DB_NAME = "sepsis_users.db"

# DATABASE INITIALIZATION
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_verified INTEGER DEFAULT 0
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        disease TEXT,
        sepsis_prediction TEXT,
        probability REAL,
        risk_level TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_verification (
        email TEXT PRIMARY KEY,
        otp TEXT NOT NULL,
        expiry DATETIME NOT NULL
    )
    """)

    conn.commit()
    conn.close()


# USER REGISTRATION
def register_user(username, email, password):
    hashed_password = generate_password_hash(password)

    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        """, (username, email, hashed_password))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False

# LOGIN VALIDATION
def validate_login(username_or_email, password):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, username, email, password, is_verified
        FROM users
        WHERE username=? OR email=?
    """, (username_or_email, username_or_email))

    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[3], password):
        if user[4] == 0:
            return "NOT_VERIFIED"
        return {
            "id": user[0],
            "username": user[1],
            "email": user[2],
            "is_verified": user[4]
    }

    return None

# GET USER BY USERNAME
def get_user_by_username(username):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, username, email
        FROM users
        WHERE username=?
    """, (username,))

    user = cursor.fetchone()
    conn.close()

    if user:
        return {
            "id": user[0],
            "username": user[1],
            "email": user[2]
        }
    return None

# OTP MANAGEMENT
def store_otp(email):
    otp = str(random.randint(100000, 999999))
    expiry = (datetime.now() + timedelta(minutes=10)).isoformat()

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("DELETE FROM otp_verification WHERE email = ?", (email,))

    cursor.execute("""
        INSERT INTO otp_verification (email, otp, expiry)
        VALUES (?, ?, ?)
    """, (email, otp, expiry))

    conn.commit()
    conn.close()

    return otp




def verify_otp(email, otp):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT otp, expiry FROM otp_verification WHERE email=?",
        (email,)
    )
    result = cursor.fetchone()
    conn.close()

    if not result:
        return False

    saved_otp, expiry = result
    expiry_time = datetime.fromisoformat(expiry)

    if datetime.now() > expiry_time:
        return False

    return saved_otp == otp




def set_user_verified(email):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET is_verified = 1
        WHERE email = ?
    """, (email,))

    conn.commit()
    conn.close()

def clear_otp(email):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM otp_verification WHERE email=?", (email,))
    conn.commit()
    conn.close()



def is_user_verified(email):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT is_verified FROM users WHERE email = ?
    """, (email,))

    result = cursor.fetchone()
    conn.close()

    return result and result[0] == 1


# PASSWORD UPDATE
def update_user_password(email, new_password):
    hashed_password = generate_password_hash(new_password)

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET password=?
        WHERE email=?
    """, (hashed_password, email))

    conn.commit()
    conn.close()


# SAVE PREDICTION

def save_prediction(user_id, disease, sepsis_prediction, probability, risk_level):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO predictions
        (user_id, disease, sepsis_prediction, probability, risk_level)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, disease, sepsis_prediction, probability, risk_level))

    conn.commit()
    conn.close()

# FETCH USER PREDICTIONS

def get_user_predictions(user_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT disease, sepsis_prediction , probability, risk_level, timestamp
        FROM predictions
        WHERE user_id=?
        ORDER BY timestamp DESC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    predictions = []
    for row in rows:
        predictions.append({
            "disease": row[0],
            "sepsis_prediction": row[1],
            "probability": row[2],
            "risk_level": row[3],
            "timestamp": row[4]
        })

    return predictions
