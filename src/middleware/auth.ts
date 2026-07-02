import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token gerekli" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: "Geçersiz token" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).userRole !== "ADMIN") {
    return res.status(403).json({ error: "Admin yetkisi gerekli" });
  }
  next();
};