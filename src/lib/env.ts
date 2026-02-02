// Helper to safely access environment variables
export const getEnv = () => {
  return {
    baseUrl: import.meta.env.MINTLIFY_API_BASE_URL,
  };
};
