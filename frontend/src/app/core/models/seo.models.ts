/** Per-route SEO fields (set on Angular route `data.seo`). */
export interface RouteSeoConfig {
  readonly description: string;
  readonly canonicalPath: string;
  readonly ogImage?: string;
  readonly ogType?: string;
  readonly noindex?: boolean;
}
