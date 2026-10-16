export interface IUserRole {
  key?: string
  name?: string
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
}
