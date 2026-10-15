import sanitizeHtml from "sanitize-html";

/** Allow only the formatting the editor produces. Strips scripts, inline styles, event handlers, etc. */
export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "br", "strong", "em", "ul", "ol", "li", "blockquote", "a", "img", "hr"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height", "loading"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] },
    transformTags: {
      a: (tag, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href ?? "") && !/^https?:\/\/(www\.)?oakpro\.sa/i.test(attribs.href ?? "");
        return { tagName: "a", attribs: { href: attribs.href ?? "#", ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } };
      },
      img: (tag, attribs) => ({ tagName: "img", attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

export const stripTags = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
export const countWords = (html: string) => { const t = stripTags(html); return t ? t.split(" ").length : 0; };
export const readingMinutes = (html: string) => Math.max(1, Math.round(countWords(html) / 200));
