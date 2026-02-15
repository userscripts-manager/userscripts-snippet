describe('getInfluxString', () => {
    test('should getInfluxString works as expected', () => {
        expect(getInfluxString('hello')).toBe('"hello"')
        expect(getInfluxString('hello world')).toBe('"hello world"')
        expect(getInfluxString('hello "world"')).toBe('"hello \\"world\\""')
        expect(getInfluxString('')).toBe('""')
    });
});
describe('getInfluxStringTag', () => {
    test('should getInfluxStringTag works as expected', () => {
        expect(getInfluxStringTag('hello')).toBe('hello')
        expect(getInfluxStringTag('hello world')).toBe('hello\\ world')
        expect(getInfluxStringTag('hello "world"')).toBe('hello\\ \\"world\\"')
        expect(getInfluxStringTag('')).toBe('')
    });
});
describe('formatInfluxLine', () => {
    test('should formatInfluxLine works as expected', () => {
        const line = formatInfluxLine('measurement', { tag1: 'value1', tag2: 'value2' }, { field1: 'value1', field2: 42, field3: true }, 1625079600)
        expect(line).toBe('measurement,tag1=value1,tag2=value2 field1="value1",field2=42i,field3=true 1625079600000000000')
    });
    test('should formatInfluxLine works with jsdate option', () => {
        const date = new Date('2021-06-30T12:00:00Z')
        const line = formatInfluxLine('measurement', { tag1: 'value1', tag2: 'value2' }, { field1: 'value1', field2: 42, field3: true }, date, { jsdate: true })
        expect(line).toBe('measurement,tag1=value1,tag2=value2 field1="value1",field2=42i,field3=true 1625054400000000000')
    });
});
describe('formatInfluxFileContent', () => {
    test('should formatInfluxFileContent works as expected', async () => {
        const lineProvider = async function* () {
            yield { measurement: 'measurement1', tags: { tag1: 'value1' }, fields: { field1: 'value1' }, date: 1625079600 }
            yield { measurement: 'measurement2', tags: { tag2: 'value2' }, fields: { field2: 42 }, date: 1625079600 }
        }
        const content = await formatInfluxFileContent(lineProvider())
        expect(content).toBe('measurement1,tag1=value1 field1="value1" 1625079600000000000\nmeasurement2,tag2=value2 field2=42i 1625079600000000000\n')
    });
});