import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useTrips } from "../../context/TripsContext";
import useAuth from "../../context/useAuth";
import {
  IconCompass,
  IconPlane,
  IconSparkles,
  IconCheck,
  IconCalendar,
  IconMapPin,
  IconArrowRight,
  IconTrash,
} from "../ui/Icons";

const SAMPLE_TRIP = {
  name: "Northern Lights & Arctic Fjords Safari",
  destination: "Tromsø & Senja Island",
  country: "Norway",
  category: "Nature Retreats",
  price: 139000,
  duration: "6 Days / 5 Nights",
  difficulty: "Moderate",
  featured: true,
  image: "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg",
  gallery: [
    "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg",
    "https://images.pexels.com/photos/1435075/pexels-photo-1435075.jpeg",
    "https://images.pexels.com/photos/688835/pexels-photo-688835.jpeg",
  ],
  overview:
    "Chase the ethereal Aurora Borealis across frozen fjords, sleep under glass igloos, and encounter Arctic wildlife aboard electric catamarans.",
  highlights:
    "Nightly Aurora hunts with expert astrophotographers\nWhale watching aboard silent hybrid-electric ship\nDog sledding through snowy birch forests\nStay at oceanfront glass-roof sea cabins",
  itinerary: [
    {
      day: 1,
      title: "Arrival in Arctic Capital Tromsø",
      description: "Private snow transfer to waterfront boutique lodge. Evening welcome dinner featuring Arctic cuisine and introductory Aurora briefing.",
    },
    {
      day: 2,
      title: "Fjord Cruise & Whale Safari",
      description: "Sail silently past towering snow-covered peaks to spot orcas and humpback whales in their Arctic winter feeding grounds.",
    },
    {
      day: 3,
      title: "Husky Dog Sledding & Sami Culture",
      description: "Drive your own husky team across pristine mountain trails followed by traditional reindeer stew inside a warm lavvu tent.",
    },
    {
      day: 4,
      title: "Senja Island Scenic Highway",
      description: "Traverse the iconic National Tourist Route of Senja, exploring jagged peaks known as the 'Devil's Teeth' and secluded Arctic beaches.",
    },
    {
      day: 5,
      title: "Aurora Chasing & Ice Dome Visit",
      description: "Visit the mesmerizing Tromsø Ice Domes followed by an off-grid Aurora camp with campfire storytelling and hot lingonberry cider.",
    },
    {
      day: 6,
      title: "Departure",
      description: "Leisure morning overlooking the frozen harbour, souvenir shopping, and private airport transfer.",
    },
  ],
  inclusions:
    "5 Nights Luxury Boutique & Glass Cabin Stays\nAll Daily Gourmet Breakfasts & 3 Arctic Dinners\nNightly Guided Aurora Photography Expeditions\nThermal Winter Suits & Arctic Boots Rental\nAll Ground & Catamaran Transfers",
  exclusions:
    "International Flights to Tromsø (TOS)\nAlcoholic Beverages\nPersonal Travel & Medical Insurance",
  bestTimeToVisit: "November to March (Peak Aurora Season)",
};

