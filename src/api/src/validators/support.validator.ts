import { z } from 'zod';

export const requestSupportSchema = z.object({
  supporterId: z.number().int().positive('ID do apoiante deve ser um número positivo'),
});

export type RequestSupportInput = z.infer<typeof requestSupportSchema>;
