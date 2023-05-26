import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useSignupMutation } from "../services/appApi";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [hasError, setHasError] = useState(false);
  const [signup] = useSignupMutation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mobileError, setMobileError] = useState("");

  function validateForm() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{5,11}$/;
    const mobileRegex = /^\d{9}$/;

    const isEmailValid = emailRegex.test(email);
    const isPasswordValid = passwordRegex.test(password);
    const isMobileValid = mobileRegex.test(mobile);

    setIsFormValid(
      isEmailValid && isPasswordValid && isMobileValid && name !== ""
    );

    setEmailError(isEmailValid ? "" : "Định dạng email không đúng");
    setPasswordError(isPasswordValid ? "" : "Mật khẩu phải từ 6 đến 12 ký tự");
    setMobileError(
      isMobileValid ? "" : "Số điện thoại phải chứa đúng 10 chữ số"
    );
  }

  function handleSignup(e) {
    e.preventDefault();
    if (isFormValid) {
      signup({ name, email, password, mobile })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Đăng ký thành công",
            text: "Vui lòng kiểm tra email của bạn để xác nhận",
            confirmButtonText: "OK",
          });
        })
        .catch((error) => {
          setHasError(true);
          Swal.fire({
            icon: "error",
            title: "Đăng ký thất bại",
            text: "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.",
            confirmButtonText: "OK",
          });
        });
    }
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="signup__form--container">
          <Form style={{ width: "100%" }}>
            <h1>Tạo tài khoản</h1>
            {hasError && (
              <div className="error-message">
                <p>Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.</p>
              </div>
            )}
            <Form.Group>
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên của bạn"
                value={name}
                required
                onChange={(e) => {
                  setName(e.target.value);
                  validateForm();
                }}
              />
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateForm();
                }}
                className={emailError ? "is-invalid" : ""}
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </Form.Group>
            <Form.Group>
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateForm();
                }}
                className={passwordError ? "is-invalid" : ""}
              />
              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="mobile"
                placeholder="Nhập số điện thoại"
                value={mobile}
                required
                onChange={(e) => {
                  setMobile(e.target.value);
                  validateForm();
                }}
                pattern="[0-9]*"
                className={mobileError ? "is-invalid" : ""}
              />
              {mobileError && (
                <div className="error-message">{mobileError}</div>
              )}
            </Form.Group>
            <Form.Group>
              <Button
                type="submit"
                disabled={!isFormValid}
                onClick={handleSignup}
              >
                Đăng ký
              </Button>
            </Form.Group>
            <p className="">
              Bạn chưa có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </Form>
        </Col>
        <Col md={6} className="signup__image--container"></Col>
      </Row>
    </Container>
  );
}
