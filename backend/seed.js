
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./model/product');
const User = require('./model/User');
const Order = require('./model/Order');

// 6 Dummy Products
const products = [
    {
        name: 'Wireless Headphones',
        price: 59.99,
        description: 'Comfortable over-ear headphones with clear sound and wireless connectivity.',
        imageUrls: 'https://placehold.co/600x600?text=Wireless+Headphones',
        category: 'Electronics',
        stock: 25,
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'Everyday Backpack',
        price: 39.99,
        description: 'A lightweight backpack with plenty of space for everyday essentials.',
        imageUrls: 'https://placehold.co/600x600?text=Everyday+Backpack',
        category: 'Accessories',
        stock: 18,
        rating: 4.2,
        numReviews: 8,
    },
    {
        name: 'Ceramic Coffee Mug',
        price: 14.99,
        description: 'A reusable ceramic mug for your favorite hot or cold drinks.',
        imageUrls: 'https://placehold.co/600x600?text=Coffee+Mug',
        category: 'Home',
        stock: 40,
        rating: 4.7,
        numReviews: 15,
    },
    {
        name: 'Classic Cotton T-Shirt',
        price: 24.99,
        description: 'A soft, breathable cotton T-shirt for comfortable everyday wear.',
        imageUrls: 'https://placehold.co/600x600?text=Cotton+T-Shirt',
        category: 'Clothing',
        stock: 32,
        rating: 4.3,
        numReviews: 10,
    },
    {
        name: 'Insulated Water Bottle',
        price: 19.99,
        description: 'A reusable insulated bottle that keeps drinks at the right temperature.',
        imageUrls: 'https://placehold.co/600x600?text=Water+Bottle',
        category: 'Accessories',
        stock: 27,
        rating: 4.6,
        numReviews: 11,
    },
    {
        name: 'Smart Watch',
        price: 89.99,
        description: 'A stylish smartwatch with fitness tracking and smart notifications.',
        imageUrls: 'https://placehold.co/600x600?text=Smart+Watch',
        category: 'Electronics',
        stock: 20,
        rating: 4.8,
        numReviews: 18,
    },
];

// 3 Normal Users + 1 Admin
const demoUsers = [
    {
        name: 'Store Admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: 'admin',
    },
    {
        name: 'Avery Customer',
        email: 'avery@example.com',
        password: 'User@123',
        role: 'user',
    },
    {
        name: 'Jordan Customer',
        email: 'jordan@example.com',
        password: 'User@123',
        role: 'user',
    },
    {
        name: 'Taylor Customer',
        email: 'taylor@example.com',
        password: 'User@123',
        role: 'user',
    },
];

const seedOrders = async (users, seededProducts) => {
    const orders = [
        {
            paymentId: 'seed-order-avery-1',
            user: users['avery@example.com']._id,
            items: [
                { productName: 'Wireless Headphones', quantity: 1 },
                { productName: 'Insulated Water Bottle', quantity: 2 },
            ],
            status: 'Delivered',
            address: {
                fullName: 'Avery Customer',
                street: '123 Sample Street',
                city: 'Austin',
                state: 'Texas',
                postalCode: '78701',
                country: 'United States',
            },
        },
        {
            paymentId: 'seed-order-avery-2',
            user: users['avery@example.com']._id,
            items: [
                { productName: 'Ceramic Coffee Mug', quantity: 2 },
            ],
            status: 'Processing',
            address: {
                fullName: 'Avery Customer',
                street: '123 Sample Street',
                city: 'Austin',
                state: 'Texas',
                postalCode: '78701',
                country: 'United States',
            },
        },
        {
            paymentId: 'seed-order-jordan-1',
            user: users['jordan@example.com']._id,
            items: [
                { productName: 'Everyday Backpack', quantity: 1 },
                { productName: 'Classic Cotton T-Shirt', quantity: 2 },
            ],
            status: 'Shipped',
            address: {
                fullName: 'Jordan Customer',
                street: '456 Demo Avenue',
                city: 'Seattle',
                state: 'Washington',
                postalCode: '98101',
                country: 'United States',
            },
        },
        {
            paymentId: 'seed-order-taylor-1',
            user: users['taylor@example.com']._id,
            items: [
                { productName: 'Smart Watch', quantity: 1 },
            ],
            status: 'Pending',
            address: {
                fullName: 'Taylor Customer',
                street: '789 Example Road',
                city: 'Denver',
                state: 'Colorado',
                postalCode: '80202',
                country: 'United States',
            },
        },
    ];

    const operations = orders.map((order) => {
        const items = order.items.map(({ productName, quantity }) => ({
            product: seededProducts[productName]._id,
            quantity,
            price: seededProducts[productName].price,
        }));

        return {
            updateOne: {
                filter: { paymentId: order.paymentId },
                update: {
                    $set: {
                        ...order,
                        items,
                        totalAmount: items.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                        ),
                    },
                },
                upsert: true,
            },
        };
    });

    return Order.bulkWrite(operations);
};

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not set. Add it to backend/.env');
        }

        if (process.env.NODE_ENV === 'production' && !process.env.SEED_PASSWORD) {
            throw new Error('Set SEED_PASSWORD before running the seeder in production.');
        }

        await mongoose.connect(process.env.MONGO_URI);

        // Seed Products
        const productOperations = products.map((product) => ({
            updateOne: {
                filter: {
                    name: product.name,
                    category: product.category,
                },
                update: { $set: product },
                upsert: true,
            },
        }));

        const productResult = await Product.bulkWrite(productOperations);

        // Seed Users with hashed passwords
        const userOperations = await Promise.all(
            demoUsers.map(async (user) => {
                const { password, ...userData } = user;

                const hashedPassword = await bcrypt.hash(
                    process.env.SEED_PASSWORD || password,
                    10
                );

                return {
                    updateOne: {
                        filter: { email: user.email },
                        update: {
                            $set: {
                                ...userData,
                                password: hashedPassword,
                                verified: true,
                            },
                        },
                        upsert: true,
                    },
                };
            })
        );

        const userResult = await User.bulkWrite(userOperations);

        // Get seeded users
        const userDocuments = await User.find({
            email: { $in: demoUsers.map(({ email }) => email) },
        });

        const usersByEmail = Object.fromEntries(
            userDocuments.map((user) => [user.email, user])
        );

        // Get seeded products
        const productDocuments = await Product.find({
            name: { $in: products.map(({ name }) => name) },
        });

        const productsByName = Object.fromEntries(
            productDocuments.map((product) => [product.name, product])
        );

        // Seed Orders
        const orderResult = await seedOrders(usersByEmail, productsByName);

        console.log('\n========== DATABASE SEEDED SUCCESSFULLY ==========');

        console.log(
            `Products: ${products.length} (${productResult.upsertedCount} added, ${productResult.modifiedCount} updated)`
        );

        console.log(
            `Users: ${demoUsers.length} (${userResult.upsertedCount} added, ${userResult.modifiedCount} updated)`
        );

        console.log(
            `Orders: 4 (${orderResult.upsertedCount} added, ${orderResult.modifiedCount} updated)`
        );

        console.log('\n========== DEMO LOGIN CREDENTIALS ==========');

        demoUsers.forEach((user) => {
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Password: ${process.env.SEED_PASSWORD || user.password}`);
            console.log(`Role: ${user.role}`);
            console.log('----------------------------------');
        });

    } catch (error) {
        console.error('Database seeding failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedDatabase();
