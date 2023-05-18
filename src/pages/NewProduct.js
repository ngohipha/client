import React, { useState } from "react";
import "./NewProduct.css";
import { Link, useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../services/appApi";
import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";
import axios from '../axios'
const NewProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [imgToRemove, setImgToRemove] = useState(null);
  const [createProduct, { isError, error, isLoading, isSuccess }] =
    useCreateProductMutation();


  function handleRemoveImg(imgObj){
    setImgToRemove(imgObj.public_id);
    axios.delete(`/images/${imgObj.public_id}/`).then((res)=> {
        setImgToRemove(null);
        setImages((prev)=> prev.filter((img)=> img.public_id !== imgObj.public_id));
    }).catch(e=> console.log(e))
  }  

  function handleSubmit(e){
    e.preventDefault();
    if(!name || !description || !price || !category || !images.length){
        return alert("Please fill out all the fields")
    }
    createProduct({name, description,price,category, images}).then(({data})=>{
        if(data.length > 0){
            setTimeout(()=>{
                navigate("/")
            },1500)
        }
    })
  }


  function showWidget() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dussrstai",
        uploadPreset: "hxt8pdwd",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setImages((prev) => [
            ...prev,
            { url: result.info.url, public_id: result.info.public_id },
          ]);
        }
      }
    );
    widget.open();
  }
  return (
    <Container>
      <Row >
        <Col md={6} className="new-product__form--container">
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1 className="mt-4">Create a product</h1>
            {isSuccess && (
              <Alert variant="success">Product created with success</Alert>
            )}
            {isError && <Alert variant="danger">{error.data}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Product name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Product description"
                style={{ height: "100px" }}
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label> Price(VND)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Price (VND)"
                // style={{height:"100px"}}
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              onChange={(e) => setCategory(e.target.value)}
            >
              <Form.Label> Category</Form.Label>
              <Form.Select>
                <option disabled selected>
                  --Select One--
                </option>
                <option value="technology">technology</option>
                <option value="tablets">tablets</option>
                <option value="phones">phone</option>
                <option value="laptops">laptops</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Button type="button" onClick={showWidget}>
                Upload Images
              </Button>
              <div className="images-preview-container">
                {images.map((image) => (
                  <div className="image-preview">
                    <img src={image.url} alt="" />
                    {/* add icon for removing */}
                    {imgToRemove != image.public_id &&                     <i className="fa fa-times-circle" onClick={()=> handleRemoveImg(image)}></i>
}
                  </div>
                ))}
              </div>
            </Form.Group>
            <Form.Group>
              <Button type="submit" disabled={isLoading || isSuccess}>
                Create Product
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={6} className="new-product__image--container"></Col>
      </Row>
    </Container>
  );
};

export default NewProduct;
