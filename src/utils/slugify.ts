import taxonomy from "@/data/taxonomy.json";

const legacySlugs: Record<string, string> = { ...taxonomy.tags, ...taxonomy.categories };
export const slugifyStr = (value: string): string =>
  legacySlugs[value] ?? value.trim().replace(/[.\s]+/g, "-");
export const slugifyAll = (values: string[]) => values.map(slugifyStr);
