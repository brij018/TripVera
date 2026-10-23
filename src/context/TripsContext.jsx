import React, { createContext, useContext, useState, useEffect } from "react";
import { trips as baseTrips, CATEGORIES } from "../data/trips";
import {
  fetchAllTrips,
  createAdminTrip,
  getLocalCustomTrips,
} from "../services/tripService";

const TripsContext = createContext({
  trips: baseTrips,
  categories: CATEGORIES,
  loading: false,
  addTrip: async () => {},
  getTripById: () => null,
});

export const TripsProvider = ({ children }) => {
  // Initialize with baseTrips + any locally saved custom trips for instant rendering
  const [trips, setTrips] = useState(() => {
    const local = getLocalCustomTrips();
    const map = new Map();
    local.forEach((t) => map.set(Number(t.id), t));
    baseTrips.forEach((t) => {
      if (!map.has(Number(t.id))) map.set(Number(t.id), t);
    });
    return Array.from(map.values());
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSync = async () => {
      try {
        const merged = await fetchAllTrips();
        setTrips(merged);
      } catch (e) {
        console.warn("Could not sync remote trips", e);
      }
    };
    loadSync();
  }, []);

  const addTrip = async (newTripData) => {
    setLoading(true);
    try {
      const saved = await createAdminTrip(newTripData);
      setTrips((prev) => [saved, ...prev.filter((t) => t.id !== saved.id)]);
      return saved;
    } finally {
      setLoading(false);
    }
  };

  const getTripById = (id) => {
    if (!id) return null;
    return (
      trips.find(
        (t) =>
          Number(t.id) === Number(id) ||
          String(t.id) === String(id) ||
          t.firestoreId === id
      ) || null
    );
  };

  const value = {
    trips,
    categories: CATEGORIES,
    loading,
    addTrip,
    getTripById,
  };

  return (
    <TripsContext.Provider value={value}>{children}</TripsContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error("useTrips must be used within a TripsProvider");
  }
  return context;
};

export default TripsContext;
