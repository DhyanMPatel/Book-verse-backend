import { razorpay } from '../config/razorPay.js';
import APIResponse from '../utils/APIResponse.js';
import crypto from 'crypto';
import OrderModal from '../modal/orderModel.js';
import CartModal from '../modal/cartModel.js';

export const createOrderController = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { cartItems, totalAmount } = req.body;

        const totalAmountNum = Number(totalAmount);
        if (!userId || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || !Number.isFinite(totalAmountNum) || totalAmountNum <= 0) {
            return APIResponse.errorResponse(res, "Missing/invalid required fields: userId, cartItems, totalAmount", 400);
        }

        const options = {
            amount: Math.round(totalAmountNum * 100), // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Save pending order to DB
        const newOrder = new OrderModal({
            userId,
            razorpayOrderId: order.id,
            totalAmount: totalAmountNum,
            currency: order.currency || "INR",
            status: "pending",
            items: cartItems.map(item => ({
                bookId: item.bookId,
                title: item.title,
                price: item.price,
                quantity: item.quantity
            }))
        });
        await newOrder.save();

        return APIResponse.successResponse(res, {
            orderId: order.id,
            amount: order.amount,              // paise
            currency: order.currency || "INR",
            amountInRupees: Number((order.amount / 100).toFixed(2)),
            razorpayOrderId: order.id
        }, "Order created successfully", 200);
    } catch (err) {
        console.error("Order creation error:", err);
        return APIResponse.errorResponse(res, "Internal server error during order creation", 500)
    }
}

