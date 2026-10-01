/**
 * Answer Grounding — deterministic, LLM-free grounding check.
 *
 * Copied from Metaism/backend/src/services/answerGroundingService.ts
 * (2026-08-21). Pure functions only — no DB, no network.
 *
 * Used by THE MODEL as the Verify / "is this claim about this environment?"
 * primitive. Not wired into Act I; vendored now so Act V can import it.
 */

export interface GroundingSource {
  text?: string | null;
  content?: string | null;
}

export interface AnswerGroundingOptions {
  supportRatio?: number;
  minTokenHits?: number;
}

export interface AnswerGroundingResult {
  groundingScore: number;
  claimSentenceCount: number;
  ungroundedSentenceCount: number;
  ungroundedSentences: string[];
}

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "than", "that", "this", "these", "those",
  "is", "are", "was", "were", "be", "been", "being", "am", "to", "of", "in", "on", "at", "by",
  "for", "with", "as", "from", "into", "about", "over", "after", "before", "between", "through",
  "it", "its", "they", "them", "their", "he", "she", "his", "her", "we", "our", "you", "your",
  "i", "me", "my", "not", "no", "do", "does", "did", "can", "could", "would", "should", "may",
  "might", "must", "will", "shall", "have", "has", "had", "which", "who", "whom", "whose", "what",
  "when", "where", "why", "how", "there", "here", "also", "such", "some", "any", "all", "more",
  "most", "many", "much", "very", "so", "too", "just", "only", "own", "same", "other", "both",
  "each", "few", "one", "two", "first", "second", "while", "because", "however", "therefore",
  "thus", "within", "across", "among", "per", "via", "upon", "out", "up", "down", "off", "again",
]);

export const DEFAULT_SUPPORT_RATIO = 0.35;
export const DEFAULT_MIN_TOKEN_HITS = 2;
const MAX_UNGROUNDED_TRACKED = 8;
const MIN_SALIENT_TOKENS = 2;

function stemVariants(token: string): string[] {
  const out = [token];
  if (token.length > 5 && token.endsWith("ing")) out.push(token.slice(0, -3));
  if (token.length > 4 && token.endsWith("ed")) out.push(token.slice(0, -2));
  if (token.length > 4 && token.endsWith("es")) out.push(token.slice(0, -2));
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) out.push(token.slice(0, -1));
  return out;
}

function vocabHas(vocab: Set<string>, token: string): boolean {
  if (vocab.has(token)) return true;
  for (const v of stemVariants(token)) {
    if (v.length >= 3 && vocab.has(v)) return true;
  }
  return false;
}

function salientTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^['-]+|['-]+$/g, ""))
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function splitSentences(answer: string): string[] {
  return answer
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z"'(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function isClaimSentence(sentence: string): boolean {
  const trimmed = sentence.trim();
  if (trimmed.length < 25) return false;
  if (trimmed.endsWith("?")) return false;
  return salientTokens(trimmed).length >= MIN_SALIENT_TOKENS;
}

function countHits(tokens: string[], vocab: Set<string>): number {
  return tokens.filter((t) => vocabHas(vocab, t)).length;
}

function isSentenceSupported(
  tokens: string[],
  unionVocab: Set<string>,
  sources: GroundingSource[],
  ratio: number,
  minHits: number
): boolean {
  if (tokens.length === 0) return true;

  const unionHits = countHits(tokens, unionVocab);
  if (unionHits >= minHits || unionHits / tokens.length >= ratio) return true;

  for (const s of sources) {
    const body = (s?.text ?? s?.content ?? "") as string;
    const srcVocab = new Set(salientTokens(body));
    if (srcVocab.size === 0) continue;
    const hits = countHits(tokens, srcVocab);
    if (hits >= minHits || hits / tokens.length >= ratio) return true;
  }
  return false;
}

export function computeAnswerGrounding(
  answer: string,
  sources: GroundingSource[],
  options: AnswerGroundingOptions | number = {}
): AnswerGroundingResult {
  const opts: AnswerGroundingOptions =
    typeof options === "number" ? { supportRatio: options } : options;
  const ratio = Number.isFinite(opts.supportRatio)
    ? Math.max(0, Math.min(1, opts.supportRatio!))
    : DEFAULT_SUPPORT_RATIO;
  const minHits = Number.isFinite(opts.minTokenHits)
    ? Math.max(1, Math.floor(opts.minTokenHits!))
    : DEFAULT_MIN_TOKEN_HITS;

  const text = (answer || "").trim();
  const unionVocab = new Set<string>();
  for (const s of sources || []) {
    const body = (s?.text ?? s?.content ?? "") as string;
    for (const tok of salientTokens(body)) unionVocab.add(tok);
  }

  if (!text || unionVocab.size === 0) {
    return {
      groundingScore: 1,
      claimSentenceCount: 0,
      ungroundedSentenceCount: 0,
      ungroundedSentences: [],
    };
  }

  const sentences = splitSentences(text).filter(isClaimSentence);
  if (sentences.length === 0) {
    return {
      groundingScore: 1,
      claimSentenceCount: 0,
      ungroundedSentenceCount: 0,
      ungroundedSentences: [],
    };
  }

  let supported = 0;
  const ungrounded: string[] = [];
  for (const sentence of sentences) {
    const tokens = salientTokens(sentence);
    if (isSentenceSupported(tokens, unionVocab, sources, ratio, minHits)) {
      supported++;
    } else if (ungrounded.length < MAX_UNGROUNDED_TRACKED) {
      ungrounded.push(sentence);
    }
  }

  return {
    groundingScore: supported / sentences.length,
    claimSentenceCount: sentences.length,
    ungroundedSentenceCount: sentences.length - supported,
    ungroundedSentences: ungrounded,
  };
}
