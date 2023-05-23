import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";
import { Col, Row, Alert, Form, Button } from "react-bootstrap";
export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isLoading, isError ,isSuccess }] = useCreateOrderMutation();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);

  async function handlePay(e) {
    e.preventDefault();
    if (!stripe || !elements || user.cart.count <= 0) return;
    setPaying(true);
    const { client_secret } = await fetch("http://localhost:8080/create-payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer YOUR_SECRET_KEY ",
        },
        body: JSON.stringify({ amount: user.cart.total }),
    }).then((res) => res.json());
    const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
            card: elements.getElement(CardElement),
        },
    });
    setPaying(false);

    if (paymentIntent) {
        createOrder({ userId: user._id, cart: user.cart, address, country }).then((res) => {
            if (!isLoading && !isError) {
                setAlertMessage(`Payment ${paymentIntent.status}`);
                setTimeout(() => {
                    navigate("/orders");
                }, 3000);
            }
        });
    }
}

  return (
    <Col className="cart-payment-container">
      <Form onSubmit={handlePay}>
        <Row>
          {alertMessage && <Alert> {alertMessage}</Alert>}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Firs Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={user.name}
                disabled
              ></Form.Control>
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
              ></Form.Control>
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
              ></Form.Control>
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
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <label htmlFor="card-element">Card</label>
        <CardElement id="card-element" />
        <Button
          className="mt-3"
          type="submit"
          disabled={user.cart.count <= 0 || paying || isSuccess}
        >
          {paying ? "Processing..." : "Pay"}
        </Button>
      </Form>
    </Col>
  );
}
