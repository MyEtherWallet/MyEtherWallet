const lokalise = (translation, string) => {
  if (import.meta.env.VITE_APP_MODE === 'translate') {
    return `{.${string}.}`;
  }
  return translation;
};

export default lokalise;