const AddTrip = () => {
  const navigate = useNavigate();
  const { addTrip, categories } = useTrips();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    country: "",
    category: categories[1] || "Adventure Trips",
    price: "",
    duration: "",
    difficulty: "Moderate",
    featured: true,
    image: "",
    galleryUrls: "",
    overview: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
    bestTimeToVisit: "",
  });

  const [itinerary, setItinerary] = useState([
    { day: 1, title: "Arrival & Welcome", description: "Airport pickup, check-in, and welcome dinner." },
    { day: 2, title: "Guided Exploration", description: "Discover the iconic landmarks with a local guide." },
  ]);

  const [loading, setLoading] = useState(false);
  const [successTrip, setSuccessTrip] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleItineraryChange = (index, field, value) => {
    setItinerary((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddDay = () => {
    setItinerary((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        title: `Day ${prev.length + 1} Activity`,
        description: "Scheduled tours and leisure evening.",
      },
    ]);
  };

  const handleRemoveDay = (index) => {
    if (itinerary.length <= 1) return;
    setItinerary((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 }))
    );
  };

  const handleFillSample = () => {
    setFormData({
      name: SAMPLE_TRIP.name,
      destination: SAMPLE_TRIP.destination,
      country: SAMPLE_TRIP.country,
      category: SAMPLE_TRIP.category,
      price: SAMPLE_TRIP.price,
      duration: SAMPLE_TRIP.duration,
      difficulty: SAMPLE_TRIP.difficulty,
      featured: SAMPLE_TRIP.featured,
      image: SAMPLE_TRIP.image,
      galleryUrls: SAMPLE_TRIP.gallery.join("\n"),
      overview: SAMPLE_TRIP.overview,
      highlights: SAMPLE_TRIP.highlights,
      inclusions: SAMPLE_TRIP.inclusions,
      exclusions: SAMPLE_TRIP.exclusions,
      bestTimeToVisit: SAMPLE_TRIP.bestTimeToVisit,
    });
    setItinerary(SAMPLE_TRIP.itinerary);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please specify the journey title.");
      return;
    }
    if (!formData.destination.trim()) {
      setError("Please specify the primary destination.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError("Please enter a valid price in INR.");
      return;
    }
    if (!formData.image.trim()) {
      setError("Please provide a cover image URL for the journey.");
      return;
    }

    setLoading(true);

    try {
      const gallery = formData.galleryUrls
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const highlights = formData.highlights
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const inclusions = formData.inclusions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const exclusions = formData.exclusions
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const tripPayload = {
        name: formData.name.trim(),
        destination: formData.destination.trim(),
        country: formData.country.trim() || "Global",
        category: formData.category,
        price: Number(formData.price),
        duration: formData.duration.trim() || `${itinerary.length} Days`,
        difficulty: formData.difficulty,
        featured: formData.featured,
        image: formData.image.trim(),
        gallery: gallery.length > 0 ? gallery : [formData.image.trim()],
        overview: formData.overview.trim(),
        highlights: highlights,
        itinerary: itinerary,
        inclusions: inclusions,
        exclusions: exclusions,
        bestTimeToVisit: formData.bestTimeToVisit.trim(),
        rating: 4.9,
        reviewsCount: 1,
        createdBy: user?.email || "Admin Curator",
      };

      const result = await addTrip(tripPayload);
      setSuccessTrip(result);
    } catch (err) {
      console.error("Failed to publish trip", err);
      setError("An error occurred publishing the journey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-trip-page py-5">
      <Container>
        {/* Header Bar */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-subtle border border-info border-opacity-30 mb-2">
              <IconSparkles size={14} className="text-cyan-glow" />
              <span className="text-info fw-semibold extra-small letter-spacing-1 text-uppercase">
                Admin Curator Studio
              </span>
            </div>
            <h1 className="fw-extrabold text-white mb-1">Publish New Expedition</h1>
            <p className="text-secondary small mb-0">
              Create a new handcrafted itinerary and deploy it to the live global marketplace.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Button
              type="button"
              variant="outline-info"
              onClick={handleFillSample}
              className="rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 small"
            >
              <IconSparkles size={14} />
              <span>Fill Sample Expedition</span>
            </Button>
            <Link
              to="/trips"
              className="btn btn-outline-secondary rounded-pill px-3 py-2 text-light small border-secondary border-opacity-40"
            >
              View Catalog
            </Link>
          </div>
        </div>

        {/* Success Banner */}
        {successTrip && (
          <Alert variant="success" className="bg-success bg-opacity-20 border-success border-opacity-40 text-white rounded-4 p-4 mb-4 shadow-lg">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <h4 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
                  <IconCheck size={22} />
                  <span>Expedition Successfully Published!</span>
                </h4>
                <p className="text-light-subtle small mb-0">
                  <strong>{successTrip.name}</strong> is now live on TripVerse and ready for travelers to book.
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to={`/trips/${successTrip.id}`}
                  className="btn-gradient rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  <span>View Live Expedition</span>
                  <IconArrowRight size={16} />
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => setSuccessTrip(null)}
                  className="rounded-pill px-3 py-2 text-white"
                >
                  Create Another
                </Button>
              </div>
            </div>
          </Alert>
        )}

        {/* Error message */}
        {error && (
          <Alert variant="danger" className="bg-danger bg-opacity-20 border-danger border-opacity-30 text-white rounded-3 py-2 mb-4">
            {error}
          </Alert>
        )}

        {/* Form Card */}
        <Card className="glass-card border-0 rounded-4 p-4 p-md-5 shadow-2xl">
          <Form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <h5 className="text-white fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              1. Basic Journey Information
            </h5>
            <Row className="g-3 mb-4">
              <Col md={8}>
                <Form.Group controlId="tripName">
                  <Form.Label className="text-light small fw-medium">Expedition Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Kyoto Cherry Blossom & Ancient Temples"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="tripCategory">
                  <Form.Label className="text-light small fw-medium">Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat} className="bg-dark text-white">
                          {cat}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="tripDestination">
                  <Form.Label className="text-light small fw-medium">Destination City/Region *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Kyoto & Nara"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="tripCountry">
                  <Form.Label className="text-light small fw-medium">Country *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Japan"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={4} sm={6}>
                <Form.Group controlId="tripPrice">
                  <Form.Label className="text-light small fw-medium">Price per person (₹ INR) *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g. 115000"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={1000}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={4} sm={6}>
                <Form.Group controlId="tripDuration">
                  <Form.Label className="text-light small fw-medium">Duration Text</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 6 Days / 5 Nights"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={4} sm={6}>
                <Form.Group controlId="tripDifficulty">
                  <Form.Label className="text-light small fw-medium">Physical Difficulty</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  >
                    <option value="Easy" className="bg-dark text-white">Easy</option>
                    <option value="Moderate" className="bg-dark text-white">Moderate</option>
                    <option value="Challenging" className="bg-dark text-white">Challenging</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="tripBestTime">
                  <Form.Label className="text-light small fw-medium">Best Time to Visit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. March to May & October to November"
                    name="bestTimeToVisit"
                    value={formData.bestTimeToVisit}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={6} className="d-flex align-items-center mt-md-4 pt-md-2">
                <Form.Check
                  type="checkbox"
                  id="featuredCheck"
                  name="featured"
                  label="Display as Featured on Homepage"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="text-white"
                />
              </Col>
            </Row>

            {/* Media & Images */}
            <h5 className="text-white fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              2. Photography & Media
            </h5>
            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group controlId="tripImage">
                  <Form.Label className="text-light small fw-medium">Cover Hero Image URL *</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://images.pexels.com/photos/..."
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              {formData.image && (
                <Col md={12}>
                  <div className="p-2 rounded-4 bg-dark bg-opacity-60 border border-secondary border-opacity-20 d-inline-block">
                    <img
                      src={formData.image}
                      alt="Cover Preview"
                      className="rounded-3 object-fit-cover shadow-sm"
                      style={{ height: "140px", maxWidth: "260px" }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </Col>
              )}

              <Col md={12}>
                <Form.Group controlId="tripGallery">
                  <Form.Label className="text-light small fw-medium">
                    Additional Gallery Image URLs (one per line or comma-separated)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="https://images.pexels.com/...&#10;https://images.pexels.com/..."
                    name="galleryUrls"
                    value={formData.galleryUrls}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Overview & Highlights */}
            <h5 className="text-white fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              3. Overview & Highlights
            </h5>
            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group controlId="tripOverview">
                  <Form.Label className="text-light small fw-medium">Expedition Overview Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe the magic and character of this journey..."
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="tripHighlights">
                  <Form.Label className="text-light small fw-medium">
                    Key Highlights (one per line)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Priority access to ancient monuments&#10;Sunset private boat cruise with champagne&#10;Michelin-starred dining experience"
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Itinerary Builder */}
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              <h5 className="text-white fw-bold mb-0">4. Day-by-Day Itinerary</h5>
              <Button
                type="button"
                variant="outline-info"
                size="sm"
                onClick={handleAddDay}
                className="rounded-pill px-3 py-1"
              >
                + Add Day
              </Button>
            </div>

            <div className="d-flex flex-column gap-3 mb-4">
              {itinerary.map((dayItem, index) => (
                <div
                  key={index}
                  className="p-3 rounded-4 bg-dark bg-opacity-60 border border-secondary border-opacity-25 position-relative"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="info" className="bg-opacity-20 text-info px-3 py-1 rounded-pill">
                      Day {dayItem.day}
                    </Badge>
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(index)}
                        className="btn btn-link text-danger p-0 extra-small text-decoration-none"
                      >
                        Remove Day
                      </button>
                    )}
                  </div>

                  <Row className="g-2">
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        placeholder="Day Title (e.g. Arrival in Tokyo)"
                        value={dayItem.title}
                        onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                        className="input-custom rounded-3 text-white small"
                      />
                    </Col>
                    <Col md={8}>
                      <Form.Control
                        type="text"
                        placeholder="Detailed activities, stays, and transfers..."
                        value={dayItem.description}
                        onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                        className="input-custom rounded-3 text-white small"
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </div>

            {/* Inclusions & Exclusions */}
            <h5 className="text-white fw-bold mb-3 border-bottom border-secondary border-opacity-25 pb-2">
              5. Inclusions & Exclusions
            </h5>
            <Row className="g-3 mb-5">
              <Col md={6}>
                <Form.Group controlId="tripInclusions">
                  <Form.Label className="text-success small fw-medium">
                    What's Included (one per line)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="5-Star Boutique Lodging&#10;Daily Artisanal Breakfast&#10;Private Airport Chauffeur&#10;English Speaking Historian Guide"
                    name="inclusions"
                    value={formData.inclusions}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="tripExclusions">
                  <Form.Label className="text-danger small fw-medium">
                    Not Included (one per line)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="International Flights&#10;Personal Expenses&#10;Travel Medical Insurance"
                    name="exclusions"
                    value={formData.exclusions}
                    onChange={handleChange}
                    className="input-custom rounded-3 text-white"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Submit Action Button */}
            <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary border-opacity-25">
              <Button
                as={Link}
                to="/trips"
                variant="outline-secondary"
                className="rounded-pill px-4 text-light border-opacity-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="btn-gradient rounded-pill px-5 py-2 fw-semibold d-inline-flex align-items-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span>Publishing Expedition...</span>
                  </>
                ) : (
                  <>
                    <IconPlane size={16} />
                    <span>Publish to TripVerse</span>
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default AddTrip;
