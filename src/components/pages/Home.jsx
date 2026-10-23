import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Badge, Accordion } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useTrips } from "../../context/TripsContext";
import TripCard from "../ui/TripCard";
import {
  IconSearch,
  IconCompass,
  IconShield,
  IconSparkles,
  IconStar,
  IconArrowRight,
  IconCheck,
  IconUsers,
  IconCalendar,
  IconPlane,
  IconTicket,
} from "../ui/Icons";

const Home = () => {
  const navigate = useNavigate();
  const { trips, categories } = useTrips();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featuredTrips = trips.filter((t) => t.featured).slice(0, 6);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
    navigate(`/trips?${params.toString()}`);
  };

  const categoryIcons = {
    "Beach Escapes": "🏖️",
    "Cultural Experiences": "🏛️",
    "Adventure Trips": "🧗",
    "City Breaks": "🏙️",
    "Nature Retreats": "🌲",
    "Luxury Getaways": "✨",
  };

  const trendingDestinations = [
    {
      name: "Amalfi Coast, Italy",
      count: "3 Expeditions",
      image: "https://images.pexels.com/photos/17635101/pexels-photo-17635101.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Luxury Getaways",
    },
    {
      name: "Bali & Nusa Penida",
      count: "4 Expeditions",
      image: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Beach Escapes",
    },
    {
      name: "Paris & Provence",
      count: "2 Expeditions",
      image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Cultural Experiences",
    },
    {
      name: "Swiss Alpine Valleys",
      count: "3 Expeditions",
      image: "https://images.pexels.com/photos/161901/paris-sunset-france-monument-161901.jpeg?auto=compress&cs=tinysrgb&w=600",
      category: "Nature Retreats",
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "Sophia Kensington",
      location: "London, UK",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      trip: "Romantic Paris Getaway",
      rating: 5,
      comment:
        "TripVerse handled every detail from our private Seine cruise to dinner reservations seamlessly. Truly the most magical anniversary we’ve ever celebrated.",
    },
    {
      id: 2,
      name: "Liam O'Connor",
      location: "Sydney, Australia",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      trip: "Tropical Bali Escape",
      rating: 5,
      comment:
        "The Ubud jungle villa was mesmerizing. The local guides knew secret paths away from crowds. The best curated itinerary hands down!",
    },
    {
      id: 3,
      name: "Elena Rostova",
      location: "Toronto, Canada",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      trip: "Amalfi Coast & Capri Dream",
      rating: 5,
      comment:
        "Positano cliffside stay was beyond words. Transparent pricing, no surprise fees, and the concierge was always one text away. 10/10!",
    },
  ];

  const faqs = [
    {
      q: "How does booking through TripVerse work?",
      a: "Browse any journey, pick your travel date and group size, and reserve instantly. Your voucher is immediately generated and stored in your Traveler Passport, complete with 24/7 concierge contact info.",
    },
    {
      q: "What is the cancellation policy?",
      a: "We offer 100% free cancellation up to 7 days prior to departure for all standard expeditions. Refunds are credited back to your original payment method within 3 business days.",
    },
    {
      q: "Can I add a custom trip package to the catalog?",
      a: "Yes! Use our Admin Curator Studio to submit bespoke itineraries with day-by-day activities, pricing, and photography, instantly publishing them to the live catalog.",
    },
    {
      q: "Are flights and ground transfers included?",
      a: "Each journey clearly itemizes inclusions and exclusions. Airport transfers and luxury ground transport are included on all featured expeditions.",
    },
  ];

  return (
    <div className="home-page">
      {/* HERO / LANDING SECTION */}
      <section className="hero-section position-relative py-5 py-lg-6 text-center text-lg-start overflow-hidden">
        <div className="hero-ambient-glow" />
        <Container className="position-relative z-1 py-4">
          <Row className="align-items-center gy-5">
            <Col lg={7}>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-subtle border border-info border-opacity-30 mb-3">
                <IconSparkles size={14} className="text-cyan-glow" />
                <span className="text-info fw-semibold extra-small letter-spacing-1 text-uppercase">
                  The New Standard in Global Exploration
                </span>
              </div>

              <h1 className="hero-title fw-extrabold text-white mb-3">
                Journey Into The <br className="d-none d-sm-block" />
                <span className="text-gradient-cyan">Extraordinary.</span>
              </h1>

              <p className="hero-description text-secondary fs-6 mb-4 pe-lg-4">
                Discover bespoke itineraries, rare natural sanctuaries, and 5-star boutique lodgings hand-curated for modern adventurers.
              </p>

              {/* Hero Search Box */}
              <Card className="hero-search-card glass-card border-0 rounded-4 p-3 p-sm-4 shadow-2xl mb-4">
                <Form onSubmit={handleHeroSearch}>
                  <Row className="g-3 align-items-end">
                    <Col md={5} sm={12}>
                      <Form.Group controlId="searchDest">
                        <Form.Label className="text-light small fw-medium d-flex align-items-center gap-1 mb-1">
                          <IconSearch size={14} className="text-info" />
                          Destination or Landmark
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Where do you want to wander?"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="input-custom rounded-pill py-2 text-white small"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4} sm={6}>
                      <Form.Group controlId="categorySelect">
                        <Form.Label className="text-light small fw-medium d-flex align-items-center gap-1 mb-1">
                          <IconCompass size={14} className="text-info" />
                          Experience Type
                        </Form.Label>
                        <Form.Select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="input-custom rounded-pill py-2 text-white small"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat} className="bg-dark text-white">
                              {cat}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={3} sm={6}>
                      <Button
                        type="submit"
                        className="btn-gradient w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      >
                        <IconSearch size={16} />
                        <span>Search</span>
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>

              {/* Trust Badges */}
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-lg-start text-secondary small pt-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-1 rounded-circle bg-success bg-opacity-20 text-success">
                    <IconCheck size={12} />
                  </div>
                  <span>{trips.length}+ Verified Escapes</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="p-1 rounded-circle bg-success bg-opacity-20 text-success">
                    <IconCheck size={12} />
                  </div>
                  <span>Instant Confirmation</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="p-1 rounded-circle bg-success bg-opacity-20 text-success">
                    <IconCheck size={12} />
                  </div>
                  <span>Zero Concealed Fees</span>
                </div>
              </div>
            </Col>

            {/* Hero Visual Right Column */}
            <Col lg={5} className="d-none d-lg-block">
              <div className="hero-visual-card position-relative">
                <div className="hero-img-backdrop rounded-5 overflow-hidden shadow-2xl border border-secondary border-opacity-20 position-relative">
                  <img
                    src="https://images.pexels.com/photos/17635101/pexels-photo-17635101.jpeg"
                    alt="Amalfi Coast"
                    className="w-100 object-fit-cover hero-visual-main"
                  />
                  <div className="hero-img-gradient-overlay position-absolute bottom-0 start-0 end-0 p-4">
                    <Badge bg="info" className="bg-opacity-90 text-dark fw-bold mb-2">Featured Destination</Badge>
                    <h5 className="text-white fw-bold mb-1">Amalfi Coast & Capri Dream</h5>
                    <div className="text-secondary small">Italy &bull; 6 Days / 5 Nights</div>
                  </div>
                </div>

                {/* Floating Rating Pill */}
                <div className="hero-floating-badge glass-card position-absolute top-0 start-0 translate-middle-y ms-3 p-3 rounded-4 shadow-lg border border-secondary border-opacity-30 d-flex align-items-center gap-3">
                  <div className="p-2 rounded-circle bg-warning bg-opacity-20 text-warning">
                    <IconStar size={20} fill="#f59e0b" />
                  </div>
                  <div>
                    <div className="fw-bold text-white fs-6">4.9 / 5.0 Rating</div>
                    <div className="text-secondary extra-small">Over 2,400+ Explorers</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CATEGORY EXPLORER */}
      <section className="py-5 border-top border-bottom border-secondary border-opacity-15 bg-dark bg-opacity-40">
        <Container>
          <div className="text-center mb-4">
            <h6 className="text-info letter-spacing-1 text-uppercase small fw-bold">Explore By Vibe</h6>
            <h3 className="fw-bold text-white">Curated Categories</h3>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.filter((c) => c !== "All").map((category) => (
              <Button
                key={category}
                as={Link}
                to={`/trips?category=${encodeURIComponent(category)}`}
                variant="outline-secondary"
                className="category-pill-btn rounded-pill px-4 py-2 text-light border-secondary border-opacity-30 d-inline-flex align-items-center gap-2"
              >
                <span>{categoryIcons[category] || "🗺️"}</span>
                <span className="fw-medium small">{category}</span>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS / 3 EASY STEPS */}
      <section className="py-5 my-4">
        <Container>
          <div className="text-center max-w-650 mx-auto mb-5">
            <h6 className="text-info letter-spacing-1 text-uppercase small fw-bold">Seamless Booking</h6>
            <h2 className="fw-bold text-white mb-2">How TripVerse Works</h2>
            <p className="text-secondary small">
              Effortlessly reserve your dream journey in three streamlined steps.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <Card className="glass-card h-100 p-4 rounded-4 border-0 text-center text-md-start">
                <div className="brand-icon-box mb-3 d-inline-flex align-items-center justify-content-center">
                  <IconCompass size={22} className="text-cyan-glow" />
                </div>
                <h5 className="text-white fw-bold mb-2">1. Explore & Select</h5>
                <p className="text-secondary small mb-0">
                  Search across multi-day itineraries, verified boutique accommodations, and transparent pricing.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card h-100 p-4 rounded-4 border-0 text-center text-md-start">
                <div className="brand-icon-box mb-3 d-inline-flex align-items-center justify-content-center">
                  <IconCalendar size={22} className="text-cyan-glow" />
                </div>
                <h5 className="text-white fw-bold mb-2">2. Customize & Lock In</h5>
                <p className="text-secondary small mb-0">
                  Choose your departure date, add travel companions, specify preferences, and confirm with zero booking surcharges.
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="glass-card h-100 p-4 rounded-4 border-0 text-center text-md-start">
                <div className="brand-icon-box mb-3 d-inline-flex align-items-center justify-content-center">
                  <IconTicket size={22} className="text-cyan-glow" />
                </div>
                <h5 className="text-white fw-bold mb-2">3. Embark & Enjoy</h5>
                <p className="text-secondary small mb-0">
                  Receive instant digital vouchers in your Traveler Passport with 24/7 concierge support during your stay.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TRENDING DESTINATIONS */}
      <section className="py-5 my-3 border-top border-secondary border-opacity-15 bg-dark bg-opacity-25">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <h6 className="text-info letter-spacing-1 text-uppercase small fw-bold">Trending Hotspots</h6>
              <h2 className="fw-bold text-white mb-1">Most Coveted Destinations</h2>
              <p className="text-secondary small mb-0">Iconic spots booked by travelers this month.</p>
            </div>
            <Link to="/trips" className="btn btn-outline-cyan rounded-pill px-4 py-2 mt-3 mt-md-0 d-inline-flex align-items-center gap-2">
              <span>View All Destinations</span>
              <IconArrowRight size={14} />
            </Link>
          </div>

          <Row className="g-4">
            {trendingDestinations.map((dest, i) => (
              <Col key={i} lg={3} sm={6}>
                <Link
                  to={`/trips?search=${encodeURIComponent(dest.name.split(',')[0])}`}
                  className="text-decoration-none"
                >
                  <Card className="trip-card h-100 border-0 rounded-4 overflow-hidden position-relative">
                    <div style={{ height: "200px" }} className="position-relative overflow-hidden">
                      <Card.Img
                        src={dest.image}
                        alt={dest.name}
                        className="w-100 h-100 object-fit-cover trip-card-img"
                      />
                      <div className="trip-card-overlay" />
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <Badge bg="info" className="bg-opacity-90 text-dark fw-bold rounded-pill mb-1">
                          {dest.category}
                        </Badge>
                        <h6 className="text-white fw-bold mb-0">{dest.name}</h6>
                        <span className="text-cyan-glow extra-small">{dest.count}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FEATURED EXPEDITIONS */}
      <section className="py-5 my-3">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-subtle border border-info border-opacity-30 mb-2">
                <IconSparkles size={12} className="text-cyan-glow" />
                <span className="text-info fw-semibold extra-small text-uppercase">Top Ranked</span>
              </div>
              <h2 className="fw-bold text-white mb-1">Featured Expeditions</h2>
              <p className="text-secondary small mb-0">Handpicked adventures revered by global travelers.</p>
            </div>
            <Link
              to="/trips"
              className="btn btn-outline-cyan rounded-pill px-4 py-2 mt-3 mt-md-0 d-inline-flex align-items-center gap-2"
            >
              <span>View All {trips.length} Journeys</span>
              <IconArrowRight size={14} />
            </Link>
          </div>

          <Row className="g-4">
            {featuredTrips.map((trip) => (
              <Col key={trip.id} lg={4} md={6} sm={12}>
                <TripCard trip={trip} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* WHY CHOOSE TRIPVERSE */}
      <section className="py-5 my-4 border-top border-secondary border-opacity-15 position-relative">
        <Container>
          <div className="text-center max-w-650 mx-auto mb-5">
            <h6 className="text-info letter-spacing-1 text-uppercase small fw-bold">The TripVerse Difference</h6>
            <h2 className="fw-bold text-white mb-2">Why Discerning Travelers Choose Us</h2>
            <p className="text-secondary small">
              Every route, stay, and guide is vetted with relentless scrutiny to guarantee moments that stay with you forever.
            </p>
          </div>

          <Row className="g-4">
            <Col lg={3} sm={6}>
              <Card className="h-100 glass-card p-4 rounded-4 border-0 feature-box text-center text-sm-start">
                <div className="feature-icon-box mb-3 d-inline-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-15 text-cyan-glow">
                  <IconCompass size={24} />
                </div>
                <h5 className="text-white fw-bold mb-2">Artisan Itineraries</h5>
                <p className="text-secondary small mb-0">
                  Custom crafted by regional historians and seasoned alpinists to take you off the cookie-cutter path.
                </p>
              </Card>
            </Col>

            <Col lg={3} sm={6}>
              <Card className="h-100 glass-card p-4 rounded-4 border-0 feature-box text-center text-sm-start">
                <div className="feature-icon-box mb-3 d-inline-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-15 text-warning">
                  <IconShield size={24} />
                </div>
                <h5 className="text-white fw-bold mb-2">Transparent Pricing</h5>
                <p className="text-secondary small mb-0">
                  No mysterious resort fees, surcharges, or currency conversions. Exactly what you see is what you pay.
                </p>
              </Card>
            </Col>

            <Col lg={3} sm={6}>
              <Card className="h-100 glass-card p-4 rounded-4 border-0 feature-box text-center text-sm-start">
                <div className="feature-icon-box mb-3 d-inline-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-15 text-success">
                  <IconUsers size={24} />
                </div>
                <h5 className="text-white fw-bold mb-2">24/7 Global Concierge</h5>
                <p className="text-secondary small mb-0">
                  Direct communication with a human flight and itinerary specialist whenever you need quick assistance.
                </p>
              </Card>
            </Col>

            <Col lg={3} sm={6}>
              <Card className="h-100 glass-card p-4 rounded-4 border-0 feature-box text-center text-sm-start">
                <div className="feature-icon-box mb-3 d-inline-flex align-items-center justify-content-center rounded-3 bg-danger bg-opacity-15 text-danger">
                  <IconSparkles size={24} />
                </div>
                <h5 className="text-white fw-bold mb-2">Flexible Guarantee</h5>
                <p className="text-secondary small mb-0">
                  Change of plans? Easily cancel or reschedule your trip directly from your account dashboard with full support.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TRAVELER TESTIMONIALS */}
      <section className="py-5 my-3 border-top border-secondary border-opacity-15 bg-dark bg-opacity-25">
        <Container>
          <div className="text-center mb-5">
            <h6 className="text-info letter-spacing-1 text-uppercase small fw-bold">Unfiltered Stories</h6>
            <h2 className="fw-bold text-white mb-2">From Our Global Voyagers</h2>
            <p className="text-secondary small">Real experiences from travelers who took the leap.</p>
          </div>

          <Row className="g-4">
            {reviews.map((rev) => (
              <Col key={rev.id} lg={4} md={6}>
                <Card className="h-100 glass-card p-4 rounded-4 border-0 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-1 text-warning mb-3">
                      {[...Array(rev.rating)].map((_, i) => (
                        <IconStar key={i} size={15} fill="#f59e0b" />
                      ))}
                    </div>
                    <p className="text-secondary small fst-italic mb-4">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3 pt-3 border-top border-secondary border-opacity-25">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="rounded-circle object-fit-cover"
                      style={{ width: "42px", height: "42px" }}
                    />
                    <div>
                      <h6 className="text-white fw-bold mb-0 small">{rev.name}</h6>
                      <div className="text-secondary extra-small">{rev.location} &bull; <span className="text-info">{rev.trip}</span></div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-5 my-3">
        <Container>
          <div className="text-center max-w-650 mx-auto mb-5">
            <h6 className="text-info letter-spacing-1 text-uppercase small fw-bold">Curious Explorers</h6>
            <h2 className="fw-bold text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-secondary small">Everything you need to know before packing your luggage.</p>
          </div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <Accordion defaultActiveKey="0" flush className="itinerary-accordion">
                {faqs.map((faq, index) => (
                  <Accordion.Item
                    eventKey={String(index)}
                    key={index}
                    className="bg-transparent border-bottom border-secondary border-opacity-25 py-2"
                  >
                    <Accordion.Header>
                      <span className="fw-bold text-white fs-6">{faq.q}</span>
                    </Accordion.Header>
                    <Accordion.Body className="text-secondary small pt-2">
                      {faq.a}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA BANNER */}
      <section className="py-5 my-4">
        <Container>
          <Card className="cta-banner-card glass-card p-5 rounded-5 border-0 text-center overflow-hidden position-relative">
            <div className="cta-ambient-glow" />
            <div className="position-relative z-1 max-w-650 mx-auto">
              <h2 className="fw-extrabold text-white mb-3 fs-1">
                Your Next Chapter Awaits Beyond The Horizon
              </h2>
              <p className="text-secondary mb-4">
                Join thousands of curious voyagers discovering untamed peaks, serene turquoise lagoons, and centuries of culture.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Button
                  as={Link}
                  to="/trips"
                  className="btn-gradient rounded-pill px-5 py-3 fw-semibold shadow-lg d-inline-flex align-items-center gap-2"
                >
                  <span>Start Exploring Now</span>
                  <IconArrowRight size={16} />
                </Button>
                <Button
                  as={Link}
                  to="/admin/add-trip"
                  variant="outline-info"
                  className="rounded-pill px-4 py-3 d-inline-flex align-items-center gap-2"
                >
                  <IconSparkles size={16} />
                  <span>Curator / Add Trip Studio</span>
                </Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
};

export default Home;
