/**
 * WhatsApp webhook replicate URL (HAG-35 / HAG-33 contract).
 */
export interface IReplicateUrl {
  id: number | string
  url: string
  is_active: boolean
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}
