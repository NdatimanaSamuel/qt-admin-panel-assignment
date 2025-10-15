export const successResponse = (message: string, data?: any) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string) => ({
  success: false,
  message,
});
