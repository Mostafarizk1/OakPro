import { z } from "zod";
import { normalizePhone, saudiMobile } from "./phone";


export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(120).optional().default(""),
  mobile: z.string().transform(normalizePhone).refine((v) => saudiMobile.test(v)),
  email: z.string().trim().email().max(160),
  service: z.string().trim().min(1).max(120),
  details: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(0).optional().default(""), // honeypot — must stay empty
});
export type ContactInput = z.infer<typeof contactSchema>;
