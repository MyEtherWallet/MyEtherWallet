const lokalise = (translation, string) => {
  if (process.env.VUE_APP_MODE === 'translate') {
    return `{.${string}.}`;
  }
  return translation;
};

export default lokalise;
