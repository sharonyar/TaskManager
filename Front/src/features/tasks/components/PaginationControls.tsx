type PaginationControlsProps = {
  pageNumber: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  onPrevious(): void
  onNext(): void
}

function PaginationControls({
  pageNumber,
  totalPages,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
      <button type="button" onClick={onPrevious} disabled={!hasPrevious}>
        Previous
      </button>
      <span>
        Page {pageNumber} / {Math.max(totalPages, 1)}
      </span>
      <button type="button" onClick={onNext} disabled={!hasNext}>
        Next
      </button>
    </nav>
  )
}

export default PaginationControls

