export function add(a: number, b: number): number {
  return a + b;
}

const WORK_START = 9;
const WORK_END = 17;
export function calculateDueDate(submissionDate: Date, turnaroundHours: number): Date {

  let current = new Date(submissionDate);
  let minutesLeft = turnaroundHours * 60;

  while (minutesLeft > 0) {
    // End of the current working day
    const endOfDay = new Date(current);
    endOfDay.setHours(WORK_END, 0, 0, 0);

    // How many working minutes remain today?
    const minutesRemainingToday = (endOfDay.getTime() - current.getTime()) / 60000;

    // Can finish today
    if (minutesLeft <= minutesRemainingToday) {
      current = new Date(current.getTime() + minutesLeft * 60000);
      minutesLeft = 0;
    } 
    // Use up today minutes and move to next working day
    else {
      minutesLeft -= minutesRemainingToday;
      current = moveToNextWorkingDayStart(current, WORK_START);
    }
  }



  return current;
}

function moveToNextWorkingDayStart(date: Date, workStartHour: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  next.setHours(workStartHour, 0, 0, 0);

  // Skip weekends
  const day = next.getDay(); // 0 is Sunday, 6 is Saturday
  if (day === 6) {
    next.setDate(next.getDate() + 2);
  } else if (day === 0) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}