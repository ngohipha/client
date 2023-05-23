import React, {useEffect} from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function FinalSignup() {
    const { status } = useParams();
    const navigate = useNavigate()
    useEffect(() => {
        if (status === 'failed') {
          Swal.fire('Oop!', 'Đăng Ký Không Thành Công', 'error').then(() => {
            navigate('/finalregister/:status/login');
          });
        }
        if (status === 'success') {
          Swal.fire('Congratulation!', 'Đăng Ký Thành Công', 'success').then(() => {
            navigate('/finalregister/:status/login');
          });
        }
      }, [status, navigate]);
    return (
      <div className="h-screen w-screen bg-gray-100">
  
      </div>
    )
  };

export default FinalSignup
