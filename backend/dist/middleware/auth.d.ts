import type { Request, Response, NextFunction } from "express";
export interface AuthPayload {
    userId: string;
}
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map