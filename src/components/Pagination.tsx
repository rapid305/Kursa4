import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}: PaginationProps) => {
  const getPageNumbers = (): Array<number | '...'> => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: Array<number | '...'> = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      const last = rangeWithDots[rangeWithDots.length - 1]
      if (rangeWithDots.length > 0 && last !== '...') {
        if (typeof last === 'number' && i - last === 2) {
          rangeWithDots.push((last as number) + 1)
        } else if (typeof last === 'number' && i - last !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
    })

    return rangeWithDots
  }

  return (
    <div className="pagination">
      {totalItems && itemsPerPage && (
        <span className="pagination-info">
          Показано {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
        </span>
      )}

      <div className="pagination-controls">
        <button
          className="pagination-btn pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Предыдущая страница"
        >
          ← Назад
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-number ${
                page === currentPage ? 'active' : ''
              } ${page === '...' ? 'dots' : ''}`}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              title={typeof page === 'number' ? `Страница ${page}` : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="pagination-btn pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Следующая страница"
        >
          Далее →
        </button>
      </div>
    </div>
  )
}

export default Pagination
