import { describe, expect, it } from 'vitest'
import QRCode from 'qrcode'
import { encodeContent } from './App'

describe('encodeContent', () => {
  it('keeps URLs unchanged', () => {
    expect(encodeContent('url', ' https://example.com ')).toBe('https://example.com')
  })

  it('encodes email addresses', () => {
    expect(encodeContent('email', 'hello@example.com')).toBe('mailto:hello@example.com')
  })

  it('encodes phone and SMS values', () => {
    expect(encodeContent('phone', '+91 98765 43210')).toBe('tel:+91 98765 43210')
    expect(encodeContent('sms', '+91 98765 43210')).toBe('SMSTO:+91 98765 43210')
  })

  it('encodes Wi-Fi details', () => {
    expect(encodeContent('wifi', 'StudioWiFi | DemoPass123 | WPA')).toBe('WIFI:T:WPA;S:StudioWiFi;P:DemoPass123;;')
  })

  it('returns empty content for blank input', () => {
    expect(encodeContent('text', '   ')).toBe('')
  })
})

describe('QR generation smoke test', () => {
  it('generates a PNG data URL from valid QR content', async () => {
    const dataUrl = await QRCode.toDataURL('https://example.com', { errorCorrectionLevel: 'M' })
    expect(dataUrl.startsWith('data:image/png;base64,')).toBe(true)
  })
})
