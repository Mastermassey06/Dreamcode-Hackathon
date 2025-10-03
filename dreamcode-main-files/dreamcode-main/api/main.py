import requests
from .extraction import *
from flask import Flask, jsonify, request
from .constants import LOCATION_TO_HARDNESS

# Create the Flask app
app = Flask(__name__)

# Get the data
@app.route("/water_quality", methods=["GET"])
def req_calculate_water_quality():
   lat = request.args.get("lat", type=float)
   long = request.args.get("long", type=float)
   final_parsed, city = calculate_main(lat, long)

   # Return done
   return jsonify({
      "city": city,
      "water_hardness": LOCATION_TO_HARDNESS.get(city),
      "data": final_parsed,
   })


# Entrypoint
if __name__ == "__main__":
   app.run(port=3000)