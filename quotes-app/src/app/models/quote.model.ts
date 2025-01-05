export interface Quote {
  id?: number; // No sé si lo ocupe en la base de datos SQLite (queda opcional).
  quote: string;
  author: string;
}
