import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import MinMaxScaler
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from api.extraction import calculate_water_quality  # Import the water quality function

# Load the dataset
df = pd.read_csv("output.csv")

# Convert 'date' to datetime and extract time-based features
df["date"] = pd.to_datetime(df["date"])
df["Hour"] = df["date"].dt.hour
df["Day"] = df["date"].dt.day
df["Month"] = df["date"].dt.month

# Automatically determine the cutoff date as 80% of the way through the dataset
cutoff_date = df["date"].quantile(0.8)
print("Cutoff date (80% percentile):", cutoff_date)

# Split the dataframe using the dynamically determined cutoff date
training = df[df["date"] <= cutoff_date].copy()
validation = df[df["date"] > cutoff_date].copy()

# Define features and target columns
feature_cols = ["Hour", "Day", "Month"]
target_cols = ["PERCENTAGE DISSOLVED OXYGEN (%)", "TEMPERATURE (°C)", "TURBIDITY (NTU)",
               "DISSOLVED OXYGEN (mg/L)", "PH (???)"]

# Extract training and validation features/targets
X_train = training[feature_cols]
y_train = training[target_cols]
X_val = validation[feature_cols]
y_val = validation[target_cols]  # For later evaluation if needed

# Scale features and targets; fit scalers on training data only
scaler_X = MinMaxScaler()
scaler_y = MinMaxScaler()

X_train_scaled = scaler_X.fit_transform(X_train)
y_train_scaled = scaler_y.fit_transform(y_train)
X_val_scaled = scaler_X.transform(X_val)
# Note: we will predict y values for validation

# Setup the estimator and hyperparameter grid
base_estimator = GradientBoostingRegressor(random_state=42)
multi_target_model = MultiOutputRegressor(base_estimator)
param_grid = {
    "estimator__n_estimators": [100, 200],
    "estimator__max_depth": [3, 5],
    "estimator__learning_rate": [0.1, 0.05],
    "estimator__min_samples_split": [2, 5]
}
grid_search = GridSearchCV(multi_target_model, param_grid, cv=3, 
                           scoring="neg_mean_absolute_error", verbose=1, n_jobs=-1)
grid_search.fit(X_train_scaled, y_train_scaled)
print("Best hyperparameters found:")
print(grid_search.best_params_)

# Predict on validation set (forecasted targets)
y_val_pred_scaled = grid_search.predict(X_val_scaled)
y_val_pred = scaler_y.inverse_transform(y_val_pred_scaled)

# Use a constant nitrate value for quality calculation
nitrate_const = 10

# Calculate water quality on a per-row basis:
# For training, use actual measured values
training_quality = [
    calculate_water_quality(row["PH (???)"], row["PERCENTAGE DISSOLVED OXYGEN (%)"], row["TURBIDITY (NTU)"], nitrate_const)
    for _, row in training.iterrows()
]

# For the forecast period, calculate two sets:
# 1. Forecasted water quality (model predictions)
validation_quality_forecast = [
    calculate_water_quality(pH, do, turbidity, nitrate_const)
    for pH, do, turbidity in zip(y_val_pred[:, 4], y_val_pred[:, 0], y_val_pred[:, 2])
]

# 2. Actual water quality (using measured values in validation set)
validation_quality_actual = [
    calculate_water_quality(row["PH (???)"], row["PERCENTAGE DISSOLVED OXYGEN (%)"], row["TURBIDITY (NTU)"], nitrate_const)
    for _, row in validation.iterrows()
]

# Create DataFrames with the date and quality score, then group by date using median aggregation
train_quality_df = pd.DataFrame({
    "date": training["date"].dt.date,
    "quality": training_quality
})
median_train_quality = train_quality_df.groupby("date").median().reset_index()

val_quality_df_forecast = pd.DataFrame({
    "date": validation["date"].dt.date,
    "quality": validation_quality_forecast
})
median_val_quality_forecast = val_quality_df_forecast.groupby("date").median().reset_index()

val_quality_df_actual = pd.DataFrame({
    "date": validation["date"].dt.date,
    "quality": validation_quality_actual
})
median_val_quality_actual = val_quality_df_actual.groupby("date").median().reset_index()

# Convert date columns back to datetime for plotting
median_train_quality["date"] = pd.to_datetime(median_train_quality["date"])
median_val_quality_forecast["date"] = pd.to_datetime(median_val_quality_forecast["date"])
median_val_quality_actual["date"] = pd.to_datetime(median_val_quality_actual["date"])

# Calculate performance metrics for the forecast period using median values
mae = mean_absolute_error(median_val_quality_actual["quality"], median_val_quality_forecast["quality"])
rmse = np.sqrt(mean_squared_error(median_val_quality_actual["quality"], median_val_quality_forecast["quality"]))
print(f"Forecast Performance Metrics:\n MAE: {mae:.4f}\n RMSE: {rmse:.4f}")

# Plot the overall water quality:
plt.figure(figsize=(12, 6))
# Plot training (actual measured) water quality
plt.plot(median_train_quality["date"], median_train_quality["quality"], "b.-", label="Training (Actual) Water Quality")
# Plot forecasted water quality (predicted)
plt.plot(median_val_quality_forecast["date"], median_val_quality_forecast["quality"], "r.-", label="Forecasted Water Quality")
# Plot actual measured water quality for the forecast period
plt.plot(median_val_quality_actual["date"], median_val_quality_actual["quality"], "g.-", label="Validation (Actual) Water Quality")
plt.axvline(x=cutoff_date, color="k", linestyle="--", label="Cutoff Date")
plt.title("Water Quality Forecast: Actual (Before) vs Forecasted and Measured (After)")
plt.xlabel("Date")
plt.ylabel("Water Quality Score (Median)")
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()