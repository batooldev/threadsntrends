import express, { Request, Response } from 'express';
import Cart from '@/lib/cart';

const router = express.Router();

// Add item to cart
router.post('/', async (req: Request, res: Response) => {
    try {
        const cartItem = new Cart(req.body);
        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (error: unknown) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Get all cart items for a user
router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const cartItems = await Cart.find({ userId: req.params.userId }).populate('productId');
        res.json(cartItems);
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Update cart item
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const updatedCartItem = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCartItem);
    } catch (error: unknown) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Delete cart item
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed from cart' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;