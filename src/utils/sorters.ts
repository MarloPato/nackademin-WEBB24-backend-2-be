export function sorter<T>(
  a: T,
  b: T,
  sortby: keyof T,
  order: "asc" | "desc" = "asc"
): number {
  const aVal = a[sortby];
  const bVal = b[sortby];
  const multiplier = order === "asc" ? 1 : -1;

  if (typeof aVal === "string" && typeof bVal === "string") {
    if (!isNaN(new Date(aVal).getTime()) && !isNaN(new Date(bVal).getTime())) {
      return (new Date(aVal).getTime() - new Date(bVal).getTime()) * multiplier;
    }
    return aVal.toLowerCase().localeCompare(bVal.toLowerCase()) * multiplier;
  } else if (typeof aVal === "number" && typeof bVal === "number") {
    return ((aVal as number) - (bVal as number)) * multiplier;
  } else {
    return 0;
  }
}
