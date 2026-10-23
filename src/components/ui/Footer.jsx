import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IconCompass, IconPlane, IconShield, IconSparkles } from "./Icons";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="tripverse-footer pt-5 pb-4 mt-auto border-top border-secondary border-opacity-25">
      <Container>
        <Row className="gy-4 mb-5">
          {/* Brand Col */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="brand-icon-box d-flex align-items-center justify-content-center">
                <IconCompass size={22} className="text-cyan-glow" />
              </div>
              <span className="brand-text fs-4">
                Trip<span className="brand-accent">Verse</span>
              </span>
            </div>
            <p className="text-secondary small pe-lg-4 mb-4">
              Your gateway to transcendent travel experiences. We hand-craft immersive journeys, seamless boutique stays, and authentic global adventures across 6 continents.
            </p>
            <div className="d-flex gap-3 text-secondary">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="X"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6 1H15l-5.2 6 6.1 8h-4.8l-3.8-5-4.3 5H1l5.6-6.4L.7 1h5l3.5 4.6L12.6 1zm-.8 13h1.3L4.3 2.3H2.9L11.8 14z"/>
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="Discord"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                </svg>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={3} sm={6} className="col-6">
            <h6 className="text-white fw-bold mb-3 letter-spacing-1">Destinations</h6>
            <ul className="list-unstyled footer-nav-list small">
              <li>
                <Link to="/trips?category=Beach+Escapes">Beach Escapes</Link>
              </li>
              <li>
                <Link to="/trips?category=Cultural+Experiences">Cultural Tours</Link>
              </li>
              <li>
                <Link to="/trips?category=Adventure+Trips">Mountain Treks</Link>
              </li>
              <li>
                <Link to="/trips?category=Luxury+Getaways">Luxury Villas</Link>
              </li>
              <li>
                <Link to="/trips?category=City+Breaks">City Breaks</Link>
              </li>
            </ul>
          </Col>

          {/* Company */}
          <Col lg={2} md={3} sm={6} className="col-6">
            <h6 className="text-white fw-bold mb-3 letter-spacing-1">TripVerse</h6>
            <ul className="list-unstyled footer-nav-list small">
              <li>
                <Link to="/trips">All Journeys</Link>
              </li>
              <li>
                <Link to="/wishlist">Saved Trips</Link>
              </li>
              <li>
                <Link to="/bookings">My Bookings</Link>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth'}); }}>About Us</a>
              </li>
              <li>
                <a href="#support" onClick={(e) => { e.preventDefault(); alert("TripVerse Support: support@tripverse.com | 24/7 Concierge: +1 (800) 555-TRIP"); }}>24/7 Concierge</a>
              </li>
            </ul>
          </Col>

          {/* Newsletter */}
          <Col lg={4} md={12}>
            <h6 className="text-white fw-bold mb-3 letter-spacing-1 d-flex align-items-center gap-2">
              <IconSparkles size={16} className="text-cyan-glow" />
              Voyager Chronicles
            </h6>
            <p className="text-secondary small mb-3">
              Receive secret flight deals, private villa drops, and curated photo itineraries directly in your inbox.
            </p>
            {subscribed && (
              <Alert variant="success" className="py-2 small bg-opacity-25 border-success text-success">
                Welcome to Voyager Chronicles! Check your email for a welcome gift.
              </Alert>
            )}
            <Form onSubmit={handleSubscribe} className="d-flex gap-2">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-custom rounded-pill text-white py-2 px-3 small"
              />
              <Button type="submit" className="btn-gradient rounded-pill px-4 flex-shrink-0">
                Join
              </Button>
            </Form>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top border-secondary border-opacity-10 text-secondary extra-small">
          <div>
            &copy; {new Date().getFullYear()} TripVerse Inc. Crafted with passion for global wanderers.
          </div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>Verified Escapes</span>
            <span>&bull;</span>
            <span>Zero Booking Surcharges</span>
            <span>&bull;</span>
            <span>100% Financial Protection</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
