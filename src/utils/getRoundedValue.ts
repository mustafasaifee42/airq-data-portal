export const getRoundedValue = (value: number) => {
    const roundedValue  = Math.floor(value * 10) / 10 + 0.05;
    return Math.round(roundedValue * 100) / 100;
}