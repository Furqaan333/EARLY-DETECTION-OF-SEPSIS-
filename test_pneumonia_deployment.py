import joblib
import pandas as pd

# Load saved files
model = joblib.load("models/pneumonia_random_forest_model.pkl")
scaler = joblib.load("models/pneumonia_scaler.pkl")
feature_names = joblib.load("models/pneumonia_features.pkl")
label_encoder = joblib.load("models/pneumonia_label_encoder.pkl")

# Create SAME sample you used in notebook
sample_input = {
    "Gender": 0,
    "Age": 54,
    "Cough": 0,
    "Fever": 0,
    "Shortness_of_breath": 1,
    "Chest_pain": 2,
    "Fatigue": 1,
    "Confusion": 1,
    "oxygen_saturation": 90,
    "Crackles": 1,
    "Xray": 0,
    "wbc_count": 9801.5,
    "body_temperature": 40.4,
    "heart_rate": 92,
    "respiratory_rate": 13,
    "systolic_bp": 112,
    "platelets": 254243
}

# Create DataFrame in correct feature order
input_df = pd.DataFrame([sample_input])
input_df = input_df[feature_names]

print("Input DF:")
print(input_df)

# Scale and KEEP feature names
scaled_input = pd.DataFrame(
    scaler.transform(input_df),
    columns=feature_names
)

print("\nScaled Input:")
print(scaled_input)

# Predict
prediction = model.predict(scaled_input)[0]
probs = model.predict_proba(scaled_input)[0]
probability = probs[prediction]

decoded_label = label_encoder.inverse_transform([prediction])[0]

print("\nPrediction:", decoded_label)
print("Probability:", probability)