export const getUserOrdersController = async (req, res) => {
    try {
        const orders = await OrderModal.find()
            .populate("userId", "name email phone")
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map(order => ({
            id: order._id,
            razorpayOrderId: order.razorpayOrderId,
            razorpayPaymentId: order.razorpayPaymentId,
            totalAmount: order.totalAmount,
            currency: order.currency || "INR",
            status: order.status,
            user: {
                id: order.userId?._id,
                name: order.userId?.name,
                email: order.userId?.email,
                phone: order.userId?.phone
            },
            items: order.items?.map(item => ({
                bookId: item.bookId,
                title: item.title,
                price: item.price,
                quantity: item.quantity
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        APIResponse.successResponse(res, formattedOrders, "Orders fetched successfully", 200);
    } catch (err) {
        console.error("Get orders error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
}

export const getUserOrdersByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params; // or req.user._id if using auth middleware

        const orders = await OrderModal.find({ userId })
            .populate("userId", "name email phone")
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return APIResponse.successResponse(res, [], "No orders found for this user", 200);
        }

        const formattedOrders = orders.map(order => ({
            id: order._id,
            razorpayOrderId: order.razorpayOrderId,
            razorpayPaymentId: order.razorpayPaymentId,
            totalAmount: order.totalAmount,
            currency: order.currency || "INR",
            status: order.status,
            user: {
                id: order.userId?._id,
                name: order.userId?.name,
                email: order.userId?.email,
                phone: order.userId?.phone
            },
            items: order.items?.map(item => ({
                bookId: item.bookId,
                title: item.title,
                price: item.price,
                quantity: item.quantity
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        }));

        APIResponse.successResponse(res, formattedOrders, "User orders fetched successfully", 200);

    } catch (err) {
        console.error("Get user orders error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};

export const verifyPaymentController = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_payment_id || !razorpay_signature) {
            return APIResponse.errorResponse(res, "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature", 400);
        }

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return APIResponse.errorResponse(res, "Payment verification failed", 400);
        }

        const order = await OrderModal.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                status: "paid"
            },
            { new: true }
        );

        if (!order) {
            return APIResponse.errorResponse(res, "Order not found", 404);
        }

        await CartModal.deleteOne({ userId: order.userId });

        return APIResponse.successResponse(res, {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            status: "paid"
        }, "Payment verified successfully", 200);

    } catch (err) {
        console.error("Payment verification error:", err);
        return APIResponse.errorResponse(res, "Internal server error during payment verification", 500);
    }
}

export const razorpayWebhookController = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("Razorpay webhook secret not configured");
            return APIResponse.errorResponse(res, "Webhook secret not configured", 500);
        }

        const signature = req.headers['x-razorpay-signature'];
        if (!signature) {
            return APIResponse.errorResponse(res, "Missing Razorpay signature", 400);
        }

        const payloadString = Buffer.isBuffer(req.body)
            ? req.body.toString('utf8')
            : (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(payloadString)
            .digest('hex');

        if (expectedSignature !== signature) {
            console.error("Webhook signature mismatch", { expectedSignature, signature });
            return APIResponse.errorResponse(res, "Invalid webhook signature", 400);
        }

        const parsedBody = Buffer.isBuffer(req.body)
            ? JSON.parse(payloadString)
            : (typeof req.body === 'string' ? JSON.parse(payloadString) : req.body);

        const event = parsedBody.event;
        const payment = parsedBody?.payload?.payment?.entity;
        const orderId = payment?.order_id;

        if (!orderId) {
            return APIResponse.errorResponse(res, "Missing order id in webhook event", 400);
        }

        let statusUpdate;
        if (event === 'payment.captured') {
            statusUpdate = { status: 'completed' };
        } else if (event === 'payment.failed') {
            statusUpdate = { status: 'failed' };
        } else {
            // Support other events as needed
            statusUpdate = null;
        }

        if (statusUpdate) {
            await OrderModal.findOneAndUpdate(
                { razorpayOrderId: orderId },
                {
                    ...statusUpdate,
                    razorpayPaymentId: payment?.id || undefined,
                },
                { new: true }
            );
        }

        return APIResponse.successResponse(res, { event, orderId }, "Webhook processed", 200);
    } catch (err) {
        console.error("Webhook processing error:", err);
        return APIResponse.errorResponse(res, "Internal server error during webhook processing", 500);
    }
}

export const getUserPurchasedBooksController = async (req, res) => {
    try {
        const { userId } = req.params;  // 👈 from URL now

        const orders = await OrderModal.find({
            userId,
            status: { $in: ["paid", "completed"] }
        });

        if (!orders || orders.length === 0) {
            return APIResponse.successResponse(res, {
                userId,
                purchasedBooks: []
            }, "No purchased books found", 200);
        }

        const purchasedBooks = orders.flatMap(order =>
            order.items.map(item => ({
                bookId: item.bookId
            }))
        );

        return APIResponse.successResponse(res, {
            userId,
            totalBooks: purchasedBooks.length,
            purchasedBooks
        }, "Purchased books fetched successfully", 200);

    } catch (err) {
        console.error("Get purchased books error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};

// GET /admin/orders/:id  — Get single order detail (Admin)
export const getOrderByIdAdminController = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await OrderModal.findById(id)   // ← No userId filter, admin can see any order
            .populate("userId", "name email")
            .populate("items.bookId", "title");

        if (!order) {
            return APIResponse.errorResponse(res, "Order not found", 404);
        }

        const formattedOrder = {
            id: order._id,
            razorpayOrderId: order.razorpayOrderId,
            razorpayPaymentId: order.razorpayPaymentId,
            razorpaySignature: order.razorpaySignature,
            status: order.status,
            totalAmount: order.totalAmount,
            currency: order.currency || "INR",
            userId: {
                _id: order.userId?._id,
                name: order.userId?.name,
                email: order.userId?.email,
            },
            items: order.items?.map((item) => ({
                bookId: item.bookId?._id || item.bookId,
                title: item.bookId?.title || item.title || "Unknown Book",
                price: item.price,
                quantity: item.quantity || 1,
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };

        return APIResponse.successResponse(
            res,
            { order: formattedOrder },
            "Order fetched successfully",
            200
        );
    } catch (err) {
        console.error("Get order by ID error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};



//dashboard controllers for admin analytics
export const getTotalRevenueController = async (req, res) => {
    try {
        // Fetch all paid and completed orders
        const paidOrders = await OrderModal.find({
            status: { $in: ["paid", "completed"] }
        }).select('totalAmount createdAt');

        // Calculate total revenue
        const totalRevenue = paidOrders.reduce((sum, order) => {
            return sum + (order.totalAmount || 0);
        }, 0);

        // Calculate this month's revenue
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyRevenue = paidOrders
            .filter(order => new Date(order.createdAt) >= startOfMonth)
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Calculate last month's revenue for comparison
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const lastMonthRevenue = paidOrders
            .filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
            })
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // Calculate growth percentage
        const growthPercentage = lastMonthRevenue > 0
            ? (((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
            : 100;

        return APIResponse.successResponse(res, {
            totalRevenue: Math.round(totalRevenue),
            monthlyRevenue: Math.round(monthlyRevenue),
            lastMonthRevenue: Math.round(lastMonthRevenue),
            growthPercentage: parseFloat(growthPercentage),
            totalOrders: paidOrders.length,
            currency: "INR"
        }, "Total revenue fetched successfully", 200);

    } catch (err) {
        console.error("Get total revenue error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};

// ✅ NEW: Get Weekly Sales (Last 7 Days)
export const getWeeklySalesController = async (req, res) => {
    try {
        // Fetch all paid orders
        const paidOrders = await OrderModal.find({
            status: { $in: ["paid", "completed"] }
        }).select('totalAmount createdAt items');

        // Calculate last 7 days sales
        const today = new Date();
        const weeklyData = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            // Filter orders for this specific day
            const dayOrders = paidOrders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= date && orderDate < nextDate;
            });

            // Calculate revenue and orders count for this day
            const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
            const dayOrdersCount = dayOrders.length;

            // Calculate books sold
            const booksSold = dayOrders.reduce((total, order) => {
                return total + (order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0);
            }, 0);

            weeklyData.push({
                day: dayNames[date.getDay()],
                date: date.toISOString().split('T')[0],
                revenue: Math.round(dayRevenue),
                orders: dayOrdersCount,
                booksSold: booksSold
            });
        }

        // Calculate weekly totals
        const weeklyRevenue = weeklyData.reduce((sum, day) => sum + day.revenue, 0);
        const weeklyOrders = weeklyData.reduce((sum, day) => sum + day.orders, 0);
        const weeklyBooksSold = weeklyData.reduce((sum, day) => sum + day.booksSold, 0);

        // Calculate previous week for comparison
        const previousWeekStart = new Date(today);
        previousWeekStart.setDate(previousWeekStart.getDate() - 13);
        previousWeekStart.setHours(0, 0, 0, 0);

        const previousWeekEnd = new Date(today);
        previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);
        previousWeekEnd.setHours(0, 0, 0, 0);

        const previousWeekRevenue = paidOrders
            .filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= previousWeekStart && orderDate < previousWeekEnd;
            })
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const weekOverWeekGrowth = previousWeekRevenue > 0
            ? (((weeklyRevenue - previousWeekRevenue) / previousWeekRevenue) * 100).toFixed(1)
            : 100;

        return APIResponse.successResponse(res, {
            weeklyData: weeklyData,
            summary: {
                totalRevenue: weeklyRevenue,
                totalOrders: weeklyOrders,
                totalBooksSold: weeklyBooksSold,
                averageDailyRevenue: Math.round(weeklyRevenue / 7),
                averageOrderValue: weeklyOrders > 0 ? Math.round(weeklyRevenue / weeklyOrders) : 0,
                weekOverWeekGrowth: parseFloat(weekOverWeekGrowth),
                currency: "INR"
            }
        }, "Weekly sales fetched successfully", 200);

    } catch (err) {
        console.error("Get weekly sales error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};

// ✅ Get Analytics Dashboard - Top Performers (Most Read & Top Earning Books)
export const getAnalyticsDashboardController = async (req, res) => {
    try {
        // Fetch all paid and completed orders with populated book details
        const orders = await OrderModal.find({
            status: { $in: ["paid", "completed"] }
        }).select('items').populate({
            path: 'items.bookId',
            select: 'title author price'
        });

        // Initialize tracking maps
        const bookMetrics = new Map();

        // Process all orders and aggregate metrics
        orders.forEach(order => {
            order.items?.forEach(item => {
                const bookId = item.bookId?._id?.toString();
                const bookTitle = item.bookId?.title;

                if (bookId && bookTitle) {
                    // Get or create book metrics entry
                    if (!bookMetrics.has(bookId)) {
                        bookMetrics.set(bookId, {
                            id: bookId,
                            title: bookTitle,
                            totalReads: 0,
                            totalRevenue: 0
                        });
                    }

                    const metrics = bookMetrics.get(bookId);

                    // Update reads (quantity sold = times read)
                    metrics.totalReads += (item.quantity || 1);

                    // Update revenue
                    const itemRevenue = (item.price || 0) * (item.quantity || 1);
                    metrics.totalRevenue += itemRevenue;
                }
            });
        });

        // Convert Map to Array for sorting
        const metricsArray = Array.from(bookMetrics.values());

        // Get Top 5 Most Read Books
        const mostReadBooks = [...metricsArray]
            .sort((a, b) => b.totalReads - a.totalReads)
            .slice(0, 5)
            .map((book, index) => ({
                rank: index + 1,
                title: book.title,
                readCount: book.totalReads
            }));

        // Get Top 5 Earning Books
        const topEarningBooks = [...metricsArray]
            .sort((a, b) => b.totalRevenue - a.totalRevenue)
            .slice(0, 5)
            .map((book, index) => ({
                rank: index + 1,
                title: book.title,
                revenue: Math.round(book.totalRevenue)
            }));

        // Calculate summary statistics
        const totalBooksAnalyzed = metricsArray.length;
        const totalReadCount = metricsArray.reduce((sum, book) => sum + book.totalReads, 0);
        const totalBookRevenue = metricsArray.reduce((sum, book) => sum + book.totalRevenue, 0);

        return APIResponse.successResponse(res, {
            topPerformers: {
                mostReadBooks,
                topEarningBooks
            },
            summary: {
                totalBooksAnalyzed,
                totalReadCount,
                totalBookRevenue: Math.round(totalBookRevenue),
                currency: "INR"
            }
        }, "Analytics dashboard data fetched successfully", 200);

    } catch (err) {
        console.error("Get analytics dashboard error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};

export const getUserStatsController = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Fetching stats for userId:", userId);

        // ✅ Your Order schema uses "userId" not "user"
        const orders = await OrderModal.countDocuments({ userId: userId });
        console.log("Orders found:", orders);

        // ✅ Your Wishlist schema — check it uses "userId" too
        const wishlist = await WishlistModal.findOne({ userId: userId });
        const wishlistCount = wishlist?.books?.length || 0;

        // ✅ Your Cart schema uses "userId"
        const cart = await CartModal.findOne({ userId: userId });
        const cartCount = cart?.items?.length || 0;


        return APIResponse.successResponse(
            res,
            {
                orders,
                wishlist: wishlistCount,
                cart: cartCount,
            },
            "User stats fetched successfully",
            200
        );
    } catch (error) {
        console.error("User stats error:", error);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};

// GET /admin/orders  — Get ALL orders (Admin only)
export const getAllOrdersAdminController = async (req, res) => {
    try {
        const orders = await OrderModal.find()
            .populate("userId", "name email")
            .populate("items.bookId", "title")
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return APIResponse.successResponse(res, { orders: [] }, "No orders found", 200);
        }

        const formattedOrders = orders.map((order) => ({
            id: order._id,
            razorpayOrderId: order.razorpayOrderId,
            razorpayPaymentId: order.razorpayPaymentId,
            razorpaySignature: order.razorpaySignature,
            status: order.status,
            totalAmount: order.totalAmount,
            currency: order.currency || "INR",
            userId: {
                _id: order.userId?._id,
                name: order.userId?.name,
                email: order.userId?.email,
            },
            items: order.items?.map((item) => ({
                bookId: item.bookId?._id || item.bookId,
                title: item.bookId?.title || item.title || "Unknown Book",
                price: item.price,
                quantity: item.quantity || 1,
            })),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        }));

        return APIResponse.successResponse(
            res,
            { orders: formattedOrders },
            "All orders fetched successfully",
            200
        );
    } catch (err) {
        console.error("Get all orders error:", err);
        return APIResponse.errorResponse(res, "Internal server error", 500);
    }
};


// Admin routes (protect with both authMiddleware + adminMiddleware)