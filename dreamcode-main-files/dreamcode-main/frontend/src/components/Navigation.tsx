import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Map, BarChart3, UserCircle, Bell } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Droplets className="h-8 w-8" />
            <span className="font-bold text-xl">WaterWatch</span>
          </Link>
          
          <div className="flex space-x-4 sm:space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-blue-200">
              <Map className="h-5 w-5" />
              <span className="hidden sm:inline">Map</span>
            </Link>
            <Link to="/dashboard" className="flex items-center space-x-1 hover:text-blue-200">
              <BarChart3 className="h-5 w-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/profile" className="flex items-center space-x-1 hover:text-blue-200">
              <UserCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button className="flex items-center space-x-1 hover:text-blue-200">
              <Bell className="h-5 w-5" />
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}