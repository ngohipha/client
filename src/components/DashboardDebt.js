import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";

import axios from "../axios";
import Loading from "./Loading";
import Pagination from "./Pagination";


function DashboardDebt() {

  const [loading, setLoading] = useState(false);
  const [debts, setDebts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [payDebtOrder, { isLoading }] = usePayDebtOrderMutation();
  // const [deleteDebtOrder, { isLoading }] = useDeleteDebtOrderMutation();
 
  function handlePay(_id, user_id) {
    axios
      .post(`/debts/${_id}/pay`, { user_id })
      .then(({ data }) => setDebts(data))
      .catch((e) => console.log(e));
  }
  function deletePay(_id, user_id) {
    axios
      .delete(`/debts/${_id}`, { user_id })
      .then(({ data }) => setDebts(data))
      .catch((e) => console.log(e));
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
      <tr>
        <td>{_id}</td>
        <td>{orderDate}</td>
        <td>{customerId.name}</td>
        <td>{totalAmount}</td>
        <td>{paymentStatus}</td>
        <td>{notes}</td>
        <td>
          {/* Conditional rendering of action buttons */}
          {paymentStatus === "Ghi nợ" && (
            <>
              <Button variant="primary" onClick={handlePay} >
                Thanh Toán
              </Button>
              <Button variant="danger" onClick={deletePay} >
                Xóa
              </Button>
            </>
          )}
        </td>
      </tr>
    );
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Search by client name"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <h1>Debt List</h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
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
    </div>
  );
}

export default DashboardDebt;
