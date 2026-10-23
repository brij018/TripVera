import React, { useState, useMemo, useEffect } from "react";
import { Container, Row, Col, Form, Button, Badge, Card } from "react-bootstrap";
import { useSearchParams, Link } from "react-router-dom";
import { useTrips } from "../../context/TripsContext";
import TripCard from "../ui/TripCard";
import {
  IconSearch,
  IconFilter,
  IconCompass,
  IconArrowRight,
  IconSparkles,
  IconX,
} from "../ui/Icons";

const Trips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { trips, categories } = useTrips();

  // URL search query initial values
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [difficulty, setDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  // Calculate highest price from data for the slider
  const maxAvailablePrice = useMemo(
    () => Math.max(...trips.map((t) => t.price || 0), 200000),
    [trips]
  );
  const [maxPrice, setMaxPrice] = useState(maxAvailablePrice);

  // Sync state if URL changes
  useEffect(() => {
    if (urlSearch !== searchTerm) setSearchTerm(urlSearch);
    if (urlCategory !== category) setCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  // If max price changes based on new trips
  useEffect(() => {
    setMaxPrice(maxAvailablePrice);
  }, [maxAvailablePrice]);

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        // Search term matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchesTitle = trip.name.toLowerCase().includes(q);
          const matchesDest = trip.destination.toLowerCase().includes(q);
          const matchesCountry = trip.country?.toLowerCase().includes(q);
          const matchesOverview = trip.overview?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDest && !matchesCountry && !matchesOverview) {
            return false;
          }
        }

        // Category matching
        if (category !== "All" && trip.category !== category) {
          return false;
        }

        // Difficulty matching
        if (
          difficulty !== "All" &&
          trip.difficulty?.toLowerCase() !== difficulty.toLowerCase()
        ) {
          return false;
        }

        // Price matching
        if (trip.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "duration") {
          const daysA = parseInt(a.duration) || 0;
          const daysB = parseInt(b.duration) || 0;
          return daysB - daysA;
        }
        // Recommended: featured first, then rating
        if (a.featured === b.featured) {
          return b.rating - a.rating;
        }
        return a.featured ? -1 : 1;
      });
  }, [trips, searchTerm, category, difficulty, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setDifficulty("All");
    setMaxPrice(maxAvailablePrice);
    setSortBy("recommended");
    setSearchParams({});
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    category !== "All" ||
    difficulty !== "All" ||
    maxPrice < maxAvailablePrice ||
    sortBy !== "recommended";

  return (
    <div className="trips-explore-page py-5">
      <Container>
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-subtle border border-info border-opacity-30 mb-2">
              <IconCompass size={14} className="text-cyan-glow" />
              <span className="text-info fw-semibold extra-small letter-spacing-1 text-uppercase">
                Worldwide Expeditions
              </span>
            </div>
            <h1 className="fw-extrabold text-white mb-1">Explore All Journeys</h1>
            <p className="text-secondary small mb-0">
              Uncover handcrafted itineraries curated for culture lovers, wilderness adventurers, and luxury seekers.
            </p>
          </div>

          <Link
            to="/admin/add-trip"
            className="btn btn-outline-cyan rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
          >
            <IconSparkles size={14} />
            <span>+ Add New Trip</span>
          </Link>
        </div>

        {/* Filter Controls Box */}
        <Card className="glass-card border-0 rounded-4 p-4 shadow-xl mb-5">
          <Row className="g-3 align-items-center">
            {/* Search Input */}
            <Col lg={4} md={6}>
              <Form.Group controlId="filterSearch">
                <Form.Label className="text-light small fw-medium d-flex align-items-center gap-1 mb-1">
                  <IconSearch size={14} className="text-info" />
                  Search By Keyword
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Eiffel, Bali, Trek, Norway..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-custom rounded-pill py-2 pe-4 text-white small"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-secondary"
                    >
                      <IconX size={14} />
                    </button>
                  )}
                </div>
              </Form.Group>
            </Col>

            {/* Difficulty Filter */}
            <Col lg={2} md={3} sm={6}>
              <Form.Group controlId="filterDifficulty">
                <Form.Label className="text-light small fw-medium mb-1">Difficulty</Form.Label>
                <Form.Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input-custom rounded-pill py-2 text-white small"
                >
                  <option value="All" className="bg-dark text-white">All Difficulties</option>
                  <option value="Easy" className="bg-dark text-white">Easy</option>
                  <option value="Moderate" className="bg-dark text-white">Moderate</option>
                  <option value="Challenging" className="bg-dark text-white">Challenging</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Sort Filter */}
            <Col lg={3} md={3} sm={6}>
              <Form.Group controlId="filterSort">
                <Form.Label className="text-light small fw-medium mb-1">Sort By</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-custom rounded-pill py-2 text-white small"
                >
                  <option value="recommended" className="bg-dark text-white">Recommended / Featured</option>
                  <option value="rating" className="bg-dark text-white">Highest Rated</option>
                  <option value="price-low" className="bg-dark text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-dark text-white">Price: High to Low</option>
                  <option value="duration" className="bg-dark text-white">Longest Duration</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Price Slider */}
            <Col lg={3} md={12}>
              <Form.Group controlId="filterPrice">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <Form.Label className="text-light small fw-medium mb-0">Max Budget</Form.Label>
                  <span className="text-cyan-glow fw-bold small">
                    ₹{maxPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <Form.Range
                  min={30000}
                  max={maxAvailablePrice}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="custom-range"
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Category Horizontal Pills */}
          <div className="mt-4 pt-3 border-top border-secondary border-opacity-20">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <span className="text-secondary extra-small text-uppercase fw-semibold letter-spacing-1">
                Filter by Category
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-link text-info extra-small text-decoration-none p-0 d-inline-flex align-items-center gap-1"
                >
                  <IconX size={12} />
                  Reset all filters
                </button>
              )}
            </div>

            <div className="category-scroll-container d-flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`category-chip rounded-pill px-3 py-1 border-0 small ${
                      isSelected
                        ? "active-chip text-dark fw-bold bg-info"
                        : "text-secondary bg-dark bg-opacity-60 hover-surface"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Results Info Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-secondary small">
            Showing <strong className="text-white">{filteredTrips.length}</strong> of{" "}
            <strong className="text-white">{trips.length}</strong> expeditions
            {category !== "All" && (
              <span>
                {" "}in <Badge bg="info" className="bg-opacity-25 text-info">{category}</Badge>
              </span>
            )}
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length > 0 ? (
          <Row className="g-4">
            {filteredTrips.map((trip) => (
              <Col key={trip.id} lg={4} md={6} sm={12}>
                <TripCard trip={trip} />
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="glass-card text-center p-5 rounded-4 border-secondary border-opacity-25 my-5">
            <div className="mb-3">
              <div className="d-inline-flex p-3 rounded-circle bg-info bg-opacity-10 text-cyan-glow">
                <IconCompass size={36} />
              </div>
            </div>
            <h4 className="fw-bold text-white mb-2">No Expeditions Match Your Filters</h4>
            <p className="text-secondary small max-w-500 mx-auto mb-4">
              Try adjusting your search criteria, widening the price range, or clearing filters to discover other available journeys.
            </p>
            <div>
              <Button
                variant="outline-info"
                onClick={handleResetFilters}
                className="rounded-pill px-4 py-2"
              >
                Reset All Filters
              </Button>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Trips;
