
import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty, 0
  );

  const handlePayment = async () => {
    try {
      if (!cartItems.length) {
        return alert('Your cart is empty');
      }
      console.log("Cart items:", cartItems);

      // Create Razorpay order
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        console.error('Order creation failed:', orderData);
        return alert(orderData.message || orderData.error || 'Payment initialization failed');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        description: 'Test Transaction',
        order_id: orderData.id,

        handler: async function (response) {
          try {
            const saveOrderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({
                items: cartItems.map(item => ({
                  product: item.productId,
                  quantity: Number(item.qty),
                  price: Number(item.price)
                })),
                totalAmount: totalPrice,
                address,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const saveOrderData = await saveOrderRes.json();

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/profile');
            } else {
              console.error('Order saving failed:', saveOrderData);
              alert(saveOrderData.message || 'Order saving failed');
            }
          } catch (error) {
            console.error('Order saving error:', error);
            alert('Payment successful, but order saving failed');
          }
        },

        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },

        theme: {
          color: '#f97316'
        }
      };

      if (!window.Razorpay) {
        return alert('Razorpay SDK is not loaded');
      }

      const rzp1 = new window.Razorpay(options);

      rzp1.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(response.error.description || 'Payment failed');
      });

      rzp1.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong while processing payment');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login first');
      navigate('/login');
      return;
    }
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-content">
        <h3 style={{ color: '#18181b', marginBottom: '20px' }}>Shipping Address</h3>

        <form onSubmit={handleSubmit} className="shipping-form">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Street Address"
            required
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            required
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="State"
            required
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <input
            type="text"
            placeholder="Postal Code"
            required
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          />
          <input
            type="text"
            placeholder="Country"
            required
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
          />

          <div className="checkout-summary">
            <h4>Total: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn" style={{ width: '100%' }}>
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
