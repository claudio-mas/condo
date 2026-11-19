import { type Catalog, ptBR } from "./pt-BR";

/**
 * Acesso tipado ao catálogo. Utilizável no servidor e no navegador;
 * não importa domínio nem módulos de fases futuras.
 */

export type Locale = "pt-BR";
export const DEFAULT_LOCALE: Locale = "pt-BR";

export type MessageKey = keyof Catalog;

type Placeholders<S extends string> = S extends `${string}{${infer Name}}${infer Rest}`
  ? Name | Placeholders<Rest>
  : never;

export type MessageParams<K extends MessageKey> = {
  readonly [P in Placeholders<Catalog[K]>]: string | number;
};

type Args<K extends MessageKey> = [Placeholders<Catalog[K]>] extends [never]
  ? []
  : [params: MessageParams<K>];

export function isMessageKey(value: unknown): value is MessageKey {
  return typeof value === "string" && Object.hasOwn(ptBR, value);
}

/** Mensagem do catálogo com placeholders obrigatórios conforme a chave. */
export function t<K extends MessageKey>(key: K, ...args: Args<K>): string {
  const template: string = ptBR[key];
  const params = args[0] as Record<string, string | number> | undefined;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}

export const messages: Catalog = ptBR;
