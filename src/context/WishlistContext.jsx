import React, { createContext, useContext, useState, useEffect } from "react";
import useAuth from "./useAuth";
import { getLocalWishlist, saveLocalWishlist } from "../services/tripService";
import { useTrips } from "./TripsContext";

const WishlistContext = createContext({
  wishlistIds: [],
  wishlistTrips: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
  wishlistCount: 0,
});

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { trips } = useTrips();
  const [wishlistIds, setWishlistIds] = useState(() => getLocalWishlist());

  useEffect(() => {
    saveLocalWishlist(wishlistIds);
  }, [wishlistIds]);

  const toggleWishlist = (tripOrId) => {
    const id = typeof tripOrId === "object" ? tripOrId.id : tripOrId;
    setWishlistIds((prev) => {
      const numId = Number(id);
      if (prev.includes(numId)) {
        return prev.filter((item) => item !== numId);
      } else {
        return [...prev, numId];
      }
    });
  };

  const isInWishlist = (id) => wishlistIds.includes(Number(id));

  const wishlistTrips = trips.filter((t) => wishlistIds.includes(Number(t.id)));

  const value = {
    wishlistIds,
    wishlistTrips,
    toggleWishlist,
    isInWishlist,
    wishlistCount: wishlistIds.length,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistContext;
