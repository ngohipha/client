import React, { useState } from "react";
import { useForgotPasswordMutation } from "../services/appApi";
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ForgotPassword() {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleForgotPassword = async () => {
    const response = await forgotPassword({ email });
    if (response.success) {
      setIsForgotPassword(false);
      toast.success(response.mes);
    } else {
      toast.info(response.mes);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <label htmlFor="email">Enter your email</label>
      <input
        type="text"
        id="email"
        className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
        placeholder="Exp:email.com"
        value={email}
        onChange={handleEmailChange}
      />
      <div className="flex items-center gap-4">
        <Button
          name="Submit"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            color: isForgotPassword ? "white" : "black",
            backgroundColor: isForgotPassword ? "orange" : "white",
            border: isForgotPassword ? "none" : "1px solid black",
            marginTop: "0.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease",
          }}
          disabled={isLoading}
          onClick={handleForgotPassword}
        >
          Submit
        </Button>
        <Button
          name="Back"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            color: isForgotPassword ? "black" : "white",
            backgroundColor: isForgotPassword ? "white" : "orange",
            border: isForgotPassword ? "1px solid black" : "none",
            marginTop: "0.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => setIsForgotPassword(false)}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
export default ForgotPassword;
