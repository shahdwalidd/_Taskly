import { z } from "zod";

export const epicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .optional(),

  assignee_id: z
    .string()
    .optional(),

  deadline: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;

        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        return date >= todayString;
      },
      {
        message: "Deadline cannot be before today",
      },
    ),
});

export type EpicFormValues = z.infer<typeof epicSchema>;