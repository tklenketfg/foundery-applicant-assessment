import { z } from "zod";

export const stepOneSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  location: z.string().min(2),
  linkedin: z.string().url().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  referral: z.string().optional()
});

export const submissionSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  location: z.string().min(2),
  linkedin: z.string().optional(),
  resumeUrl: z.string().optional(),
  referral: z.string().optional(),
  answers: z.object({
    screening: z.array(z.string().min(10)).length(5),
    miniCase: z.object({
      next10: z.string().min(10),
      next2h: z.string().min(10),
      nextWeek: z.string().min(10),
      metrics: z.string().min(10)
    }),
    writing: z.object({
      teamsMessage: z.string().min(10),
      patientEmail: z.string().min(10)
    })
  }),
  confirmNoPhi: z.literal(true),
  confirmOriginal: z.literal(true)
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
