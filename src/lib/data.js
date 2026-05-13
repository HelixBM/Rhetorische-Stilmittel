import { STILMITTEL } from '../data';

export function getStaticStilmittel() {
  return STILMITTEL.map((item, index) => ({
    id: item.id ?? index + 1,
    aliases: item.aliases ?? [],
    ...item,
  }));
}

export function explainItem(item) {
  if (!item) return '';
  const example = item.examples?.[0] ? ` Beispiel: ${item.examples[0]}` : '';
  return `${item.name}: ${item.definition}${example}`;
}
