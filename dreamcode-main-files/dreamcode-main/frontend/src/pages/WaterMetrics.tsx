import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';



export default function WaterMetrics() {
  import React, { useState, useEffect } from 'react';

const WaterQuality = () => {
  // State for holding data, loading, and error information
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// State variables for storing latitude and longitude
const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);

// Function to handle the geolocation fetch
const getGeolocation = () => {
  if (navigator.geolocation) {
    // Request the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // On success, update the state with latitude and longitude
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => {
        // On error, update the state with the error message
        setError(`Error: ${err.message}`);
      }
    );
  } else {
    setError("Geolocation is not supported by this browser.");
  }
};
  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    // Define the fetch function
    const fetchWaterQuality = async () => {
      try {
        // Start loading
        setLoading(true);

        // Fetch the data from the API
        const response = await fetch(`http://localhost:3000/water_quality?lat=${latitude}&long=${longitude}`);

        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        // Parse the JSON data
        const result = await response.json();
        const city = result["city"]
        const first_value = result["data"][0]
        first_value["city"] = city
        first_value["Dissolved Oxygen"] = first_value["DISSOLVED OXYGEN (mg/L)"]
        delete first_value["DISSOLVED OXYGEN (mg/L)"]
        first_value["Dissolved Oxygen %"] = first_value[""]
        delete first_value[""]
        first_value[""] = first_value[]




        // Set the data in state
        setData(result);
      } catch (error) {
        // Handle any errors
        setError(error.message);
      } finally {
        // End loading state
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchWaterQuality();
  }, []); // Empty dependency array means this runs only once when the component mounts





  const metrics = [
    { name: 'pH Level', value: '7.2', unit: 'pH', description: 'Measure of water acidity' },
    { name: 'Dissolved Oxygen', value: '8.5', unit: 'mg/L', description: 'Amount of oxygen in water' },
    { name: 'Turbidity', value: '2.4', unit: 'NTU', description: 'Water clarity measurement' },
    { name: 'Nitrate', value: '0.8', unit: 'mg/L', description: 'Nitrogen concentration' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Overview
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Detailed Water Metrics</h1>
        
        <div className="space-y-6">
          {metrics.map((metric) => (
            <div 
              key={metric.name}
              className="bg-white rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{metric.name}</h2>
                  <p className="text-gray-600 mt-1">{metric.description}</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {metric.value}
                  <span className="text-sm ml-1 text-gray-500">{metric.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}