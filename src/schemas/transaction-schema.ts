import { z } from "zod";

// src/schemas/transaction-schema.ts
const baseFields = {
  reference: z.string().min(1, "Reference is a required field"),
  value: z
    .string()
    .min(1, "Value is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Value must be positive",
    }),
  currency: z.string().min(1, "Currency is a required field"),
  category_id: z.string().min(1, "Category is a required field"),
};

export const incomingSchema = z.object({
  ...baseFields,
  origin: z.string().min(1, "Origin is a required field"),
});

export const expenseSchema = z.object({
  ...baseFields,
  destination: z.string().min(1, "Destination is a required field"),
});

export type IncomingFormValues = z.infer<typeof incomingSchema>;
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
export type TransactionFormValues = IncomingFormValues | ExpenseFormValues;
