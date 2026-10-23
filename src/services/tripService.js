import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { trips as initialTrips } from "../data/trips";

const LOCAL_STORAGE_BOOKINGS_KEY = "tripverse_local_bookings";
const LOCAL_STORAGE_WISHLIST_KEY = "tripverse_local_wishlist";
const LOCAL_STORAGE_CUSTOM_TRIPS_KEY = "tripverse_custom_trips";

// Helper for local storage bookings
const getLocalBookings = (userId) => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return userId ? parsed.filter((b) => b.userId === userId) : parsed;
  } catch (e) {
    console.error("Local storage read error", e);
    return [];
  }
};

const saveLocalBooking = (booking) => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    parsed.unshift(booking);
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error("Local storage write error", e);
  }
};

const updateLocalBookingStatus = (bookingId, status) => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const updated = parsed.map((b) =>
      b.id === bookingId || b.bookingReference === bookingId
        ? { ...b, status }
        : b
    );
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Local storage update error", e);
  }
};

export const createBooking = async (bookingData) => {
  const reference = `TV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const payload = {
    ...bookingData,
    bookingReference: reference,
    status: "Confirmed",
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(collection(db, "bookings"), payload);
    const finalBooking = { id: docRef.id, ...payload };
    saveLocalBooking(finalBooking);
    return finalBooking;
  } catch (firestoreError) {
    console.warn("Firestore save failed, falling back to local storage:", firestoreError.message);
    const fallbackBooking = { id: `local_${Date.now()}`, ...payload };
    saveLocalBooking(fallbackBooking);
    return fallbackBooking;
  }
};

export const getUserBookings = async (userId) => {
  if (!userId) return [];
  const localList = getLocalBookings(userId);

  try {
    const q = query(collection(db, "bookings"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const firestoreList = [];
    querySnapshot.forEach((docSnap) => {
      firestoreList.push({ id: docSnap.id, ...docSnap.data() });
    });

    const map = new Map();
    [...firestoreList, ...localList].forEach((b) => {
      const key = b.bookingReference || b.id;
      if (!map.has(key)) {
        map.set(key, b);
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  } catch (err) {
    console.warn("Firestore fetch failed, returning cached bookings:", err.message);
    return localList;
  }
};

export const cancelBooking = async (bookingId) => {
  updateLocalBookingStatus(bookingId, "Cancelled");
  try {
    if (!bookingId.startsWith("local_")) {
      const bookingDocRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingDocRef, { status: "Cancelled" });
    }
    return true;
  } catch (err) {
    console.warn("Firestore cancellation update fallback:", err.message);
    return true;
  }
};

export const getLocalWishlist = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalWishlist = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save wishlist locally", e);
  }
};

// ==========================================
// Custom Admin Trips Persistence & Sync
// ==========================================

export const getLocalCustomTrips = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TRIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read custom trips from local storage", e);
    return [];
  }
};

export const saveLocalCustomTrip = (trip) => {
  try {
    const current = getLocalCustomTrips();
    const updated = [trip, ...current.filter((t) => t.id !== trip.id)];
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_TRIPS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save custom trip to local storage", e);
  }
};

export const createAdminTrip = async (tripData) => {
  const newTrip = {
    ...tripData,
    id: tripData.id || Date.now(),
    rating: Number(tripData.rating) || 5.0,
    reviewsCount: Number(tripData.reviewsCount) || 1,
    price: Number(tripData.price) || 50000,
    featured: Boolean(tripData.featured),
    createdAt: new Date().toISOString(),
  };

  saveLocalCustomTrip(newTrip);

  try {
    const docRef = await addDoc(collection(db, "trips"), newTrip);
    return { ...newTrip, firestoreId: docRef.id };
  } catch (err) {
    console.warn("Firestore trip creation fallback to local cache:", err.message);
    return newTrip;
  }
};

export const fetchAllTrips = async () => {
  const localCustom = getLocalCustomTrips();

  try {
    const querySnapshot = await getDocs(collection(db, "trips"));
    const firestoreTrips = [];
    querySnapshot.forEach((docSnap) => {
      firestoreTrips.push({ ...docSnap.data(), firestoreId: docSnap.id });
    });

    // Merge: firestore custom + local custom + base initialTrips
    const map = new Map();
    [...firestoreTrips, ...localCustom].forEach((trip) => {
      if (trip && trip.id) {
        map.set(Number(trip.id), trip);
      }
    });

    initialTrips.forEach((trip) => {
      if (!map.has(Number(trip.id))) {
        map.set(Number(trip.id), trip);
      }
    });

    return Array.from(map.values());
  } catch (err) {
    console.warn("Firestore trips fetch fallback:", err.message);
    const map = new Map();
    localCustom.forEach((t) => map.set(Number(t.id), t));
    initialTrips.forEach((t) => {
      if (!map.has(Number(t.id))) map.set(Number(t.id), t);
    });
    return Array.from(map.values());
  }
};
