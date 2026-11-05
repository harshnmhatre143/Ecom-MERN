const Order = require('../model/Order');
const mongoose = require('mongoose');

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ctreate a new order
const createOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            address,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!items || !items.length || !totalAmount || !address) {
            return res.status(400).json({
                message: 'Invalid order data'
            });
        }

        // Verify Razorpay payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        const signatureBuffer = Buffer.from(generatedSignature);
        const receivedBuffer = Buffer.from(razorpay_signature || '');

        if (
            signatureBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(signatureBuffer, receivedBuffer)
        ) {
            return res.status(400).json({
                message: 'Payment verification failed'
            });
        }

        const formattedItems = items.map(item => ({
            product: item.product?._id || item.product || item.productId || item._id,
            quantity: Number(item.quantity ?? item.qty),
            price: Number(item.price)
        }));

        console.log("Formatted order items:", formattedItems);
        const invalidItem = formattedItems.find(
            item => !item.product || !mongoose.isValidObjectId(item.product)
        );

        if (invalidItem) {
            return res.status(400).json({
                message: 'Invalid product ID in cart'
            });
        }

        const order = new Order({
            user: req.user._id,
            items: formattedItems,
            totalAmount: Number(totalAmount),
            address,
            paymentId: razorpay_payment_id,
            paymentVerified: true
        });

        await order.save();

        const message = `Dear ${req.user.name},

Thank you for your order!

Order ID: ${order._id}
Total Amount: ₹${totalAmount}

We will notify you once your order is shipped.

Best regards,
ShopNest`;

        await sendEmail(
            req.user.email,
            'Order Created successfully',
            message
        );

        res.status(201).json({
            message: 'Order created successfully',
            order
        });

    } catch (error) {
        console.error('Order creation error:', error);

        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.status(200).json({ message: 'Orders retrieved successfully', orders });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        else {
            order.status = status;
            await order.save();
            res.status(200).json({ message: 'Order status updated successfully', order });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    myOrders,
    updateOrderStatus
};    