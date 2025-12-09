import { Pagination as MUIPagination, PaginationItem, Stack, Typography } from '@mui/material'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
}

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }: PaginationProps) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
      {totalItems && itemsPerPage && (
        <Typography variant="body2" color="text.secondary">
          Показано {(currentPage - 1) * (itemsPerPage) + 1}-{Math.min(currentPage * (itemsPerPage), totalItems)} из {totalItems}
        </Typography>
      )}
      <MUIPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        renderItem={(item) => <PaginationItem {...item} />}
        color="primary"
        sx={{ '& .MuiPaginationItem-root': { borderRadius: 2 } }}
      />
    </Stack>
  )
}

export default Pagination
