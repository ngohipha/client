import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../services/appApi";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function ResetPassword() {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  async function handleResetPassword() {
    try {
      const response = await resetPassword({ password, token });
      if (response.success) {
        toast.success(response.message);
        navigate("/login");
      } else {
        toast.info(response.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="absolute top-0 animate-shadow-pop-tr left-0 bottom-0 items-center flex-col right-0 bg-white flex py-8 z-50">
      <div className="flex flex-col gap-4">
        <label htmlFor="password">Enter your new password</label>
        <input
          type="text"
          id="password"
          className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-center">
        <Button
          name="Submit"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "0.375rem",
            color: password ? "white" : "black",
            backgroundColor: password ? "orange" : "white",
            border: password ? "none" : "1px solid black",
            marginTop: "0.5rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease",
          }}
          disabled={isLoading}
          onClick={handleResetPassword}
        >
          Submit
        </Button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
