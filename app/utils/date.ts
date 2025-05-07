export function getCurrentWeekDates(): { [key: string]: string } {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1; // segunda-feira
  const dates: { [key: string]: string } = {};
  const days = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today.setDate(first + i));
    dates[days[i]] = d.toISOString().split("T")[0];
  }

  return dates;
}
