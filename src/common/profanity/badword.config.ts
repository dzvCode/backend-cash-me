import BadWordsNext from 'bad-words-next';
import en from 'bad-words-next/data/en.json';
import es from 'bad-words-next/data/es.json';
import pe_Es from './../../common/profanity/dataset/peru.json';

export class BadWordConfig {
  /**
   * Filter bad words from a string
   * @param string - The string to filter
   * @returns The filtered string
   */
  static filterBadWords(string: string): string {
    const badwords = new BadWordsNext();
    badwords.add(en);
    badwords.add(es);
    badwords.add(pe_Es);

    return badwords.filter(string);
  }
}
