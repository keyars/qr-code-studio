import { describe, expect, it } from 'vitest'
import { encodeContent } from '../src/App'

describe('encodeContent', () => {
  it('keeps URLs unchanged', () => expect(encodeContent('url', 'https://example.com')).toBe('https://example.com'))
  it('encodes email', () => expect(encodeContent('email', 'hello@example.com')).toBe('mailto:hello@example.com'))
  it('encodes phone', () => expect(encodeContent('phone', '+91 98765 43210')).toBe('tel:+91 98765 43210'))
  it('encodes SMS', () => expect(encodeContent('sms', '+91 98765 43210')).toBe('SMSTO:+91 98765 43210'))
  it('encodes Wi-Fi', () => expect(encodeContent('wifi', 'StudioWiFi | DemoPass123 | WPA')).toBe('WIFI:T:WPA;S:StudioWiFi;P:DemoPass123;;'))
  it('returns empty for blank content', () => expect(encodeContent('text', '   ')).toBe(''))
})
