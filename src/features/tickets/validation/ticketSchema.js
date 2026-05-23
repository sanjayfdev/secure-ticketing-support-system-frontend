import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "image/*",
  "application/pdf",
  ".doc",
  ".docx",
  ".txt",
];

export const CATEGORIES = [
  "Technical",
  "Payment",
  "Course",
  "Certificate",
  "General",
];

export const ticketSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required.")
    .min(5, "Subject must be at least 5 characters.")
    .max(120, "Subject must be under 120 characters."),

  category: z
    .string()
    .min(1, "Please select a category.")
    .refine((val) => CATEGORIES.includes(val), "Invalid category selected."),

  description: z
    .string()
    .min(1, "Description is required.")
    .min(20, "Description must be at least 20 characters.")
    .max(1000, "Description must be under 1000 characters."),

  attachment: z
    .custom()
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "File must be under 5MB.",
    ),
});
