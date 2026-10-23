import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Dropdown, Badge } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { useWishlist } from "../../context/WishlistContext";
import {
  IconCompass,
  IconHeart,
  IconTicket,
  IconUser,
  IconLogout,
  IconSparkles,
} from "./Icons";

const NavbarComponent = () => {
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(" ");
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0][0].toUpperCase();
    }
    return email ? email[0].toUpperCase() : "U";
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      expanded={expanded}
      className={`tripverse-navbar py-3 ${scrolled ? "scrolled shadow-lg" : ""}`}
    >
      <Container>
        {/* Brand / Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={() => setExpanded(false)}
          className="d-flex align-items-center gap-2 text-decoration-none"
        >
          <div className="brand-icon-box d-flex align-items-center justify-content-center">
            <IconCompass size={22} className="text-cyan-glow" />
          </div>
          <span className="brand-text">
            Trip<span className="brand-accent">Verse</span>
          </span>
        </Navbar.Brand>

        {/* Toggler */}
        <Navbar.Toggle
          aria-controls="tripverse-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
          className="border-0 shadow-none text-light"
        >
          <span className="navbar-toggler-icon custom-toggler-icon" />
        </Navbar.Toggle>

        {/* Links */}
        <Navbar.Collapse id="tripverse-nav">
          <Nav className="mx-auto my-2 my-lg-0 nav-pills-custom">
            <Nav.Link
              as={NavLink}
              to="/"
              end
              onClick={() => setExpanded(false)}
              className="nav-link-custom"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/trips"
              onClick={() => setExpanded(false)}
              className="nav-link-custom"
            >
              Explore Journeys
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/wishlist"
              onClick={() => setExpanded(false)}
              className="nav-link-custom d-flex align-items-center gap-1"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <Badge pill bg="danger" className="ms-1 px-2 py-1 small">
                  {wishlistCount}
                </Badge>
              )}
            </Nav.Link>
            {user && (
              <Nav.Link
                as={NavLink}
                to="/bookings"
                onClick={() => setExpanded(false)}
                className="nav-link-custom"
              >
                My Bookings
              </Nav.Link>
            )}
            <Nav.Link
              as={NavLink}
              to="/admin/add-trip"
              onClick={() => setExpanded(false)}
              className="nav-link-custom d-flex align-items-center gap-1"
            >
              <IconSparkles size={13} className="text-info" />
              <span>+ Add Trip</span>
            </Nav.Link>
          </Nav>

          {/* User Auth Section */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="transparent"
                  id="user-dropdown"
                  className="p-1 border-0 d-flex align-items-center gap-2 shadow-none"
                >
                  <div className="avatar-circle">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Avatar"
                        className="rounded-circle w-100 h-100 object-fit-cover"
                      />
                    ) : (
                      <span>{getInitials(user.displayName, user.email)}</span>
                    )}
                  </div>
                  <div className="d-none d-md-block text-start">
                    <div className="text-white small fw-bold text-truncate" style={{ maxWidth: "120px" }}>
                      {user.displayName || user.email?.split("@")[0]}
                    </div>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="tripverse-dropdown-menu shadow-lg border-0 rounded-4 p-2 mt-2">
                  <div className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1">
                    <p className="mb-0 text-white fw-bold small text-truncate">
                      {user.displayName || "Traveler"}
                    </p>
                    <p className="mb-0 text-secondary extra-small text-truncate">
                      {user.email}
                    </p>
                  </div>
                  <Dropdown.Item
                    as={Link}
                    to="/bookings"
                    onClick={() => setExpanded(false)}
                    className="dropdown-item-custom rounded-3 py-2 d-flex align-items-center gap-2"
                  >
                    <IconTicket size={16} className="text-info" />
                    <span>My Bookings</span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/wishlist"
                    onClick={() => setExpanded(false)}
                    className="dropdown-item-custom rounded-3 py-2 d-flex align-items-center gap-2"
                  >
                    <IconHeart size={16} className="text-danger" />
                    <span>Saved Wishlist ({wishlistCount})</span>
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/admin/add-trip"
                    onClick={() => setExpanded(false)}
                    className="dropdown-item-custom rounded-3 py-2 d-flex align-items-center gap-2"
                  >
                    <IconSparkles size={16} className="text-info" />
                    <span>Admin Curator (Add Trip)</span>
                  </Dropdown.Item>
                  <Dropdown.Divider className="border-secondary border-opacity-25" />
                  <Dropdown.Item
                    onClick={() => {
                      setExpanded(false);
                      handleLogout();
                    }}
                    className="dropdown-item-custom text-danger rounded-3 py-2 d-flex align-items-center gap-2"
                  >
                    <IconLogout size={16} />
                    <span>Sign Out</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                as={Link}
                to="/auth"
                onClick={() => setExpanded(false)}
                className="btn-gradient rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
              >
                <IconUser size={16} />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
