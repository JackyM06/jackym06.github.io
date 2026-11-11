// IDs preserve the original date/title permalink, including case and Chinese.
// Optional arguments keep upstream AstroPaper components compatible.
export function getPostSlug(id: string, _filePath?: string): string {
  return id;
}

export function getPostUrl(id: string, _filePath?: string, _locale?: string): string {
  return `/${id}/`;
}
