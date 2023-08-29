import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import { useCreateDebtsMutation } from "../services/appApi";

function ButtonCreateOrder() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([{ name: "", price: 0 }]);
  const [notes, setNotes] = useState("");
  const [createdebt, { isLoading }] = useCreateDebtsMutation();

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    if (field === "price") {
      const formattedValue = value
        .replace(/,/g, "")
        .replace(/\./g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: formattedValue,
      };
    } else {
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    }
    setProducts(updatedProducts);
  };
  
  const handleAddProduct = () => {
    setProducts([...products, { name: "", price: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };
  const handleSave = async () => {
    try {
      if (!email || !products || !notes) {
        console.log("Missing inputs");
        return;
      }

      const result = await Swal.fire({
        title: "Xác thực",
        text: "Bạn có chắc muốn lưu thông tin này?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Lưu",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        const response = await createdebt({
          customerId: email,
          products,
          notes,
        });

        console.log(response.data);

        // Xử lý phản hồi thành công ở đây (nếu cần)

        Swal.fire({
          title: "Thành công",
          text: "Thông tin đã được lưu thành công",
          icon: "success",
        }).then(() => {
          // Tắt modal Swal2 sau khi người dùng nhấn OK
          Swal.close();
        });
      } else if (result.isDenied) {
        // Xử lý hủy ở đây (nếu cần)
        Swal.fire({
          title: "Hủy",
          text: "Hủy bỏ lưu thông tin",
          icon: "info",
        }).then(() => {
          // Tắt modal Swal2 sau khi người dùng nhấn OK
          Swal.close();
        });
      }
    } catch (error) {
      console.log(error);
      // Xử lý lỗi ở đây (nếu cần)

      Swal.fire({
        title: "Lỗi",
        text: "Đã xảy ra lỗi",
        icon: "error",
      }).then(() => {
        // Tắt modal Swal2 sau khi người dùng nhấn OK
        Swal.close();
      });
    }
  };
  return (
    <>
      <button
        className="btn btn-primary btn-floating"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          padding: "10px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.25)",
        }}
        onClick={handleShow}
      >
        <i className="fas fa-plus"></i>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Order User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Customer ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter customer ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            {products.map((product, index) => (
              <Form.Group key={index} className="mb-3">
                <Form.Label>Product</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "name", e.target.value)
                    }
                  />
                  <Form.Control
                    type="text"
                    placeholder="Enter product price"
                    value={
                      typeof product.price === "string"
                        ? product.price.replace(/,/g, ".")
                        : ""
                    }
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "price",
                        e.target.value.replace(/\./g, "")
                      )
                    }
                  />
                  {index === products.length - 1 && (
                    <Button variant="link" onClick={handleAddProduct}>
                      +
                    </Button>
                  )}
                  {index !== products.length - 1 && (
                    <Button
                      variant="link"
                      onClick={() => handleRemoveProduct(index)}
                    >
                      -
                    </Button>
                  )}
                </div>
              </Form.Group>
            ))}
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea2"
            >
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() => handleSave()}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ButtonCreateOrder;
