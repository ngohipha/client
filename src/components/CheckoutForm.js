import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";
import { Col, Row, Alert, Form, Button } from "react-bootstrap";
export default function CheckoutForm() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isLoading, isError ,isSuccess }] = useCreateOrderMutation();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (user.cart.count <= 0) return;

    setPlacingOrder(true);

    try {
      await createOrder({ userId: user._id, cart: user.cart, address, country });
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
          {alertMessage && <Alert> {alertMessage}</Alert>}
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