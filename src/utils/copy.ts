function copyValue(value: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    navigator.clipboard.writeText(value).then(resolve).catch(reject);
  });
}

export default copyValue;
