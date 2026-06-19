import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function getPageButtons(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | "...")[] = [1]
  if (currentPage > 3) pages.push("...")
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage < totalPages - 2) pages.push("...")
  pages.push(totalPages)
  return pages
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  itemLabel?: string
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = "item",
}: PaginationProps) {
  if (totalPages <= 1) return null

  const showFrom = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const showTo = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-slate-100 gap-3">
      <span className="text-xs text-slate-400 font-semibold">
        Menampilkan <span className="text-slate-700">{showFrom}</span>&ndash;{" "}
        <span className="text-slate-700">{showTo}</span> dari{" "}
        <span className="text-slate-700 font-bold">{totalItems}</span> {itemLabel}
      </span>
      <div className="flex gap-1 items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {getPageButtons(currentPage, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`d${i}`} className="text-slate-400 px-1 text-xs">
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(p as number)}
              aria-label={`Halaman ${p}`}
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export { Pagination, getPageButtons }
