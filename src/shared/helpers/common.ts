export function generateRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomItems<T>(items: T[], count?: number): T[] {
  if (count) {
    const shuffled = [...items].sort(() => 0.5 - Math.random());

    return shuffled.slice(0, Math.min(count, items.length));
  }

  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition =
    startPosition + generateRandomValue(startPosition, items.length);

  return items.slice(startPosition, endPosition);
}
