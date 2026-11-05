
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrls: product.imageUrls,
        qty: 1
      }));
      alert('Successfully added to your cart!');
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>
      Loading Product...
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', margin: '100px', color: '#dc2626' }}>
      Product Not Found
    </div>
  );

  return (
    <div className="product-detail-wrapper" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>

      <div style={{
        color: '#71717a',
        marginBottom: '20px',
        fontSize: '0.95rem'
      }}>
        <Link to="/" style={{ color: '#f97316' }}>Home</Link>
        {' / '}
        <Link to="/shop" style={{ color: '#f97316' }}>Shop</Link>
        {' / '}
        {product.category}
        {' / '}
        <span style={{ color: '#18181b' }}>{product.name}</span>
      </div>

      <div className="product-detail">

        <div className="detail-image-container">
          <img
            src={product.imageUrls}
            alt={product.name}
            className="detail-image"
          />
        </div>

        <div className="detail-info">

          <h2 style={{
            fontSize: '2.4rem',
            marginBottom: '10px',
            color: '#18181b'
          }}>
            {product.name}
          </h2>

          <p className="detail-price" style={{
            fontSize: '2.3rem',
            margin: '15px 0'
          }}>
            {formatPrice(product.price)}
          </p>

          <div style={{ marginBottom: '25px' }}>
            <h4 style={{
              color: '#18181b',
              marginBottom: '10px'
            }}>
              Product Description
            </h4>

            <p style={{
              color: '#52525b',
              lineHeight: '1.8'
            }}>
              {product.description}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <button
              onClick={handleAddToCart}
              className="btn"
              style={{
                flexGrow: '1',
                padding: '16px',
                fontSize: '1.05rem'
              }}
            >
              Add to Shopping Cart
            </button>
          </div>

          <p style={{
            marginTop: '20px',
            color: product.stock > 0 ? '#16a34a' : '#dc2626',
            fontWeight: '600'
          }}>
            {product.stock > 0
              ? `● In Stock (${product.stock} units available)`
              : '● Temporarily Out of Stock'}
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
