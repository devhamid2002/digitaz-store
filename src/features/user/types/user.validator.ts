import { z } from "zod";

// Phone is the OTP login identifier, so it stays read-only here; changing it
// needs a fresh verification flow. An empty email clears the stored value.
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || z.email().safeParse(value).success)
    .optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
