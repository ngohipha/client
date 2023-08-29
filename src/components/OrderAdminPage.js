import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import axios from '../axios';
import Loading from './Loading'


function OrdersAdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const products = useSelector((state) => state.products);
  const [orderToShow, setOrderToShow] = useState([]);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => setShow(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/orders")
      .then(({ data }) => {
        // Sort orders by date in descending order
        const sortedOrders = data.sort((a, b) => b.date - a.date);
        setLoading(false);
        setOrders(sortedOrders);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  function markShipped(orderId, ownerId) {
    axios
      .patch(`/orders/${orderId}/mark-shipped`, { ownerId })
      .then(({ data }) => setOrders(data))
      .catch((e) => console.log(e));
  }

  function showOrder(productsObj) {
    let productsToShow = products.filter((product) => productsObj[product._id]);
    productsToShow = productsToShow.map((product) => {
      const productCopy = { ...product };
      productCopy.count = productsObj[product._id];
      delete productCopy.description;
      return productCopy;
    });
    setShow(true);
    setOrderToShow(productsToShow);
  }

  if (loading) {
    return <Loading />;
  }

  if (orders.length === 0) {
    return <h1 className="text-center pt-4">No orders yet</h1>;
  }

  function TableRow({
    _id,
    count,
    owner,
    total,
    status,
    products,
    address,
    paymentMethod,
  }) {
    if (
      searchQuery &&
      owner?.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1
    ) {
      return null;
    }
    return (
      <tr key={_id}>
        <td>{_id}</td>
        <td>{owner?.name}</td>
        <td>{count}</td>
        <td>{total}</td>
        <td>{address}</td>
        <td>
          {status === "processing" ? (
            <Button size="sm" onClick={() => markShipped(_id, owner?._id)}>
              Mark as shipped
            </Button>
          ) : (
            <Badge bg="success">Shipped</Badge>
          )}
        </td>
        <td>{paymentMethod}</td>
        <td>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => showOrder(products)}
          >
            View order <i className="fa fa-eye"></i>
          </span>
        </td>
      </tr>
    );
  }


  return (
    <>
      <input
        type="text"
        placeholder="Search by client name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Client Name</th>
            <th>Items</th>
            <th>Order Total</th>
            <th>Address</th>
            <th>STT</th>
            <th>Bebt</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <TableRow key={order._id} {...order} />
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order details</Modal.Title>
        </Modal.Header>
        {orderToShow.map((order) => (
          <div className="order-details__container d-flex justify-content-around py-2" key={order._id}>
            <img
              src={order.pictures[0].url}
              style={{ maxWidth: 100, height: 100, objectFit: "cover" }}
              alt=""
            />
            <p>
              <span>{order.count} x </span> {order.name}
            </p>
            <p>Price: ${Number(order.price) * order.count}</p>
          </div>
        ))}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default OrdersAdminPage;