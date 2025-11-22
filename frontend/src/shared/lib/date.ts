export function formatDateTime(value: string | number | Date) {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
