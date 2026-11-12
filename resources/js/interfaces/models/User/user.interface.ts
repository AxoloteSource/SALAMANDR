export interface IUserRole {
  key?: string
  name?: string
}

export interface IUserType {
  id: string
  name: string
  key: string
}

export interface IUser {
  id: string | number
  name: string
  last_name_paternal?: string
  last_name_maternal?: string
  full_name?: string
  email: string
  phone?: string
  business_id?: number
  role?: IUserRole | null
  role_key?: string
  user_type_id?: string
  user_type?: IUserType | null
  user_type_name?: string | null
  banned_at?: string | null
  created_at?: string
}
