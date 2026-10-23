import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Accordion } from "react-bootstrap";
import { useTrips } from "../../context/TripsContext";
import TripCard from "../ui/TripCard";
import BookingForm from "../forms/BookingForm";
import { BookingConfirmationModal } from "../ui/Confirmation";
import ErrorState from "../ui/Error";
import { useWishlist } from "../../context/WishlistContext";
import useAuth from "../../context/useAuth";
import {
  IconMapPin,
  IconClock,
  IconStar,
  IconHeart,
  IconCheck,
  IconX,
  IconShield,
  IconCalendar,
  IconSparkles,
  IconArrowLeft,
  IconPlane,
} from "../ui/Icons";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { getTripById, trips } = useTrips();

  const trip = getTripById(id);

  const [activeImage, setActiveImage] = useState(trip?.image || "");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!trip) {
    return (
      <ErrorState
        title="Expedition Not Found"
        message="The journey you are looking for does not exist or may have been archived."
        backLink="/trips"
        backLabel="Browse All Journeys"
      />
    );
  }

  const isFavorited = isInWishlist(trip.id);
  const allImages = [trip.image, ...(trip.gallery || [])].filter(
    (img, index, self) => self.indexOf(img) === index
  );

  const relatedTrips = trips
    .filter((t) => t.id !== trip.id && (t.category === trip.category || t.featured))
    .slice(0, 3);

  const handleBookingSuccess = (booking) => {
    setConfirmedBooking(booking);
    setShowConfirmModal(true);
  };

  const handleBookNowClick = () => {
    if (!user) {
      navigate("/auth", { state: { from: { pathname: `/trips/${trip.id}` } } });
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <div className="trip-details-page py-4 py-lg-5">
      <Container>
        {/* Breadcrumb / Back Link */}
        <div className="mb-4">
          <Link
            to="/trips"
            className="text-secondary small text-decoration-none d-inline-flex align-items-center gap-2 hover-cyan"
          >
            <IconArrowLeft size={16} />
            <span>Back to All Expeditions</span>
          </Link>
        </div>

        {/* Title & Header Row */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
              <Badge bg="info" className="bg-opacity-20 text-info border border-info border-opacity-30 rounded-pill px-3 py-1">
                {trip.category}
              </Badge>
              <Badge bg="secondary" className="bg-opacity-25 text-light border border-secondary border-opacity-30 rounded-pill px-3 py-1">
                {trip.difficulty} Difficulty
              </Badge>
              {trip.featured && (
                <Badge bg="warning" className="bg-opacity-20 text-warning border border-warning border-opacity-30 rounded-pill px-3 py-1">
                  ⭐ Featured
                </Badge>
              )}
            </div>
            <h1 className="fw-extrabold text-white mb-2">{trip.name}</h1>
            <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small">
              <span className="d-flex align-items-center gap-1">
                <IconMapPin size={15} className="text-info" />
                <strong className="text-light">{trip.destination}</strong> ({trip.country})
              </span>
              <span>&bull;</span>
              <span className="d-flex align-items-center gap-1">
                <IconClock size={15} className="text-info" />
                <span>{trip.duration}</span>
              </span>
              <span>&bull;</span>
              <span className="d-flex align-items-center gap-1 text-warning">
                <IconStar size={15} fill="#f59e0b" />
                <strong className="text-white">{trip.rating}</strong>
                <span>({trip.reviewsCount} reviews)</span>
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => toggleWishlist(trip)}
              className={`rounded-circle p-2 border-secondary border-opacity-30 ${
                isFavorited ? "text-danger active-wishlist-btn" : "text-light"
              }`}
              aria-label="Toggle Wishlist"
            >
              <IconHeart size={20} filled={isFavorited} />
            </Button>
            <Button
              onClick={handleBookNowClick}
              className="btn-gradient rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
            >
              <IconPlane size={16} />
              <span>Book Journey</span>
            </Button>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="mb-5">
          {/* Main Showcase Image */}
          <div className="details-hero-image-wrap rounded-5 overflow-hidden shadow-2xl position-relative mb-3 border border-secondary border-opacity-25">
            <img
              src={activeImage || trip.image}
              alt={trip.name}
              className="w-100 object-fit-cover details-hero-image"
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="d-flex gap-2 overflow-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`thumbnail-btn p-0 rounded-4 overflow-hidden border-2 flex-shrink-0 ${
                    (activeImage || trip.image) === img
                      ? "border-info"
                      : "border-transparent opacity-75"
                  }`}
                  style={{ width: "100px", height: "70px" }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-100 h-100 object-fit-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MAIN DETAILS GRID */}
        <Row className="gy-4">
          {/* Left Column: Itinerary, Highlights, Details */}
          <Col lg={8}>
            {/* Overview */}
            <Card className="glass-card border-0 rounded-4 p-4 mb-4 shadow-sm">
              <h4 className="fw-bold text-white mb-3">Expedition Overview</h4>
              <p className="text-secondary leading-relaxed mb-4 fs-6">
                {trip.overview}
              </p>

              {trip.bestTimeToVisit && (
                <div className="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-25 d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-info bg-opacity-15 text-cyan-glow">
                    <IconCalendar size={20} />
                  </div>
                  <div>
                    <div className="text-secondary extra-small text-uppercase fw-semibold">
                      Prime Travel Season
                    </div>
                    <div className="text-white fw-bold small">
                      {trip.bestTimeToVisit}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Highlights */}
            {trip.highlights?.length > 0 && (
              <Card className="glass-card border-0 rounded-4 p-4 mb-4 shadow-sm">
                <h4 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <IconSparkles size={20} className="text-cyan-glow" />
                  <span>Curated Highlights</span>
                </h4>
                <Row className="g-3">
                  {trip.highlights.map((highlight, index) => (
                    <Col sm={6} key={index}>
                      <div className="d-flex align-items-start gap-2 p-2 rounded-3 hover-surface">
                        <div className="p-1 rounded-circle bg-success bg-opacity-20 text-success flex-shrink-0 mt-1">
                          <IconCheck size={12} />
                        </div>
                        <span className="text-light-subtle small fw-medium">{highlight}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* Day-by-Day Itinerary */}
            {trip.itinerary?.length > 0 && (
              <Card className="glass-card border-0 rounded-4 p-4 mb-4 shadow-sm">
                <h4 className="fw-bold text-white mb-3">Day-by-Day Itinerary</h4>
                <Accordion defaultActiveKey="0" flush className="itinerary-accordion">
                  {trip.itinerary.map((item, index) => (
                    <Accordion.Item
                      eventKey={String(index)}
                      key={index}
                      className="bg-transparent border-bottom border-secondary border-opacity-25 py-2"
                    >
                      <Accordion.Header className="custom-accordion-header">
                        <div className="d-flex align-items-center gap-3 w-100 pe-3">
                          <span className="badge bg-info bg-opacity-20 text-info rounded-pill px-3 py-1 font-monospace">
                            Day {item.day}
                          </span>
                          <span className="fw-bold text-white fs-6">{item.title}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="text-secondary small pt-2 ps-5 ms-3">
                        {item.description}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card>
            )}

            {/* Inclusions & Exclusions */}
            <Card className="glass-card border-0 rounded-4 p-4 mb-4 shadow-sm">
              <h4 className="fw-bold text-white mb-3">Inclusions & Logistics</h4>
              <Row className="g-4">
                {/* Inclusions */}
                <Col sm={6}>
                  <h6 className="text-success fw-bold mb-3 d-flex align-items-center gap-1">
                    <IconCheck size={16} /> What’s Included
                  </h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    {trip.inclusions?.map((inc, i) => (
                      <li key={i} className="small text-secondary d-flex align-items-center gap-2">
                        <span className="text-success">&bull;</span> {inc}
                      </li>
                    ))}
                  </ul>
                </Col>

                {/* Exclusions */}
                <Col sm={6}>
                  <h6 className="text-danger-emphasis fw-bold mb-3 d-flex align-items-center gap-1">
                    <IconX size={16} /> Not Included
                  </h6>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                    {trip.exclusions?.map((exc, i) => (
                      <li key={i} className="small text-secondary d-flex align-items-center gap-2">
                        <span className="text-danger">&bull;</span> {exc}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column: Floating Booking Card */}
          <Col lg={4}>
            <div className="sticky-booking-card position-sticky" style={{ top: "100px" }}>
              <Card className="glass-card border-0 rounded-4 p-4 shadow-2xl">
                <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                  <div>
                    <div className="text-secondary extra-small">Total Expedition Fare</div>
                    <div className="trip-price fw-bold text-cyan-glow fs-2">
                      ₹{(trip.price || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="text-secondary extra-small">per person &bull; all taxes included</div>
                  </div>
                  <div className="text-end">
                    <div className="d-flex align-items-center gap-1 text-warning">
                      <IconStar size={16} fill="#f59e0b" />
                      <span className="fw-bold text-white fs-6">{trip.rating}</span>
                    </div>
                    <div className="text-secondary extra-small">{trip.reviewsCount} reviews</div>
                  </div>
                </div>

                {/* Quick specs */}
                <div className="d-flex flex-column gap-2 mb-4 text-secondary small">
                  <div className="d-flex justify-content-between">
                    <span>Duration:</span>
                    <strong className="text-white">{trip.duration}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Destination:</span>
                    <strong className="text-white">{trip.destination}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Category:</span>
                    <strong className="text-white">{trip.category}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Group Size:</span>
                    <strong className="text-white">Max 10 Travelers</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Cancellation:</span>
                    <strong className="text-success">Free up to 7 days</strong>
                  </div>
                </div>

                {/* Action CTA */}
                <Button
                  onClick={handleBookNowClick}
                  className="btn-gradient w-100 rounded-pill py-3 fw-bold fs-6 mb-2 d-flex align-items-center justify-content-center gap-2 shadow-lg"
                >
                  <IconPlane size={18} />
                  <span>Reserve This Trip</span>
                </Button>

                <Button
                  variant="outline-secondary"
                  onClick={() => toggleWishlist(trip)}
                  className={`w-100 rounded-pill py-2 border-secondary border-opacity-40 d-flex align-items-center justify-content-center gap-2 ${
                    isFavorited ? "text-danger" : "text-light"
                  }`}
                >
                  <IconHeart size={16} filled={isFavorited} />
                  <span>{isFavorited ? "Saved in Wishlist" : "Save to Wishlist"}</span>
                </Button>

                {/* Guarantee */}
                <div className="mt-4 pt-3 border-top border-secondary border-opacity-20 text-center">
                  <div className="d-inline-flex align-items-center gap-2 text-secondary extra-small">
                    <IconShield size={14} className="text-success" />
                    <span>Secure 256-bit checkout &bull; Instant Confirmation</span>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        {/* RELATED EXPEDITIONS */}
        {relatedTrips.length > 0 && (
          <div className="mt-5 pt-4 border-top border-secondary border-opacity-20">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold text-white mb-1">You Might Also Love</h3>
                <p className="text-secondary small mb-0">Similar journeys you can add to your passport.</p>
              </div>
              <Link to="/trips" className="btn btn-outline-cyan rounded-pill px-4 py-2 small">
                Explore All
              </Link>
            </div>

            <Row className="g-4">
              {relatedTrips.map((relTrip) => (
                <Col key={relTrip.id} lg={4} md={6} sm={12}>
                  <TripCard trip={relTrip} />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>

      {/* Booking Form Modal */}
      <BookingForm
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        trip={trip}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Booking Confirmation Dialog */}
      <BookingConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        booking={confirmedBooking}
      />
    </div>
  );
};

export default TripDetails;
