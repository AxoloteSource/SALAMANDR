export interface IPersonalAccessTokenUser {
  id: string
  name: string
  email: string
  user_type_id: string
}

export interface IPersonalAccessToken {
  id: string
  name: string
  expires_at: string | null
  revoked: boolean
  created_at: string
  user?: IPersonalAccessTokenUser | null
}

export interface IPersonalAccessTokenCreated extends IPersonalAccessToken {
  token: string
  token_type: string
}

export interface IPersonalAccessTokenPayload {
  user_id: string
  name: string
  expires_in: number | null
}
