export default {
  rest: {
    defaultLimit: 25,
    maxLimit: 25, // Capped to prevent scraping
    withCount: true,
    maxDepth: 1, // Prevent deep populate DoS
  },
};
