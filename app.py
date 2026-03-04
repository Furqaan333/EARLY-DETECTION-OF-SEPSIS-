# IMPORT REQUIRED LIBRARIES
from xml.parsers.expat import model

from flask import Flask, render_template, request, redirect, session, url_for, flash 
from flask_mail import Mail, Message
import joblib
import pandas as pd
import os

import warnings
warnings.filterwarnings("ignore")


# IMPORT USER / DB FUNCTIONS
from users import (
    init_db,
    register_user,
    validate_login,
    get_user_by_username,
    save_prediction,
    get_user_predictions,
    update_user_password,
    store_otp,
    verify_otp,
    set_user_verified,
    is_user_verified
)

# FLASK APP CONFIG
app = Flask(__name__)

# EMAIL CONFIGURATION
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

app.config['MAIL_USERNAME'] = 'furkaanmanzoor333@gmail.com'
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")


app.config['MAIL_DEFAULT_SENDER'] = 'furkaanmanzoor333@gmail.com'

mail = Mail(app)

app.secret_key = "early_sepsis_major_project_secret"

# Initialize database
init_db()

# MODEL CONFIGURATION
MODEL_CONFIG = {
    "pneumonia": {
        "model": "models/pneumonia_random_forest_model.pkl",
        "scaler": "models/pneumonia_scaler.pkl",
        "features": "models/pneumonia_features.pkl",
        "label_encoder": "models/pneumonia_label_encoder.pkl"
    },
    "uti": {
        "model": "models/uti_random_forest_model.pkl",
        "scaler": "models/uti_scaler.pkl",
        "features": "models/uti_features.pkl",
        "label_encoder": "models/uti_label_encoder.pkl"
    },
    "ssti": {
        "model": "models/ssti_random_forest_model.pkl",
        "scaler": "models/ssti_scaler.pkl",
        "features": "models/ssti_features.pkl",
        "label_encoder": "models/ssti_label_encoder.pkl"
    },
    "abdominal": {
        "model": "models/abdominal_random_forest_model.pkl",
        "scaler": "models/abdominal_scaler.pkl",
        "features": "models/abdominal_features.pkl",
        "label_encoder": "models/abdominal_label_encoder.pkl"
    }
}

    


# LOAD ALL MODELS AT STARTUP
LOADED_MODELS = {}

for disease, config in MODEL_CONFIG.items():
    LOADED_MODELS[disease] = {
        "model": joblib.load(config["model"]),
        "scaler": joblib.load(config["scaler"]),
        "features": joblib.load(config["features"]),
        "label_encoder": joblib.load(config["label_encoder"])
    }

print("All models loaded successfully.")


# UNIFIED PREDICTION FUNCTION
def predict_sepsis_risk(disease, patient_data):

    disease = disease.lower()

    if disease not in LOADED_MODELS:
        raise ValueError("Disease not supported")

    components = LOADED_MODELS[disease]

    model = components["model"]
    scaler = components["scaler"]
    feature_names = components["features"]
    label_encoder = components["label_encoder"]

    # Build input dataframe in correct feature order
    input_df = pd.DataFrame([{f: patient_data.get(f, 0) for f in feature_names}])
    input_df = input_df.apply(pd.to_numeric, errors="coerce").fillna(0)

    # Scale
    input_scaled = scaler.transform(input_df)

    # Predict
    prediction = model.predict(input_scaled)[0]
    probs = model.predict_proba(input_scaled)[0]
    predicted_label = label_encoder.inverse_transform([prediction])[0]
    confidence = float(probs[prediction])


    # CLEAN BINARY + RISK LOGIC
    if predicted_label == "Low":
        sepsis_prediction = "No"
        risk_level = "Low"
    elif predicted_label == "Medium":
        sepsis_prediction = "Yes"
        risk_level = "Medium"
    else:  # High
        sepsis_prediction = "Yes"
        risk_level = "High"


    return {
        "Disease": disease.upper(),
        "Sepsis_Prediction": sepsis_prediction,
        "Risk_Level": risk_level,
        "Model_Confidence": round(confidence, 3)
    }





# AUTHENTICATION ROUTES
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        user = validate_login(
            request.form["username"],
            request.form["password"]
        )

        if user == "NOT_VERIFIED":
            session["email"] = request.form["username"]
            flash("Please verify your email first.")
            return redirect(url_for("verify_email"))

        if isinstance(user, dict):
            session["user"] = user["username"]
            session["email"] = user["email"]
            return redirect(url_for("dashboard"))

        flash("Invalid username or password")

    return render_template("login.html")



