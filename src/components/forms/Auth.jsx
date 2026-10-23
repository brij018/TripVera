import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
  Spinner,
  Button,
} from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import useAuth from "../../context/useAuth";
import { IconCompass, IconEye, IconSparkles } from "../ui/Icons";

const Auth = () => {
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const redirectTarget = location.state?.from?.pathname || "/trips";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError("");
    }
  };

  const mapFirebaseError = (errCode) => {
    switch (errCode) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password. Please verify your credentials and try again.";
      case "auth/email-already-in-use":
        return "An account with this email address already exists. Please sign in instead.";
      case "auth/weak-password":
        return "Password is too weak. Please choose a password with at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was cancelled before completing.";
      case "auth/network-request-failed":
        return "Network connection error. Please verify your internet connection and retry.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please wait a moment and try again.";
      default:
        return "Authentication encountered an issue. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }
    if (!isLogin && !formData.name.trim()) {
      setError("Please provide your full name to create an account.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email.trim(), formData.password);
        navigate(redirectTarget, { replace: true });
      } else {
        const userCredential = await signup(
          formData.email.trim(),
          formData.password
        );
        if (formData.name.trim() && userCredential.user) {
          try {
            await updateProfile(userCredential.user, {
              displayName: formData.name.trim(),
            });
          } catch (profileErr) {
            console.warn("Could not update profile display name:", profileErr);
          }
        }
        setSuccessMsg("Account created successfully!");
        navigate(redirectTarget, { replace: true });
      }
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      name: "Demo Voyager",
      email: "demo.voyager@tripverse.com",
      password: "password123",
    });
    setError("");
  };

  return (
    <div className="auth-page-wrapper py-5 d-flex align-items-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            {/* Header Brand */}
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
                <div className="brand-icon-box d-flex align-items-center justify-content-center">
                  <IconCompass size={26} className="text-cyan-glow" />
                </div>
                <span className="brand-text fs-3">
                  Trip<span className="brand-accent">Verse</span>
                </span>
              </Link>
              <p className="text-secondary small">
                {isLogin
                  ? "Welcome back, explorer! Sign in to continue your journey."
                  : "Join the expedition. Create your TripVerse passport today."}
              </p>
            </div>

            {/* Main Auth Card */}
            <Card className="glass-card border-0 rounded-4 shadow-2xl p-4 p-sm-5">
              {/* Tab Selector */}
              <div className="auth-nav-tabs d-flex p-1 rounded-pill mb-4 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
                <button
                  type="button"
                  className={`auth-tab-btn flex-fill py-2 rounded-pill border-0 fw-semibold small ${
                    isLogin ? "active-tab text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn flex-fill py-2 rounded-pill border-0 fw-semibold small ${
                    !isLogin ? "active-tab text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                >
                  Create Account
                </button>
              </div>

              {/* Status messages */}
              {error && (
                <Alert
                  variant="danger"
                  className="bg-danger bg-opacity-15 border border-danger border-opacity-30 text-danger-emphasis small py-2 rounded-3 mb-3"
                >
                  {error}
                </Alert>
              )}
              {successMsg && (
                <Alert
                  variant="success"
                  className="bg-success bg-opacity-15 border border-success border-opacity-30 text-success-emphasis small py-2 rounded-3 mb-3"
                >
                  {successMsg}
                </Alert>
              )}

              {/* Form */}
              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label className="text-light small fw-medium">
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. Maya Lin"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-custom rounded-3 py-2 text-white"
                      required={!isLogin}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="text-light small fw-medium">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-custom rounded-3 py-2 text-white"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="text-light small fw-medium mb-1">
                      Password
                    </Form.Label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-link p-0 text-secondary extra-small text-decoration-none d-flex align-items-center gap-1"
                    >
                      <IconEye size={14} />
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-custom rounded-3 py-2 text-white"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="btn-gradient w-100 rounded-pill py-2 fw-semibold mb-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    <span>{isLogin ? "Sign In to TripVerse" : "Create Passport"}</span>
                  )}
                </Button>
              </Form>

              {/* Divider */}
              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1 border-secondary border-opacity-25 my-0" />
                <span className="px-3 text-secondary extra-small text-uppercase">or</span>
                <hr className="flex-grow-1 border-secondary border-opacity-25 my-0" />
              </div>

              {/* Google Sign In */}
              <Button
                variant="outline-secondary"
                disabled={googleLoading || loading}
                onClick={handleGoogleAuth}
                className="w-100 rounded-pill py-2 border-secondary border-opacity-40 text-light d-flex align-items-center justify-content-center gap-2 hover-surface"
              >
                {googleLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google</span>
              </Button>

              {/* Demo Fill Helper */}
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="btn btn-link text-info extra-small text-decoration-none p-0 d-inline-flex align-items-center gap-1"
                >
                  <IconSparkles size={12} />
                  Fill demo credentials
                </button>
              </div>
            </Card>

            {/* Back to Home Link */}
            <div className="text-center mt-4">
              <Link to="/" className="text-secondary small text-decoration-none hover-cyan">
                &larr; Back to Explore Journeys
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Auth;
