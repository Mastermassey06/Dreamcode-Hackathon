import requests
from .constants import API_BASE, VERIFY
from datetime import datetime

def closest_station(session: requests.Session, lat: float, long: float):
    response = session.get(
        API_BASE,
        params={
            "lat": lat,
            "long": long,
            "dist": 10,
        },
        verify=VERIFY
    )

    return response.json()["items"][0]["notation"]


def get_city_from_coords(session: requests.Session, lat: float, long: float):
    response = session.get(
        f"https://maps.googleapis.com/maps/api/geocode/json?latlng={str(lat)},{str(long)}&key=&result_type=locality",   #my key would be here
        verify=VERIFY
    )
    return response.json()["results"][0]["address_components"][0]["short_name"]


def get_station_measurements(session: requests.Session, closest_station: str):
    # Ask the API for all of the measurements to the closest station
    response = session.get(
        f"{API_BASE}/{closest_station}/measures",
        params={
            "observedProperty": [
                "ph",
                "turbidity",
                "dissolved-oxygen",
                "temperature",
                "nitrate"
            ]
        },
        verify=VERIFY
    )

   # Get each reading for all measurements and parse it accordingly
    raw_measures = response.json()["items"]
    print(f"{API_BASE}/{closest_station}/measures")
    parsed: dict[datetime, dict[str, float]] = {}
    for measure in raw_measures:
        # Grab the readings for each measurement
        response = session.get(
            f"{measure["@id"]}/readings.json",
            verify=VERIFY
        )
        items = response.json()["items"]

        # Get each reading in all readings
        for item in items:
            # Parse the date and add it to the parsed dataset
            date = datetime.strptime(item["dateTime"], "%Y-%m-%dT%H:%M:%S")
            if date not in parsed:
                parsed[date] = {}

            # Resolve the correct parameter and unit
            unit = measure.get("unitName") or "???"
            parameter = measure["parameter"]

            if parameter == "DISSOLVED OXYGEN":
                if unit == "%":
                    parameter = "PERCENTAGE DISSOLVED OXYGEN"

            # Add the column and it"s value to the dataset
            column = f"{parameter} ({unit})"
            parsed[date][column] = item["value"]

    # Return the parsed dataset
    return parsed


def calculate_water_quality(pH: float, dissolved_oxygen: float, turbidity: float, nitrate: float):
    """
    Calculate water quality scores for a single data point based on given parameters.
    
    Parameters:
    - pH (float): pH level of water
    - dissolved_oxygen (float): Dissolved oxygen as %
    - turbidity (float): Turbidity in NTU
    - nitrate (float): Nitrate concentration in mg/L
    
    Returns:
    - dict: Scores for each parameter and overall water quality score.
    """
    
    # pH Score
    if 6.5 <= pH <= 8.5:
        ph_score = 100.0
    else:
        ph_score = max(0, 100 - abs(pH - 7) * 50)
    
    # Dissolved Oxygen (DO) Score
    do_score = min(100, (dissolved_oxygen / 8) * 100)
    
    # Turbidity Score
    if turbidity <= 5:
        turbidity_score = 100.0
    else:
        turbidity_score = max(0, 100 - (turbidity - 5) * 10)
    
    # Nitrate Score
    if nitrate <= 10:
        nitrate_score = 100.0
    else:
        nitrate_score = max(0, 100 - (nitrate - 10) * 5)
    
    # Overall Water Quality Score (average of all scores)
    water_quality_score = (ph_score + do_score + turbidity_score + nitrate_score) / 4
    
    return water_quality_score


# Takes the measurements and performs additional measurements
def perform_additional_calcs(parsed: dict):
    changed = []

    for date, data in parsed.items():
        data["quality"] = calculate_water_quality(
            pH=data.get("PH (???)") or 7,
            dissolved_oxygen=data.get("PERCENTAGE DISSOLVED OXYGEN (%) OXYGEN") or 100,
            turbidity=data.get("TURBIDITY (NTU)") or 5,
            nitrate=data.get("NITRATE") or 10
        )
        data["date"] = str(date)

        changed.append(data)

    # Sort by 'date' in descending order
    changed.sort(key=lambda x: x["date"], reverse=True)

    return changed


def calculate_main(lat: float, long: float):
    session = requests.Session()
    station = closest_station(session, lat, long)
    city = get_city_from_coords(session, lat, long)
    measurements = get_station_measurements(session, station)
    final_parsed = perform_additional_calcs(measurements)

    return final_parsed, city

