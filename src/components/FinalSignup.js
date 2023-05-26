import React from "react";
import { useParams } from "react-router-dom";

function FinalSignup() {
  const { status } = useParams();

  if (status === "success") {
    return (
      <div>
        Account verification successful. You can display a success message here.
      </div>
    );
  } else if (status === "failed") {
    return (
      <div>
        Account verification failed. You can display a failure message here.
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Kết quả Đăng ký</h2>
        {status === "failed" && (
          <p className="text-red-500">
            Đăng ký không thành công. Vui lòng thử lại!
          </p>
        )}
        {status === "success" && (
          <p className="text-green-500">
            Đăng ký thành công! Bạn có thể đăng nhập vào tài khoản của mình.
          </p>
        )}
      </div>
    </div>
  );
}
export default FinalSignup;
