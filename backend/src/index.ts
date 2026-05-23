import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import "dotenv/config"
import morgan from "morgan";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from './routes/auth.js'
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js'
import orderRoutes from './routes/orders.js'
import addressRoutes from './routes/addresses.js'
import recentlyViewedRoutes from './routes/recentlyViewed.js'
import { handleStripeWebhook } from "./controllers/orderController.js";
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.post('/api/orders/webhook', express.raw({
  type: 'application/json',
}), handleStripeWebhook);

app.use(express.json());
app.use(cookieParser());

// Setup Morgan to use Winston for HTTP request logging
const morganFormat = ":method :url :status :res[content-length] - :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      },
    },
  })
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Amozun server is running' })
})

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/recently-viewed', recentlyViewedRoutes);

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
})