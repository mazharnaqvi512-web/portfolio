/** Matches the Spring Boot companion API's response envelope exactly (portfolio-api's ApiResponse<T> — spec section 70). */
export interface ApiResponse<T> {
  readonly data: T;
  readonly success: boolean;
  readonly message: string | null;
  readonly errors: readonly string[] | null;
}
