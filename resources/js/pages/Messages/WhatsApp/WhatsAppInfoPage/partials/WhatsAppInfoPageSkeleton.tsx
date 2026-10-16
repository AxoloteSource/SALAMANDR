import InfoBox from '@axolotesource/ui/components/InfoBox/InfoBox'
import { Skeleton } from '@axolotesource/ui/components/ui/skeleton'

export const WhatsAppInfoPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <InfoBox key={i}>
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-6 w-full" />
        </InfoBox>
      ))}
    </div>
  )
}
