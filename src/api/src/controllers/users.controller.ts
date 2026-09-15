import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function searchUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.query.email as string | undefined;

    if (!email || email.trim().length === 0) {
      return res.status(400).json({ message: 'O parâmetro email é obrigatório' });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: { contains: email.trim() },
      },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}
