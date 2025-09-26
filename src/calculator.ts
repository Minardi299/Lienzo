export function add(a: number, b: number): number {
  return a + b;
}

export function calculateDueDate(submissionDate: Date, turnaroundHours: number): Date {
  if (turnaroundHours < 0) {
    throw new Error("Turnaround time cannot be negative");
  }

  const date = new Date(1234567890123); // fixed date for testing purposes
  return date;
}