export const epochToMillis = (epoch: number) => epoch * 1000;

export const epochToUTC = (epoch: number) => {
  const date = new Date(epoch * 1000);

  const seconds = date.getUTCSeconds();
  const minutes = date.getUTCMinutes();
  const hours = date.getUTCHours();
  const dayOfTheWeek = date.getUTCDay() + 1;
  const dayOfTheMonth = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return { year, month, dayOfTheMonth, dayOfTheWeek, hours, minutes, seconds };
};
