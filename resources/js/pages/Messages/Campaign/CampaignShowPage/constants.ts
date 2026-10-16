export const campaignStatusColors: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-800',
  Processing: 'bg-yellow-100 text-yellow-800',
  Sending: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
  Cancelled: 'bg-gray-100 text-gray-800'
}

export const whatsappStatusColors: Record<string, string> = {
  true: 'bg-green-100 text-green-800',
  false: 'bg-red-100 text-red-800',
  unknown: 'bg-gray-100 text-gray-800'
}
