"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
} from "@heroui/react";

// Helper to access nested fields like "client.name"
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

export default function TableData({
  column = [],
  data = [],
  page = 1, // controlled page
  totalPages = 1, // from backend (last_page)
  onPageChange,           // callback to change page
  renderCell,             // optional
  renderActions,          // optional
	classNames = "",
	paginationColor = 'primary',
}) {
	// --- sorting state ---
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: null,
    direction: "ascending",
  });
  // Build the columns array HeroUI expects, including optional actions col
  const columns = React.useMemo(() => {
    const base = Array.isArray(column) ? column : [];
    if (!renderActions) return base;

    return [
      ...base,
      { key: "__actions", label: "Actions" },
    ];
  }, [column, renderActions]);

  // Default fallback cell rendering
  const defaultRenderCell = (item, columnKey) => {
    // Handle nested like "client.name"
    const nested = getNestedValue(item, columnKey);
    if (nested !== undefined) return nested;

    // Fallback to HeroUI helper
    return getKeyValue(item, columnKey);
  };

	// --- apply sorting on the current data page ---
  const sortedItems = React.useMemo(() => {
    if (!sortDescriptor?.column) return data;

    const { column: sortCol, direction } = sortDescriptor;

    // Don't try to sort the actions pseudo-column
    if (sortCol === "__actions") return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = getNestedValue(a, sortCol) ?? getKeyValue(a, sortCol);
      const bVal = getNestedValue(b, sortCol) ?? getKeyValue(b, sortCol);

      // normalize for string / number compare
      const av = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const bv = typeof bVal === "string" ? bVal.toLowerCase() : bVal;

      if (av == null && bv == null) return 0;
      if (av == null) return -1;
      if (bv == null) return 1;

      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });

    return direction === "descending" ? sorted.reverse() : sorted;
  }, [data, sortDescriptor]);

  return (
    <Table
      aria-label="Reusable table with pagination"
			className={classNames}
			sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls  // 👈 adds next/prev buttons
            showShadow
            color={paginationColor}
            page={page}
            total={totalPages}
            onChange={onPageChange}  // 👈 this will trigger React Query
          />
        </div>
      }
      classNames={{
        wrapper: "min-h-[222px] border border-slate-200 rounded-xl shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]",
        th: "bg-slate-50 text-slate-600",
        td: "text-slate-700",
      }}
    >
      <TableHeader columns={columns}>
        {(col) => (
          <TableColumn key={col.key} allowsSorting={col.allowsSorting ?? false}>
            {col.label}
          </TableColumn>
        )}
      </TableHeader>

      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow key={item.id ?? item.key}>
            {(columnKey) => {
              if (columnKey === "__actions") {
                return (
                  <TableCell>
                    {renderActions?.(item)}
                  </TableCell>
                );
              }

              const content = renderCell
                ? renderCell(item, columnKey)
                : defaultRenderCell(item, columnKey);

              return <TableCell>{content}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
