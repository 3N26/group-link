import { watch } from 'fs';
import { build } from './build';
import { join } from 'path';

type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> {
  let timerId: Timer;

  const debounced: DebouncedFunction<T> = function (...args: Parameters<T>) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };

  debounced.cancel = function () {
    clearTimeout(timerId);
  };

  return debounced;
}

const srcWatcher = watch(
  join(import.meta.dir, '..', 'src'),
  { recursive: true },
  debounce(async (event, filename) => {
    console.log(`Detected ${event} in ${filename} (src)`);
    await build();
    console.log(`Rebuild done`);
    setTimeout(() => {
      process.stdout.write('\x1B[2J\x1B[0f');
    }, 300);
  }, 100)
);

process.on('SIGINT', () => {
  srcWatcher.close();
  process.exit(0);
});
