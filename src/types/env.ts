export interface EnvPayload {
  PORT: number

  DATABASE_URL: string

  JWT_ACCESS_TOKEN_SECRET: string
  JWT_ACCESS_TOKEN_EXPIRE: string
  JWT_REFRESH_TOKEN_SECRET: string
  JWT_REFRESH_TOKEN_EXPIRE: string

  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string

  GOOGLE_TRANSLATE_API_KEY: string
}
