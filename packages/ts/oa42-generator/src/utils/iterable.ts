export function* joinIterable<T, G>(iterable: Iterable<T>, glue: G): Iterable<T | G> {
  let count = 0;
  for (const item of iterable) {
    if (count > 0) {
      yield glue;
    }
    yield item;
    count++;
  }
}

export function* mapIterable<T, R>(iterable: Iterable<T>, mapper: (item: T) => R): Iterable<R> {
  for (const item of iterable) {
    yield mapper(item);
  }
}

export function* splitIterableText(texts: Iterable<string>, separator = /\r?\n/): Iterable<string> {
  let buffer = "";

  for (const text of texts) {
    buffer += text;

    yield* flush();
  }

  if (buffer.length > 0) {
    yield buffer;
  }

  function* flush() {
    while (true) {
      const match = separator.exec(buffer);
      if (!match) break;

      const line = buffer.substring(0, match.index);
      buffer = buffer.substring(match.index + match[0].length);

      yield line;
    }
  }
}
