import {
  getQueryString,
  getQueryParamObject,
  Ajax,
  stringEnumerate
} from './helpers';

describe('getQueryString', () => {
  it('with falsy values', () => {
    expect(getQueryString({ a: 1, b: undefined, c: false, d: 0 })).toBe(
      'a=1&c=false&d=0'
    );
  });

  it('encoding string', () => {
    expect(getQueryString({ a: '1 2' })).toBe('a=1%202');
  });

  it('with array', () => {
    expect(getQueryString({ a: [1, 2] })).toBe('a=1&a=2');
  });

  it('combine arrays and numbers', () => {
    expect(getQueryString({ a: [1, 2, 3], b: false })).toBe(
      'a=1&a=2&a=3&b=false'
    );
  });
});

describe('getQueryParamObject', () => {
  it('parses query', () => {
    expect(getQueryParamObject('a=0&b=false&c=1')).toEqual({
      a: '0',
      b: 'false',
      c: '1'
    });
  });

  it('parses query with array parameters', () => {
    expect(getQueryParamObject('a=1&a=2&a=3')).toEqual({
      a: ['1', '2', '3']
    });
  });

  it('empty query returns empty object', () => {
    expect(getQueryParamObject('')).toEqual({});
  });

  it('decodes value in url', () => {
    const url =
      '?filter_order=platform&platform=%5BHG-U133_Plus_2%5D%20Affymetrix%20Human%20Genome%20U133%20Plus%202.0%20Array';
    expect(getQueryParamObject(url)).toEqual({
      filter_order: 'platform',
      platform: '[HG-U133_Plus_2] Affymetrix Human Genome U133 Plus 2.0 Array'
    });
  });
});

describe('Ajax', () => {
  beforeEach(function() {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ ok: true, json: () => {} }));
  });

  describe('get', () => {
    it('makes requests to url', () => {
      Ajax.get('/url');
      expect(global.fetch.mock.calls[0]).toEqual(['/url']);
    });

    it('sends parameters encoded in url', () => {
      Ajax.get('/url', { a: 1, b: 2 });
      expect(global.fetch.mock.calls[0]).toEqual(['/url?a=1&b=2']);
    });
  });

  describe('post', () => {
    it('sends requests with parameters', () => {
      Ajax.post('/url', { a: 1, b: 2 });
      expect(global.fetch.mock.calls[0]).toEqual([
        '/url',
        {
          body: '{"a":1,"b":2}',
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          }
        }
      ]);
    });
  });

  describe('put', () => {
    it('sends requests with parameters', () => {
      Ajax.put('/url', { a: 1, b: 2 });
      expect(global.fetch.mock.calls[0]).toEqual([
        '/url',
        {
          body: '{"a":1,"b":2}',
          method: 'PUT',
          headers: {
            'content-type': 'application/json'
          }
        }
      ]);
    });
  });
});

it('stringEnumerate', () => {
  expect(stringEnumerate(['first'])).toEqual('first');
  expect(stringEnumerate(['first', 'second'])).toEqual('first and second');
  expect(stringEnumerate(['first', 'second', 'third'])).toEqual(
    'first, second and third'
  );
});
