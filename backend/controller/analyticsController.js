
const Order = require('../model/Order');
const User = require('../model/User');
const Product = require('../model/product');

const getAdminStats = async (req, res) => {
    try {
        // Your logic for fetching admin stats
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);


      res.json({
        totalUsers,
        totalOrders,  
        totalProducts,
        totalRevenue,
      });  
    }
    catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

module.exports = { getAdminStats };