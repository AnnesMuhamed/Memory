/**
 * Returns a new array with the same items in random order using the Fisher-Yates algorithm.
 *
 * @template T - The type of items in the array.
 * @param items - The array to shuffle.
 * @returns A shuffled copy of the input array.
 */
export function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}
