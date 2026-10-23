import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { createBooking } from "../../services/tripService";
import {
  IconCalendar,
  IconUsers,
  IconPlane,
  IconShield,
  IconSparkles,
} from "../ui/Icons";

const BookingForm = ({ show, onHide, trip, onBookingSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tomorrow as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split("T")[0];

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 14);
  const defaultDateStr = defaultDate.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    travelDate: defaultDateStr,
    adults: 2,
    children: 0,
    specialRequests: "",
    paymentMethod: "card",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.displayName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  if (!trip) return null;

  // Calculate pricing
  const basePricePerAdult = trip.price || 0;
  const childPrice = Math.round(basePricePerAdult * 0.7);
  const subtotal =
    formData.adults * basePricePerAdult + formData.children * childPrice;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + taxes;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "adults" || name === "children"
          ? Math.max(name === "adults" ? 1 : 0, parseInt(value) || 0)
          : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      // User must be logged in to book
      navigate("/auth", { state: { from: { pathname: `/trips/${trip.id}` } } });
      return;
    }

    if (!formData.fullName.trim()) {
      setError("Please enter the primary traveler's full name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please provide a contact email address.");
      return;
    }
    if (!formData.travelDate) {
      setError("Please select your preferred departure date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: user.uid,
        userName: formData.fullName.trim(),
        userEmail: formData.email.trim(),
        userPhone: formData.phone.trim(),
        tripId: trip.id,
        tripName: trip.name,
        tripDestination: trip.destination,
        tripImage: trip.image,
        tripDuration: trip.duration,
        tripCategory: trip.category,
        travelDate: formData.travelDate,
        adults: formData.adults,
        children: formData.children,
        specialRequests: formData.specialRequests.trim(),
        paymentMethod:
          formData.paymentMethod === "card"
            ? "Credit / Debit Card"
            : formData.paymentMethod === "upi"
            ? "Instant UPI"
            : "Pay at Destination Resort",
        baseFare: subtotal,
        taxes: taxes,
        totalPrice: grandTotal,
      };

      const result = await createBooking(payload);
      setLoading(false);
      onHide();
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    } catch (err) {
      console.error("Booking submission error", err);
      setError("We encountered an error processing your reservation. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="tripverse-modal booking-modal"
    >
      <Modal.Header closeButton closeVariant="white" className="border-secondary border-opacity-25 pb-3">
        <Modal.Title className="text-white d-flex align-items-center gap-2 fs-5">
          <IconPlane size={20} className="text-cyan-glow" />
          <span>Reserve Expedition: <strong className="text-info">{trip.name}</strong></span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Selected Trip mini banner */}
        <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-dark bg-opacity-60 border border-secondary border-opacity-25 mb-4">
          <img
            src={trip.image}
            alt={trip.name}
            className="rounded-3 object-fit-cover"
            style={{ width: "80px", height: "65px" }}
          />
          <div className="flex-grow-1 min-w-0">
            <h6 className="text-white mb-1 text-truncate">{trip.name}</h6>
            <div className="text-secondary small text-truncate">{trip.destination} &bull; {trip.duration}</div>
          </div>
          <div className="text-end">
            <div className="text-cyan-glow fw-bold fs-6">₹{trip.price?.toLocaleString("en-IN")}</div>
            <div className="text-secondary extra-small">/ adult</div>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="bg-danger bg-opacity-15 border border-danger border-opacity-30 text-danger-emphasis small py-2 mb-3">
            {error}
          </Alert>
        )}

        {!user && (
          <Alert variant="warning" className="bg-warning bg-opacity-15 border border-warning border-opacity-30 text-warning-emphasis small py-2 mb-3">
            You will be asked to sign in to confirm and sync this booking to your account.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3 mb-3">
            {/* Travel Date */}
            <Col md={6}>
              <Form.Group controlId="travelDate">
                <Form.Label className="text-light small fw-medium d-flex align-items-center gap-1">
                  <IconCalendar size={14} className="text-info" />
                  Departure Date
                </Form.Label>
                <Form.Control
                  type="date"
                  name="travelDate"
                  min={minDateStr}
                  value={formData.travelDate}
                  onChange={handleChange}
                  required
                  className="input-custom rounded-3 text-white"
                />
              </Form.Group>
            </Col>

            {/* Adults & Children */}
            <Col md={3} xs={6}>
              <Form.Group controlId="adults">
                <Form.Label className="text-light small fw-medium d-flex align-items-center gap-1">
                  <IconUsers size={14} className="text-info" />
                  Adults (12+)
                </Form.Label>
                <Form.Select
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  className="input-custom rounded-3 text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n} className="bg-dark text-white">
                      {n} Adult{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3} xs={6}>
              <Form.Group controlId="children">
                <Form.Label className="text-light small fw-medium d-flex align-items-center gap-1">
                  <IconUsers size={14} className="text-info" />
                  Children (30% off)
                </Form.Label>
                <Form.Select
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  className="input-custom rounded-3 text-white"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n} className="bg-dark text-white">
                      {n} {n === 1 ? "Child" : "Children"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Traveler Details */}
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Group controlId="fullName">
                <Form.Label className="text-light small fw-medium">Primary Traveler Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Alex Henderson"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="input-custom rounded-3 text-white"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label className="text-light small fw-medium">Confirmation Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="alex@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-custom rounded-3 text-white"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="phone">
                <Form.Label className="text-light small fw-medium">Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="+91 98765 43210"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-custom rounded-3 text-white"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="paymentMethod">
                <Form.Label className="text-light small fw-medium">Payment Preference</Form.Label>
                <Form.Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="input-custom rounded-3 text-white"
                >
                  <option value="card" className="bg-dark text-white">Credit / Debit Card (Secure 256-bit)</option>
                  <option value="upi" className="bg-dark text-white">Instant UPI / QR Code</option>
                  <option value="arrival" className="bg-dark text-white">Pay on Arrival at Destination</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Special Requests */}
          <Form.Group className="mb-4" controlId="specialRequests">
            <Form.Label className="text-light small fw-medium">
              Special Preferences (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="e.g. Vegetarian meal, Honeymoon anniversary setup, Airport pickup time..."
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="input-custom rounded-3 text-white"
            />
          </Form.Group>

          {/* Price Breakdown Box */}
          <div className="bg-dark bg-opacity-75 border border-secondary border-opacity-30 rounded-4 p-3 mb-4">
            <div className="d-flex justify-content-between text-secondary small mb-1">
              <span>
                Adult Fare ({formData.adults} × ₹{basePricePerAdult.toLocaleString("en-IN")})
              </span>
              <span>₹{(formData.adults * basePricePerAdult).toLocaleString("en-IN")}</span>
            </div>

            {formData.children > 0 && (
              <div className="d-flex justify-content-between text-secondary small mb-1">
                <span>
                  Child Fare ({formData.children} × ₹{childPrice.toLocaleString("en-IN")})
                </span>
                <span>₹{(formData.children * childPrice).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="d-flex justify-content-between text-secondary small mb-2">
              <span>Govt. Tourism Taxes & Environmental Surcharge (5%)</span>
              <span>₹{taxes.toLocaleString("en-IN")}</span>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
              <span className="text-white fw-bold">Total Expedition Price</span>
              <span className="text-cyan-glow fw-bold fs-4">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={onHide}
              disabled={loading}
              className="rounded-pill px-4 text-light border-opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="btn-gradient rounded-pill px-5 py-2 fw-semibold d-flex align-items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>Securing Reservation...</span>
                </>
              ) : (
                <>
                  <IconSparkles size={16} />
                  <span>Confirm & Lock In</span>
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingForm;
