import { Skeleton } from '@/components/ui/skeleton'

interface LoadingStateProps {
  variant: 'table' | 'cards' | 'list'
  rows?: number
}

export default function LoadingState({ variant, rows = 6 }: LoadingStateProps) {
  if (variant === 'table') {
    return (
      <div style={{ padding: '1.5rem' }}>
        {/* header row */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        {/* data rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderTop: '1px solid #f3f4f6',
            }}
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'cards') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
          padding: '1.5rem',
        }}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: '0.75rem',
              padding: '1.25rem',
            }}
          >
            <Skeleton className="h-4 w-16 mb-3" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  // list
  return (
    <div style={{ padding: '1.5rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 0',
            borderTop: i === 0 ? 'none' : '1px solid #f3f4f6',
          }}
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div style={{ flex: 1 }}>
            <Skeleton className="h-4 w-40 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}