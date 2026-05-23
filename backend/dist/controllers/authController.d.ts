import type { Request, Response } from "express";
export declare const sendSigupOTP: (req: Request, res: Response) => Promise<void>;
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const logout: (_req: Request, res: Response) => void;
export declare const getMe: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map