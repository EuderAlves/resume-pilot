import { parseActivities, parseCsvList, parseLineList } from './experience-form.mapper';

describe('experience form mapper', () => {
  it('should parse comma separated tools', () => {
    expect(parseCsvList('Angular, TypeScript, , Jira')).toEqual(['Angular', 'TypeScript', 'Jira']);
  });

  it('should parse line based lists', () => {
    expect(parseLineList('Primeira entrega\n\nSegunda entrega')).toEqual([
      'Primeira entrega',
      'Segunda entrega',
    ]);
  });

  it('should parse activities using pipe separated columns', () => {
    expect(parseActivities('Desenvolver em Angular | Diario | Codigo limpo')).toEqual([
      {
        activity: 'Desenvolver em Angular',
        frequency: 'Diario',
        result: 'Codigo limpo',
      },
    ]);
  });
});
