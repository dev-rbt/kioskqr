export class MenuFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuFetchError';
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof MenuFetchError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return `Bir hata oluştu: ${error.message}`;
  }
  
  return 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
}
