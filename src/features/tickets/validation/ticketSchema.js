import { z } from "zod";

export const ticketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters."),

  category: z
    .string()
    .min(1, "Please select a category."),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(1000),
});