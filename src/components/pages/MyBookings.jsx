import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { getUserBookings, cancelBooking } from "../../services/tripService";
import Loading from "../ui/Loading";
import { ConfirmActionModal } from "../ui/Confirmation";
import {
  IconCalendar,
  IconUsers,
  IconTicket,
  IconTrash,
  IconPlane,
  IconCheckCircle,
  IconArrowRight,
  IconClock,
} from "../ui/Icons";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Cancellation modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const loadBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserBookings(user.uid);
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleCancelClick = (booking) => {
    setCancelTarget(booking);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      await cancelBooking(cancelTarget.id || cancelTarget.bookingReference);
      setActionMessage(`Reservation ${cancelTarget.bookingReference} has been cancelled.`);
      setCancelTarget(null);
      await loadBookings();
    } catch (err) {
      console.error("Cancellation error", err);
    } finally {
      setCancelLoading(false);
      setTimeout(() => setActionMessage(""), 6000);
    }
  };

  const handlePrint = (booking) => {
    window.print();
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "confirmed") return b.status?.toLowerCase() === "confirmed";
    if (activeTab === "cancelled") return b.status?.toLowerCase() === "cancelled";
    return true;
  });

  if (loading) {
    return <Loading message="Retrieving your voyage itineraries..." />;
  }

  return (
    <div className="my-bookings-page py-5">
      <Container>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-subtle border border-info border-opacity-30 mb-2">
              <IconTicket size={14} className="text-cyan-glow" />
              <span className="text-info fw-semibold extra-small letter-spacing-1 text-uppercase">
                Traveler Passport
              </span>
            </div>
            <h1 className="fw-extrabold text-white mb-1">My Reserved Journeys</h1>
            <p className="text-secondary small mb-0">
              Manage your upcoming adventures, vouchers, and itinerary confirmations.
            </p>
          </div>

          <Link
            to="/trips"
            className="btn btn-outline-cyan rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
          >
            <span>Book Another Journey</span>
            <IconArrowRight size={14} />
          </Link>
        </div>

        {/* Action message */}
        {actionMessage && (
          <Alert variant="info" className="bg-info bg-opacity-15 border border-info border-opacity-30 text-info py-2 rounded-3 mb-4">
            {actionMessage}
          </Alert>
        )}

        {/* Filter Tabs */}
        {bookings.length > 0 && (
          <div className="d-flex gap-2 mb-4 p-1 rounded-pill bg-dark bg-opacity-60 border border-secondary border-opacity-25 max-w-400">
            {["all", "confirmed", "cancelled"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`auth-tab-btn flex-fill py-1 px-3 rounded-pill border-0 text-capitalize small fw-semibold ${
                  activeTab === tab ? "active-tab text-white" : "text-secondary"
                }`}
              >
                {tab} ({bookings.filter((b) => (tab === "all" ? true : b.status?.toLowerCase() === tab)).length})
              </button>
            ))}
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="d-flex flex-column gap-4">
            {filteredBookings.map((b) => {
              const isCancelled = b.status?.toLowerCase() === "cancelled";
              return (
                <Card key={b.id || b.bookingReference} className="glass-card border-0 rounded-4 overflow-hidden shadow-lg">
                  <Card.Body className="p-4">
                    <Row className="gy-3 align-items-center">
                      {/* Image Thumbnail */}
                      <Col md={3} sm={4}>
                        <div className="rounded-4 overflow-hidden position-relative" style={{ height: "140px" }}>
                          <img
                            src={b.tripImage}
                            alt={b.tripName}
                            className="w-100 h-100 object-fit-cover"
                          />
                          <Badge
                            bg={isCancelled ? "danger" : "success"}
                            className="position-absolute top-0 start-0 m-2 rounded-pill px-3 py-1"
                          >
                            {b.status || "Confirmed"}
                          </Badge>
                        </div>
                      </Col>

                      {/* Details */}
                      <Col md={6} sm={8}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="badge bg-secondary bg-opacity-30 text-light font-monospace small">
                            REF: {b.bookingReference || "TV-EXP2026"}
                          </span>
                          <span className="text-secondary extra-small">
                            Booked on {new Date(b.createdAt || Date.now()).toLocaleDateString("en-IN")}
                          </span>
                        </div>

                        <h4 className="text-white fw-bold mb-2">
                          <Link to={`/trips/${b.tripId}`} className="text-white text-decoration-none hover-cyan">
                            {b.tripName}
                          </Link>
                        </h4>

                        <div className="row g-2 text-secondary small mb-3">
                          <div className="col-sm-6 d-flex align-items-center gap-1">
                            <IconCalendar size={14} className="text-info" />
                            <span>Departure: <strong className="text-light">{b.travelDate}</strong></span>
                          </div>
                          <div className="col-sm-6 d-flex align-items-center gap-1">
                            <IconUsers size={14} className="text-info" />
                            <span>
                              {b.adults || 1} Adult{b.adults > 1 ? "s" : ""}{" "}
                              {b.children ? `& ${b.children} Child` : ""}
                            </span>
                          </div>
                          <div className="col-sm-6 d-flex align-items-center gap-1">
                            <IconTicket size={14} className="text-info" />
                            <span>Payment: <strong className="text-light">{b.paymentMethod || "Card"}</strong></span>
                          </div>
                          <div className="col-sm-6 d-flex align-items-center gap-1">
                            <IconClock size={14} className="text-info" />
                            <span>Duration: <strong className="text-light">{b.tripDuration || "Multi-day"}</strong></span>
                          </div>
                        </div>

                        {b.specialRequests && (
                          <div className="p-2 rounded-3 bg-dark bg-opacity-50 text-secondary extra-small">
                            <strong>Note:</strong> {b.specialRequests}
                          </div>
                        )}
                      </Col>

                      {/* Price and Actions */}
                      <Col md={3} className="text-md-end border-top border-md-top-0 border-secondary border-opacity-25 pt-3 pt-md-0">
                        <div className="text-secondary extra-small">Total Paid</div>
                        <div className="trip-price fw-bold text-cyan-glow fs-3 mb-3">
                          ₹{(b.totalPrice || 0).toLocaleString("en-IN")}
                        </div>

                        <div className="d-flex flex-column gap-2 justify-content-end">
                          <Button
                            as={Link}
                            to={`/trips/${b.tripId}`}
                            variant="outline-info"
                            size="sm"
                            className="rounded-pill px-3 py-1"
                          >
                            Expedition Details
                          </Button>

                          {!isCancelled && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancelClick(b)}
                              className="rounded-pill px-3 py-1 d-inline-flex align-items-center justify-content-center gap-1"
                            >
                              <IconTrash size={13} />
                              <span>Cancel Booking</span>
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <Card className="glass-card text-center p-5 rounded-5 border-0 my-5">
            <div className="mb-3">
              <div className="d-inline-flex p-3 rounded-circle bg-info bg-opacity-10 text-cyan-glow">
                <IconPlane size={44} />
              </div>
            </div>
            <h3 className="fw-bold text-white mb-2">No Bookings Yet</h3>
            <p className="text-secondary small max-w-500 mx-auto mb-4">
              Your travel history is completely open. Pick a dream destination from our handcrafted catalog and stamp your passport!
            </p>
            <div>
              <Button
                as={Link}
                to="/trips"
                className="btn-gradient rounded-pill px-5 py-3 fw-semibold shadow-lg d-inline-flex align-items-center gap-2"
              >
                <span>Discover Expeditions</span>
                <IconArrowRight size={16} />
              </Button>
            </div>
          </Card>
        )}
      </Container>

      {/* Cancellation Confirmation Modal */}
      <ConfirmActionModal
        show={Boolean(cancelTarget)}
        onHide={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel This Expedition?"
        message={`Are you sure you want to cancel booking ${cancelTarget?.bookingReference}? In accordance with our flexible guarantee, your refund will be processed back to the original payment source within 3 business days.`}
        confirmLabel="Yes, Cancel Booking"
        confirmVariant="danger"
        loading={cancelLoading}
      />
    </div>
  );
};

export default MyBookings;
