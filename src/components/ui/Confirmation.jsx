import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  IconCheckCircle,
  IconCalendar,
  IconUsers,
  IconTicket,
  IconPlane,
  IconAlertCircle,
} from "./Icons";

export const BookingConfirmationModal = ({ show, onHide, booking }) => {
  if (!booking) return null;

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="tripverse-modal">
      <Modal.Body className="glass-card-modal text-center p-4 p-md-5">
        <div className="mb-3">
          <div
            className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-20 text-success border border-success border-opacity-30"
            style={{ boxShadow: "0 0 35px rgba(16, 185, 129, 0.3)" }}
          >
            <IconCheckCircle size={44} />
          </div>
        </div>

        <Badge bg="success" className="bg-opacity-25 text-success border border-success border-opacity-30 px-3 py-1 mb-2 rounded-pill">
          Booking Confirmed
        </Badge>

        <h3 className="fw-bold text-white mt-1 mb-2">Pack Your Bags!</h3>
        <p className="text-secondary small mb-4">
          Your reservation has been confirmed and locked in. We have sent the itinerary and verification vouchers to your email.
        </p>

        <div className="bg-dark bg-opacity-60 border border-secondary border-opacity-25 rounded-4 p-3 text-start mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-secondary border-opacity-25">
            <span className="text-secondary small">Booking Reference</span>
            <span className="badge bg-info bg-opacity-20 text-info font-monospace letter-spacing-1">
              {booking.bookingReference || "TV-EXP2026"}
            </span>
          </div>

          <div className="fw-semibold text-white mb-2 fs-6 d-flex align-items-center gap-2">
            <IconPlane size={16} className="text-info" />
            {booking.tripName}
          </div>

          <div className="row g-2 small text-secondary mt-1">
            <div className="col-6 d-flex align-items-center gap-1">
              <IconCalendar size={14} className="text-info" />
              <span>{booking.travelDate || "Flexible date"}</span>
            </div>
            <div className="col-6 d-flex align-items-center gap-1">
              <IconUsers size={14} className="text-info" />
              <span>
                {booking.adults || 1} Adult{booking.adults > 1 ? "s" : ""}{" "}
                {booking.children ? `+ ${booking.children} Child` : ""}
              </span>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary border-opacity-25">
            <span className="text-secondary small">Total Paid</span>
            <span className="fw-bold text-success fs-5">
              ₹{(booking.totalPrice || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
          <Button
            as={Link}
            to="/bookings"
            onClick={onHide}
            variant="primary"
            className="btn-gradient rounded-pill px-4 py-2"
          >
            <IconTicket size={16} className="me-2" />
            Go to My Bookings
          </Button>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="rounded-pill px-4 py-2 border-opacity-50 text-light"
          >
            Done
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export const ConfirmActionModal = ({
  show,
  onHide,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  confirmVariant = "danger",
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered className="tripverse-modal">
      <Modal.Body className="glass-card-modal p-4 text-center">
        <div className="mb-3">
          <div
            className={`d-inline-flex p-3 rounded-circle bg-${confirmVariant} bg-opacity-20 text-${confirmVariant} border border-${confirmVariant} border-opacity-30`}
          >
            <IconAlertCircle size={32} />
          </div>
        </div>
        <h4 className="fw-bold text-white mb-2">{title}</h4>
        <p className="text-secondary small mb-4">{message}</p>
        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            disabled={loading}
            className="rounded-pill px-4 py-2 text-light"
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
            className="rounded-pill px-4 py-2"
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BookingConfirmationModal;
