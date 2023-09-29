export const getEpochFromMs = (ms: number) => Math.floor(ms / 1000);

export const getEpochFromDate = (date: Date) => getEpochFromMs(date.getTime());

export const getCurrentEpoch = () => getEpochFromDate(new Date());

export const withEpoch = (epoch: number) => ({
  addDays: (days: number) => withEpoch(epoch + days * 24 * 60 * 60),
  addWeeks: (weeks: number) => withEpoch(epoch + weeks * 7 * 24 * 60 * 60),
  addMonths: (months: number) => {
    const date = new Date(epoch * 1000);

    const dateMonth = date.getUTCMonth();

    date.setUTCMonth(dateMonth + months);

    if (date.getUTCMonth() !== (dateMonth + months) % 12) {
      date.setUTCDate(0);
    }

    return withEpoch(getEpochFromDate(date));
  },
  toEpoch: () => epoch,
});
