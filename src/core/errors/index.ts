import z, { ZodError } from 'zod';

export const ErrorObject = z.object({
  error: z.string(),
});

export type ErrorType = z.infer<typeof ErrorObject>;

export function createError(error: unknown): ErrorType {
  if (error instanceof ZodError) {
    return { error: error.message };
  } else if (error instanceof Error) {
    return { error: error.message };
  } else {
    console.error('Unknown error:', error);
    return { error: 'Internal Server Error' };
  }
}
