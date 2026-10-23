import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  IconHeart,
  IconMapPin,
  IconClock,
  IconStar,
  IconArrowRight,
} from "./Icons";
import { useWishlist } from "../../context/WishlistContext";

const TripCard = ({ trip, onQuickBook = null }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorited = isInWishlist(trip.id);

  const getDifficultyBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return <Badge bg="success" className="bg-opacity-25 text-success border border-success border-opacity-30">Easy</Badge>;
      case "moderate":
        return <Badge bg="warning" className="bg-opacity-25 text-warning border border-warning border-opacity-30">Moderate</Badge>;
      case "challenging":
      case "hard":
        return <Badge bg="danger" className="bg-opacity-25 text-danger border border-danger border-opacity-30">Challenging</Badge>;
      default:
        return <Badge bg="secondary" className="bg-opacity-25 text-secondary">{diff}</Badge>;
    }
  };

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(trip);
  };

  return (
    <Card className="trip-card h-100 border-0 rounded-4 overflow-hidden position-relative">
      {/* Top Image & Wishlist Button */}
      <div className="trip-card-image-wrap position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={trip.image}
          alt={trip.name}
          className="trip-card-img"
          loading="lazy"
        />
        <div className="trip-card-overlay" />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className={`btn-wishlist position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center ${
            isFavorited ? "active" : ""
          }`}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <IconHeart size={18} filled={isFavorited} className={isFavorited ? "text-danger" : "text-white"} />
        </button>

        {/* Category & Difficulty Badges on Image */}
        <div className="position-absolute bottom-0 start-0 m-3 d-flex flex-wrap gap-2 align-items-center">
          <Badge bg="info" className="bg-opacity-90 text-dark fw-bold rounded-pill px-3 py-1">
            {trip.category}
          </Badge>
          {getDifficultyBadge(trip.difficulty)}
        </div>
      </div>

      {/* Card Body */}
      <Card.Body className="d-flex flex-column p-4">
        {/* Destination & Duration */}
        <div className="d-flex justify-content-between align-items-center text-secondary small mb-2">
          <span className="d-inline-flex align-items-center gap-1 text-truncate">
            <IconMapPin size={14} className="text-info flex-shrink-0" />
            <span className="text-truncate">{trip.destination}</span>
          </span>
          <span className="d-inline-flex align-items-center gap-1 flex-shrink-0 ms-2">
            <IconClock size={14} className="text-info" />
            <span>{trip.duration}</span>
          </span>
        </div>

        {/* Title */}
        <Card.Title as="h5" className="trip-card-title text-white fw-bold mb-2">
          <Link to={`/trips/${trip.id}`} className="text-decoration-none text-white stretched-link-title">
            {trip.name}
          </Link>
        </Card.Title>

        {/* Overview snippet */}
        <p className="text-secondary small trip-card-overview mb-3 flex-grow-1">
          {trip.overview}
        </p>

        {/* Rating and Price Row */}
        <div className="d-flex justify-content-between align-items-end pt-3 mt-auto border-top border-secondary border-opacity-25">
          <div>
            <div className="d-flex align-items-center gap-1 text-warning mb-1">
              <IconStar size={15} fill="#f59e0b" />
              <span className="fw-bold text-white fs-6">{trip.rating}</span>
              <span className="text-secondary small">({trip.reviewsCount})</span>
            </div>
            <div className="text-secondary extra-small">Per person</div>
          </div>

          <div className="text-end">
            <div className="trip-price fw-bold text-cyan-glow fs-5">
              ₹{(trip.price || 0).toLocaleString("en-IN")}
            </div>
            <Link
              to={`/trips/${trip.id}`}
              className="btn btn-sm btn-outline-cyan rounded-pill px-3 py-1 mt-1 d-inline-flex align-items-center gap-1"
            >
              Details <IconArrowRight size={13} />
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TripCard;
