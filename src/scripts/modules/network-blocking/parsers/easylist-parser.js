import { IParser } from './i-parser.js';

/**
 * Parses EasyList text format into rule objects
 */
export class EasyListParser extends IParser {
  async parse(content) {
    return content
      .split('\n')
      .filter(line => {
        // Pass all non-comment, non-empty lines to converter
        // Let @eyeo/abp2dnr handle validation (supports ||domain^, /regex/, $options, etc.)
        const trimmed = line.trim();
        return (
          trimmed.length > 0 &&
          !trimmed.startsWith('!') && // Skip comments
          !trimmed.startsWith('[')    // Skip section headers like [Adblock Plus 2.0]
        );
      })
      .map(line => line.trim());
  }
}
