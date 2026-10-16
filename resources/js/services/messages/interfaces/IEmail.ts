export interface IEmailVariable {
  id: string
  name: string
  position: number
  example_value: string | null
}

export interface IEmail {
  id: string
  name: string
  description: string | null
  view_path: string
  subject: string | null
  variables: IEmailVariable[]
  created_at: string
}
