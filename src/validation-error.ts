class ValidationError extends Error {
  constructor(message: string) {
    super(`Validation Error: ${message}`);
  }
}

export default ValidationError;
