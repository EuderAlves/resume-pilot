import { parseCsvList, parseLanguages, profileToFormValue } from './profile-form.mapper';

describe('profile form mapper', () => {
  it('should parse comma separated lists trimming empty values', () => {
    expect(parseCsvList('Portugal, Espanha, , Alemanha')).toEqual([
      'Portugal',
      'Espanha',
      'Alemanha',
    ]);
  });

  it('should parse languages from line based input', () => {
    expect(parseLanguages('Portugues - nativo\nIngles: intermediario')).toEqual([
      { name: 'Portugues', level: 'nativo' },
      { name: 'Ingles', level: 'intermediario' },
    ]);
  });

  it('should create a default form value when profile does not exist', () => {
    const value = profileToFormValue(null, 'teste@resumepilot.com');

    expect(value.fullName).toBe('');
    expect(value.summary).toContain('teste@resumepilot.com');
  });
});
