const styles: Record<string, string> = new Proxy(
  {},
  { get: (_target, key) => String(key) }
);

export default styles;