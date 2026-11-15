import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { formUrlQuery } from "@/lib/utils";

type QueryParams = Record<string, string | string[] | null | undefined>;

type PaginationLabels = {
  pagination: string;
  previous: string;
  next: string;
  more: string;
  page: string;
};

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: QueryParams;
  labels: PaginationLabels;
};

const ELLIPSIS = "ellipsis";

type PageItem = number | typeof ELLIPSIS;

const DISABLED_LINK_CLASS =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-gray-300 dark:text-gray-600";

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, ELLIPSIS, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      ELLIPSIS,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    ELLIPSIS,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    ELLIPSIS,
    totalPages,
  ];
}

function pageHref(basePath: string, query: QueryParams, page: number) {
  return formUrlQuery({
    params: query,
    key: "page",
    value: page === 1 ? null : String(page),
    basePath,
  });
}

export default function DynamicPagination({
  currentPage,
  totalPages,
  basePath,
  query = {},
  labels,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageItems(currentPage, totalPages);

  return (
    <Pagination aria-label={labels.pagination}>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationLink
              href={pageHref(basePath, query, currentPage - 1)}
              size="default"
              aria-label={labels.previous}
              className="gap-1.5 px-2.5"
            >
              <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
              <span className="hidden sm:inline">{labels.previous}</span>
            </PaginationLink>
          ) : (
            <span aria-disabled="true" className={DISABLED_LINK_CLASS}>
              <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
              <span className="hidden sm:inline">{labels.previous}</span>
            </span>
          )}
        </PaginationItem>

        {pages.map((page, index) =>
          page === ELLIPSIS ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis label={labels.more} />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={pageHref(basePath, query, page)}
                isActive={page === currentPage}
                aria-label={`${labels.page} ${page}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationLink
              href={pageHref(basePath, query, currentPage + 1)}
              size="default"
              aria-label={labels.next}
              className="gap-1.5 px-2.5"
            >
              <span className="hidden sm:inline">{labels.next}</span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 rtl:rotate-180"
              />
            </PaginationLink>
          ) : (
            <span aria-disabled="true" className={DISABLED_LINK_CLASS}>
              <span className="hidden sm:inline">{labels.next}</span>
              <ChevronRight
                aria-hidden="true"
                className="size-4 rtl:rotate-180"
              />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
