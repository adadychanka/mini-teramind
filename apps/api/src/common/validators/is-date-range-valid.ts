/**
 * Validates if the date range is valid.
 * @param from - The start date
 * @param to - The end date
 * @returns True if the date range is valid, false otherwise
 * @returns True if either the start date or the end date is not provided
 */
export function isDateRangeValid(from: string | undefined, to: string | undefined): boolean {
  if (!from || !to) {
    return true;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  return fromDate <= toDate;
}
