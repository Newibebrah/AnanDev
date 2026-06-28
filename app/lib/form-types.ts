export type ActionResult = {
  success: boolean;
  errors: Record<string, string[]> | null;
  message: string;
};
