import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import TripCard from "../ui/TripCard";
import { IconHeart, IconArrowRight, IconCompass } from "../ui/Icons";

const Wishlist = () => {
  const { wishlistTrips, wishlistCount } = useWishlist();

  return (
    <div className="wishlist-page py-5">
      <Container>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-cyan-subtle border border-info border-opacity-30 mb-2">
              <IconHeart size={14} filled className="text-danger" />
              <span className="text-info fw-semibold extra-small letter-spacing-1 text-uppercase">
                Saved Escapes
              </span>
            </div>
            <h1 className="fw-extrabold text-white mb-1">Your Expedition Wishlist</h1>
            <p className="text-secondary small mb-0">
              Journeys you’ve bookmarked for your next big adventure.
            </p>
          </div>

          {wishlistCount > 0 && (
            <Link
              to="/trips"
              className="btn btn-outline-cyan rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
            >
              <span>Explore More Journeys</span>
              <IconArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Content */}
        {wishlistCount > 0 ? (
          <div>
            <div className="text-secondary small mb-3">
              You have <strong className="text-white">{wishlistCount}</strong> saved expedition{wishlistCount > 1 ? "s" : ""}
            </div>
            <Row className="g-4">
              {wishlistTrips.map((trip) => (
                <Col key={trip.id} lg={4} md={6} sm={12}>
                  <TripCard trip={trip} />
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          /* Empty state */
          <Card className="glass-card text-center p-5 rounded-5 border-0 my-5">
            <div className="mb-3">
              <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger">
                <IconHeart size={44} />
              </div>
            </div>
            <h3 className="fw-bold text-white mb-2">Your Wishlist is Empty</h3>
            <p className="text-secondary small max-w-500 mx-auto mb-4">
              Click the heart icon on any expedition card to bookmark trips you want to experience in the future.
            </p>
            <div>
              <Button
                as={Link}
                to="/trips"
                className="btn-gradient rounded-pill px-5 py-3 fw-semibold shadow-lg d-inline-flex align-items-center gap-2"
              >
                <span>Browse All Journeys</span>
                <IconArrowRight size={16} />
              </Button>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
