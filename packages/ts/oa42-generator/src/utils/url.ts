const re = /%([0-9A-F]{2})/gi;

export function normalizeUrl(url: URL) {
  if (url.hash === "") {
    return new URL("#", url);
  }

  url.hash = url.hash.replaceAll(re, ($0, $1) => {
    const value = parseInt($1, 16);
    const char = String.fromCharCode(value);
    switch (char) {
      case "/":
        return $0.toUpperCase();
      default:
        return char;
    }
  });

  return url;
}
