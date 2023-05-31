import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Form, Button, Alert, Row } from "react-bootstrap";
import { useCreateOrderMutation } from "../services/appApi";

export default function CheckoutForm() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isLoading, isError, isSuccess }] =
    useCreateOrderMutation();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [creditOption, setCreditOption] = useState(false);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (user.cart.count <= 0) return;

    setPlacingOrder(true);

    try {
      let paymentMethod = "Thanh toán trực tiếp"; // Default payment method
      if (user.isCustomer) {
        paymentMethod = creditOption ? "Ghi nợ" : "Thanh toán trực tiếp";
      }

      await createOrder({
        userId: user._id,
        cart: user.cart,
        address,
        country,
        paymentMethod,
      });

      setAlertMessage("Order placed successfully!");

      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (error) {
      setAlertMessage("Failed to place order. Please try again.");
      console.error(error);
    }

    setPlacingOrder(false);
  }

  return (
    <Col className="cart-payment-container">
      <Form onSubmit={handlePlaceOrder}>
        <Row>
          {alertMessage && <Alert>{alertMessage}</Alert>}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={user.name}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Email"
                value={user.email}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        {user.isCustomer && (
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    label="Ghi nợ"
                    checked={creditOption}
                    onChange={(e) => setCreditOption(e.target.checked)}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        )}

        <Button
          className="mt-3"
          type="submit"
          disabled={user.cart.count <= 0 || placingOrder || isSuccess}
        >
          {placingOrder ? "Placing Order..." : "Place Order"}
        </Button>
      </Form>
    </Col>
  );
}
