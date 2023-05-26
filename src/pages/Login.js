import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Toast,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Home";
import { useLoginMutation } from "../services/appApi";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isError, isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  async function handleLogin(e) {
  e.preventDefault();
  const response = await login({ email, password });

  if (response.data && response.data.success) {
    navigate("/home");
  } else {
    if (response.data && response.data.mes === "Invalid email or password.") {
      Swal.fire({
        icon: "error",
        title: "Email hoặc mật khẩu không hợp lệ",
        text: "Vui lòng kiểm tra lại email và mật khẩu và thử lại.",
      });
    } else if (response.data && response.data.mes === "Vui lòng xác nhận email của bạn.") {
      Swal.fire({
        icon: "error",
        title: "Tài khoản chưa được xác thực",
        text: "Vui lòng xác thực tài khoản để đăng nhập.",
      });
    } else if (response.data && response.data.mes === "Email not found.") {
      Swal.fire({
        icon: "error",
        title: "Email chưa được đăng ký",
        text: "Vui lòng đăng ký tài khoản trước khi đăng nhập.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Sai thông tin đăng nhập ",
        text: "Vui lòng kiểm tra lại thông tin.",
      });
    }
  }
}

  return (
    <Container>
      <Row>
        <Col md={6} className="login__form--container">
          <Form style={{ width: "100%" }}>
            <h1>Login to your account</h1>
            {/* {isError && <Alert variant="danger">{error.data}</Alert>} */}
            <Form.Group>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Button type="submit" disabled={isLoading} onClick={handleLogin}>
                Login
              </Button>
            </Form.Group>
            <p className="">
              Don't have an account? <Link to="/signup">Create account</Link>
            </p>
            <p className="">
              You forgot your password?{" "}
              <Link to="/forgotpassword">Forgot Password</Link>
            </p>
          </Form>
        </Col>
        <Col md={6} className="login__image--container"></Col>
      </Row>
    </Container>
  );
};

export default Login;
