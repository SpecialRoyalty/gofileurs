import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  BOT_TOKEN: z.string().min(10), DATABASE_URL: z.string().url(),
  MAIN_GROUP_ID: z.coerce.number().int(),
  ADMIN_IDS: z.string().transform(v => v.split(',').map(x => Number(x.trim())).filter(Number.isSafeInteger)),
  PAYPAL_URL: z.string().url().optional(), REVOLUT_URL: z.string().url().optional(),
  PAYMENT_TEXT: z.string().default('Après paiement, envoie la preuve à l’administrateur.'),
  VALIDATION_MINUTES: z.coerce.number().int().min(1).default(10),
  REISSUE_GUARANTEE_HOURS: z.coerce.number().int().min(1).default(72),
});
export const config = schema.parse(process.env);
export const isAdmin = (id?: number) => !!id && config.ADMIN_IDS.includes(id);
