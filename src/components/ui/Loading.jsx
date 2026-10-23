import React from "react";
import { Spinner, Container } from "react-bootstrap";
import { IconCompass } from "./Icons";

const Loading = ({ message = "Exploring horizons...", fullScreen = false }) => {
  const containerClass = fullScreen
    ? "d-flex flex-column align-items-center justify-content-center min-vh-100 py-5"
    : "d-flex flex-column align-items-center justify-content-center py-5 my-5";

  return (
    <Container className={containerClass}>
      <div className="position-relative mb-3">
        <Spinner
          animation="border"
          variant="info"
          style={{ width: "3.5rem", height: "3.5rem", borderWidth: "3px" }}
          className="text-cyan-glow"
        />
        <div
          className="position-absolute top-50 start-50 translate-middle text-info"
          style={{ animation: "pulse 1.8s infinite ease-in-out" }}
        >
          <IconCompass size={22} />
        </div>
      </div>
      <p className="text-light-subtle fw-medium mb-0 letter-spacing-1 small">
        {message}
      </p>
    </Container>
  );
};

export default Loading;
