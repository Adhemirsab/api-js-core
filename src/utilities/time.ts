export const epochToMillis = (epoch: number) => epoch * 1000;

export const getCurrentEpoch = () => Math.floor(Date.now() / 1000);

export const minutesToSeconds = (minutes: number) => minutes * 60;
