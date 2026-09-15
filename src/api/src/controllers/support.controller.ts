import { Request, Response, NextFunction } from 'express';
import { requestSupportSchema } from '../validators/support.validator';
import * as supportService from '../services/support.service';

export async function requestSupport(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Não autenticado' });

    const parsed = requestSupportSchema.parse(req.body);
    const relationship = await supportService.requestSupport(req.userId, parsed);
    return res.status(201).json(relationship);
  } catch (error) {
    next(error);
  }
}

export async function acceptSupport(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Não autenticado' });

    const relationshipId = parseInt(req.params.id, 10);
    if (isNaN(relationshipId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const relationship = await supportService.acceptSupport(req.userId, relationshipId);
    return res.status(200).json(relationship);
  } catch (error) {
    next(error);
  }
}

export async function rejectSupport(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Não autenticado' });

    const relationshipId = parseInt(req.params.id, 10);
    if (isNaN(relationshipId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const relationship = await supportService.rejectSupport(req.userId, relationshipId);
    return res.status(200).json(relationship);
  } catch (error) {
    next(error);
  }
}

export async function listSupport(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Não autenticado' });

    const relationships = await supportService.listSupport(req.userId);
    return res.status(200).json(relationships);
  } catch (error) {
    next(error);
  }
}

export async function removeSupport(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.userId) return res.status(401).json({ message: 'Não autenticado' });

    const relationshipId = parseInt(req.params.id, 10);
    if (isNaN(relationshipId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const result = await supportService.removeSupport(req.userId, relationshipId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
