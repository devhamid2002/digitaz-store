import { z } from "zod";

// Phone is the OTP login identifier, so it is normalized the same way sign-in
// normalizes input before it is stored.
const phoneSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => value.replace(/[\s\-()]/g, ""))
  .refine((value) => /^\+?\d{7,15}$/.test(value));

// Shared by the edit dialog resolver and the update action so the client and
// server accept the same shape.
export const adminUserFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z
    .string()
    .trim()
    .max(190)
    .refine((value) => value === "" || z.email().safeParse(value).success),
  phone: phoneSchema,
  role: z.enum(["user", "admin"]),
});

export const adminUserUpdateSchema = adminUserFormSchema.extend({
  id: z.string().min(1),
});

export type AdminUserFormValues = z.infer<typeof adminUserFormSchema>;
export type AdminUserUpdateValues = z.infer<typeof adminUserUpdateSchema>;
