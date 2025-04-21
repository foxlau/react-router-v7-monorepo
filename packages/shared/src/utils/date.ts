/**
 * Date utility functions
 */
import { format, formatDistance, formatRelative, parseISO } from "date-fns";

/**
 * Format a date with a specified format string
 */
export function formatDate(
  date: Date | string,
  formatString = "yyyy-MM-dd",
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatString);
}

/**
 * Format a date relative to the current time
 * @example "5 minutes ago", "yesterday", etc.
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatRelative(dateObj, new Date());
}

/**
 * Format the distance between two dates
 * @example "5 minutes", "about 1 month", etc.
 */
export function formatTimeDistance(
  dateLeft: Date | string,
  dateRight: Date | string = new Date(),
): string {
  const dateLeftObj =
    typeof dateLeft === "string" ? parseISO(dateLeft) : dateLeft;
  const dateRightObj =
    typeof dateRight === "string" ? parseISO(dateRight) : dateRight;

  return formatDistance(dateLeftObj, dateRightObj, { addSuffix: true });
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}