@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        confirm_email = request.form.get("confirm_email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        if not all([username, email, confirm_email, password, confirm_password]):
            flash("All fields are required.")
            return render_template("signup.html")

        if email != confirm_email:
            flash("Emails do not match.")
            return render_template("signup.html")

        if password != confirm_password:
            flash("Passwords do not match.")
            return render_template("signup.html")

        success = register_user(username, email, password)

        if not success:
            flash("User already exists.")
            return render_template("signup.html")

        otp = store_otp(email)

        msg = Message(
            subject="SepsisRisk AI | Email Verification OTP",
            recipients=[email],
            body=f"""
Hello {username},

Your OTP for email verification is:

{otp}

Regards,
SepsisRisk AI Team
"""
        )
        mail.send(msg)

        session["email"] = email
        flash("OTP sent to your email.")
        return redirect(url_for("verify_email"))

    return render_template("signup.html")



@app.route("/verify", methods=["GET", "POST"])
def verify_email():
    if request.method == "POST":
        otp = request.form["otp"]
        email = session.get("email")

        if verify_otp(email, otp):
            set_user_verified(email)
            flash("Email verified successfully.")
            return redirect(url_for("login"))
        else:
            flash("Invalid OTP.")

    return render_template("verify_email.html")



@app.route("/resend_otp")
def resend_otp():
    email = session.get("email")
    if not email:
        return redirect(url_for("login"))

    otp = store_otp(email)

    msg = Message(
        subject="Sepsis Predictor | Resend OTP",
        recipients=[email],
        body=f"""
Your new OTP is:

{otp}

Please verify your email.
"""
    )
    mail.send(msg)

    flash("OTP resent to your email.")
    return redirect(url_for("verify_email"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# CORE PAGES
@app.route("/landing")
def landing():
    return render_template("landing.html")


@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("index.html")


@app.route("/main")
def main():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("main.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")

# PROFILE MANAGEMENT
@app.route("/edit_profile", methods=["GET", "POST"])
def edit_profile():
    if "user" not in session:
        return redirect(url_for("login"))

    user = get_user_by_username(session["user"])

    if request.method == "POST":
        update_user_password(session["email"], request.form["new_password"])

        flash("Password updated successfully")

    return render_template("edit_profile.html", user=user)


@app.route("/change_password", methods=["GET", "POST"])
def change_password():
    if "user" not in session:
        return redirect(url_for("login"))

    if request.method == "POST":
        update_user_password(
            session["user"],
            request.form["current_password"],
            request.form["new_password"]
        )
        flash("Password changed successfully")
        return redirect(url_for("main"))

    return render_template("change_password.html")

# SEPSIS PREDICTION
@app.route("/predict", methods=["GET", "POST"])
def predict():
    if "user" not in session:
        return redirect(url_for("login"))

    result = None

    if request.method == "POST":
        disease = request.form["disease"]

        # Collect inputs exactly as sent by JS
        patient_data = {
            k:v
            for k, v in request.form.items()
            if k != "disease"
        }

        result = predict_sepsis_risk(disease, patient_data)

        user = get_user_by_username(session["user"])
        save_prediction(
            user["id"],
            result["Disease"],
            result["Sepsis_Prediction"],
            result["Model_Confidence"],
            result["Risk_Level"]
        )

    return render_template("predict.html", result=result)


# HISTORY
@app.route("/history")
def history():
    if "user" not in session:
        return redirect(url_for("login"))

    user = get_user_by_username(session["user"])
    predictions = get_user_predictions(user["id"])
    return render_template("history.html", predictions=predictions)

@app.route("/forgot_password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        step = request.form.get("step")

        # STEP 1: EMAIL SUBMISSION
        if step == "email":
            email = request.form["email"]
            store_otp(email)
            session["forgot_email"] = email
            flash("OTP sent to your email")
            return render_template(
                "forget.html",
                otp_sent=True,
                otp_verified=False
            )

        # STEP 2: OTP VERIFICATION
        elif step == "otp":
            email = session.get("forgot_email")
            otp = request.form["otp"]

            if verify_otp(email, otp):
                session["otp_verified"] = True
                flash("OTP verified successfully")
                return render_template(
                    "forget.html",
                    otp_sent=True,
                    otp_verified=True
                )
            else:
                flash("Invalid OTP")
                return render_template(
                    "forget.html",
                    otp_sent=True,
                    otp_verified=False
                )

        # STEP 3: PASSWORD RESET
        elif step == "reset":
            email = session.get("forgot_email")
            new_password = request.form["new_password"]
            confirm_password = request.form["confirm_password"]

            if new_password != confirm_password:
                flash("Passwords do not match")
                return render_template(
                    "forget.html",
                    otp_sent=True,
                    otp_verified=True
                )

            update_user_password(email, None, new_password, forgot=True)
            flash("Password reset successful")
            session.pop("forgot_email", None)
            session.pop("otp_verified", None)
            return redirect(url_for("login"))

    return render_template(
        "forget.html",
        otp_sent=False,
        otp_verified=False
    )

# RUN APPLICATION
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
