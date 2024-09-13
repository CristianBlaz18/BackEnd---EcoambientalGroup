// api-key.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['api-key'];

    // Verificar si la clave API es válida
    const validApiKey = process.env.API_KEY; // Ejemplo con variable de entorno

    if (apiKey !== validApiKey) {
      return res.status(401).json({ message: 'Clave API inválida' });
    }

    next();
  }
}