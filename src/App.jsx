import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import { TripsProvider } from "./context/TripsContext";
import { WishlistProvider } from "./context/WishlistContext";
import MainLayout from "./router/MainLayout";
import ProtectedRoute from "./router/ProtectedRoutes";

// Pages
import Home from "./components/pages/Home";
import Trips from "./components/pages/Trips";
import TripDetails from "./components/pages/TripDetails";
import MyBookings from "./components/pages/MyBookings";
import Wishlist from "./components/pages/Wishlist";
import AddTrip from "./components/pages/AddTrip";
import Auth from "./components/forms/Auth";
import ErrorState from "./components/ui/Error";

import "./App.css";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <AuthContextProvider>
      <TripsProvider>
        <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Standalone Auth Page */}
              <Route path="/auth" element={<Auth />} />

              {/* Main Layout Pages */}
              <Route path="/" element={<MainLayout />}>
                {/* Landing / Home Page */}
                <Route index element={<Home />} />

                {/* All Trips List Page */}
                <Route path="trips" element={<Trips />} />

                {/* Trip Detail Page */}
                <Route path="trips/:id" element={<TripDetails />} />

                {/* Wishlist Page */}
                <Route path="wishlist" element={<Wishlist />} />

                {/* Admin Add Trip Pages */}
                <Route path="admin/add-trip" element={<AddTrip />} />
                <Route path="add-trip" element={<AddTrip />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="bookings" element={<MyBookings />} />
                </Route>

                {/* 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <ErrorState
                      title="404 - Page Not Found"
                      message="The horizon you are looking for has shifted beyond our map. Let's return to known territory."
                      backLink="/"
                      backLabel="Return to Basecamp"
                    />
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </TripsProvider>
    </AuthContextProvider>
  );
}

export default App;
