
import React from "react";
import { Link } from "react-router-dom";
import "../styles/product.css";

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price);
};

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.imageUrls}
        alt={product.name}
        className="product-image"
      />

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <p className="product-price">{formatPrice(product.price)}</p>

        <Link to={`/product/${product._id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
