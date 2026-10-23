import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IconAlertCircle, IconArrowLeft } from "./Icons";

const ErrorState = ({
  title = "Journey Interrupted",
  message = "We encountered an unexpected bump on the road. Please try again or head back to explore other journeys.",
  onRetry = null,
  backLink = "/trips",
  backLabel = "Explore All Journeys",
}) => {
  return (
    <Container className="py-5 my-4">
      <Card className="glass-card text-center mx-auto p-4 p-md-5 border-danger-subtle max-w-650">
        <div className="mb-3">
          <div
            className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25"
            style={{ boxShadow: "0 0 25px rgba(239, 68, 68, 0.2)" }}
          >
            <IconAlertCircle size={36} />
          </div>
        </div>
        <h3 className="fw-bold text-white mb-2">{title}</h3>
        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "480px" }}>
          {message}
        </p>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {onRetry && (
            <Button variant="outline-info" onClick={onRetry} className="px-4 py-2 rounded-pill">
              Try Again
            </Button>
          )}
          {backLink && (
            <Button
              as={Link}
              to={backLink}
              variant="primary"
              className="px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2 btn-gradient"
            >
              <IconArrowLeft size={16} />
              {backLabel}
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default ErrorState;
