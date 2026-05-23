import type { Request, Response } from "express";
export declare const getOrCreateCart: (userId: string) => Promise<{
    id: string;
    user_id: string;
    updated_at: Date;
}>;
export declare const getCart: (req: Request, res: Response) => Promise<void>;
export declare const addToCart: (req: Request, res: Response) => Promise<void>;
export declare const updateCartItem: (req: Request, res: Response) => Promise<void>;
export declare const removeFromCart: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cartController.d.ts.map