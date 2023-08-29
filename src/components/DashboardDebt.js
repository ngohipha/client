import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";

import axios from "../axios";
import Loading from "./Loading";
import Pagination from "./Pagination";
import Swal from "sweetalert2";
import ButtonDebtOrder from "../components/ButtonDebtOrder";
function DashboardDebt() {
  const [loading, setLoading] = useState(false);
  const [debts, setDebts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [payDebtOrder, { isLoading }] = usePayDebtOrderMutation();
  // const [deleteDebtOrder, { isLoading }] = useDeleteDebtOrderMutation();

  function handlePay(_id, user_id) {
    Swal.fire({
      title: "Xác nhận thanh toán",
      text: "Bạn có chắc muốn thanh toán công nợ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Thanh toán",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`/debts/debtOrders/${_id}/pay`, { user_id })
          .then(({ data }) => {
            const updatedDebts = debts.map((debt) =>
              debt._id === _id ? data : debt
            );
            setDebts(updatedDebts);
            Swal.fire("Thanh toán thành công", "", "success");
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Lỗi", "Đã xảy ra lỗi khi thanh toán", "error");
          });
      }
    });
  }

  function deletePay(_id, user_id) {
    Swal.fire({
      title: "Xác nhận xoá",
      text: "Bạn có chắc muốn xoá công nợ này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/debts/debtOrders/${_id}`, { data: { user_id } })
          .then(() => {
            const updatedDebts = debts.filter((debt) => debt._id !== _id);
            setDebts(updatedDebts);
            Swal.fire("Xoá thành công", "", "success");
          })
          .catch((error) => {
            console.log(error);
            Swal.fire("Lỗi", "Đã xảy ra lỗi khi xoá", "error");
          });
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get("/debts") // Update the route to match your backend route for retrieving debts
      .then(({ data }) => {
        // Sort the debts array by orderDate in descending order
        const sortedDebts = data.sort((a, b) => b.orderDate - a.orderDate);

        setLoading(false);
        setDebts(sortedDebts);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (debts.length === 0) {
    return <h1 className="text-center pt-4">No orders yet</h1>;
  }
  function TableRow({
    _id,
    orderDate,
    customerId,
    totalAmount,
    paymentStatus,
    notes,
    // handlePayment,
    // handleCancel,
  }) {
    // Search functionality

    if (
      searchQuery &&
      customerId?.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1
    ) {
      return null;
    }

    return (
     <>
      <tr>
        <td>{_id}</td>
        <td>{orderDate}</td>
        <td>{customerId?.name}</td>
        <td>{totalAmount}</td>
        <td>{paymentStatus}</td>
        <td>{notes}</td>
        <td>
          {/* Conditional rendering of action buttons */}
          {paymentStatus === "Ghi nợ" && (
            <>
              <Button
                variant="primary"
                onClick={() => handlePay(_id, customerId)}
              >
                Thanh Toán
              </Button>
            </>
          )}
          ,
          {paymentStatus === "Đã Thanh Toán" && (
            <>
              <Button
                variant="danger"
                onClick={() => deletePay(_id, customerId)}
              >
                Xóa
              </Button>
            </>
          )}
        </td>
      </tr>
     
     </>
      
    );
  }
  return (
    <>
      <input
        type="text"
        placeholder="Search by client name"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <h1>Debt List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Debt ID</th>
            <th>Order Date</th>
            <th>Customer ID</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <Pagination
            data={debts}
            RenderComponent={TableRow}
            pageLimit={1}
            dataLimit={10}
            tablePagination={true}
          />
        </tbody>
      </Table>
      <ButtonDebtOrder/>

    </>
    
  );

}

export default DashboardDebt;
