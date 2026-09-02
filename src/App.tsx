import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'

type ContentType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi'
type Correction = 'L' | 'M' | 'Q' | 'H'

const examples: Record<ContentType, string> = { url:'https://example.com', text:'Hello from QR Code Studio', email:'hello@example.com', phone:'+91 98765 43210', sms:'+91 98765 43210', wifi:'StudioWiFi | DemoPass123 | WPA' }
const labels: Record<ContentType, string> = { url:'Website URL', text:'Text', email:'Email address', phone:'Phone number', sms:'Phone number', wifi:'SSID | Password | Security' }

export function encodeContent(type: ContentType, raw: string) {
  const value = raw.trim()
  if (!value) return ''
  switch (type) {
    case 'email': return value.startsWith('mailto:') ? value : `mailto:${value}`
    case 'phone': return value.startsWith('tel:') ? value : `tel:${value}`
    case 'sms': return value.startsWith('SMSTO:') ? value : `SMSTO:${value}`
    case 'wifi': { const [ssid='', password='', security='WPA'] = value.split('|').map(v=>v.trim()); return `WIFI:T:${security || 'WPA'};S:${ssid};P:${password};;` }
    default: return value
  }
}

export default function App() {
  const [type,setType]=useState<ContentType>('url'), [input,setInput]=useState(examples.url), [value,setValue]=useState(examples.url)
  const [foreground,setForeground]=useState('#111827'), [background,setBackground]=useState('#ffffff'), [size,setSize]=useState(420), [margin,setMargin]=useState(4), [errorCorrection,setErrorCorrection]=useState<Correction>('M')
  const [copied,setCopied]=useState(false), [downloaded,setDownloaded]=useState(false), canvasRef=useRef<HTMLCanvasElement>(null)
  const encoded=useMemo(()=>encodeContent(type,input),[type,input])
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas||!value)return;QRCode.toCanvas(canvas,value,{width:size,margin,errorCorrectionLevel:errorCorrection,color:{dark:foreground,light:background}}).catch(()=>undefined)},[value,size,margin,errorCorrection,foreground,background])
  const selectType=(next:ContentType)=>{setType(next);setInput(examples[next]);setValue(encodeContent(next,examples[next]));setCopied(false);setDownloaded(false)}
  const generate=()=>{setValue(encoded);setCopied(false);setDownloaded(false)}
  const reset=()=>{setType('url');setInput(examples.url);setValue(examples.url);setForeground('#111827');setBackground('#ffffff');setSize(420);setMargin(4);setErrorCorrection('M');setCopied(false);setDownloaded(false)}
  const copy=async()=>{if(!value)return;try{await navigator.clipboard.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),1600)}catch{setCopied(false)}}
  const download=()=>{const canvas=canvasRef.current;if(!canvas||!value)return;const link=document.createElement('a');link.download='qr-code-studio.png';link.href=canvas.toDataURL('image/png');link.click();setDownloaded(true);window.setTimeout(()=>setDownloaded(false),1600)}
  return <main className="app">
    <header className="topbar"><div className="brand"><div className="brand-mark">QR</div><div><strong>QR Code Studio</strong><span>Create · Customize · Download</span></div></div><button className="reset-btn" onClick={reset}>Reset</button></header>
    <section className="hero"><div><p className="eyebrow">Instant QR generator</p><h1>Build a QR code<br/><em>in seconds.</em></h1><p className="hero-copy">Create clean, customizable QR codes for links, text, email, phone, SMS, and Wi‑Fi. Everything runs in your browser.</p></div><div className="hero-badge"><span>100%</span><small>Browser based</small></div></section>
    <section className="workspace">
      <div className="card controls"><div className="card-title"><span>1</span><div><h2>Content</h2><p>Choose a format and enter your data</p></div></div>
        <div className="type-grid">{(Object.keys(labels) as ContentType[]).map(item=><button key={item} className={type===item?'type active':'type'} onClick={()=>selectType(item)}>{item.toUpperCase()}</button>)}</div>
        <label className="field-label" htmlFor="content">{labels[type]}</label><textarea id="content" value={input} onChange={e=>setInput(e.target.value)} rows={4} placeholder="Type or paste content…"/><div className="hint">Wi‑Fi format: <code>SSID | Password | WPA</code>. Keep content short for a cleaner scan.</div>
        <div className="card-title second"><span>2</span><div><h2>Customize</h2><p>Adjust the look of your QR code</p></div></div>
        <div className="two-col"><div><label className="field-label">Foreground</label><div className="color-input"><input aria-label="Foreground color" type="color" value={foreground} onChange={e=>setForeground(e.target.value)}/><code>{foreground}</code></div></div><div><label className="field-label">Background</label><div className="color-input"><input aria-label="Background color" type="color" value={background} onChange={e=>setBackground(e.target.value)}/><code>{background}</code></div></div></div>
        <div className="range-row"><div><label className="field-label" htmlFor="margin">Margin</label><input id="margin" aria-label="QR margin" type="range" min="0" max="12" value={margin} onChange={e=>setMargin(Number(e.target.value))}/></div><strong>{margin}px</strong></div>
        <div className="range-row"><div><label className="field-label" htmlFor="size">Size</label><input id="size" aria-label="QR size" type="range" min="240" max="720" step="20" value={size} onChange={e=>setSize(Number(e.target.value))}/></div><strong>{size}px</strong></div>
        <label className="field-label" htmlFor="correction">Error correction</label><select id="correction" value={errorCorrection} onChange={e=>setErrorCorrection(e.target.value as Correction)}><option value="L">Low — 7%</option><option value="M">Medium — 15%</option><option value="Q">Quartile — 25%</option><option value="H">High — 30%</option></select>
        <button className="generate" onClick={generate} disabled={!encoded}>Generate QR Code <span>→</span></button>
      </div>
      <div className="card preview-card"><div className="preview-head"><div className="card-title"><span>3</span><div><h2>Preview</h2><p>Scan-ready output</p></div></div><span className="status">LIVE</span></div>
        <div className="qr-wrap"><div className="qr-frame">{value?<canvas ref={canvasRef} aria-label="Generated QR code"/>:<div className="empty">Enter content and generate a QR code.</div>}</div></div>
        <div className="preview-value" title={value}>{value||'No content yet'}</div><div className="actions"><button onClick={copy} disabled={!value}>{copied?'Copied!':'Copy content'}</button><button className="primary" onClick={download} disabled={!value}>{downloaded?'Downloaded!':'Download PNG'}</button></div>
        <div className="scan-note"><span>✓</span><div><strong>Ready for real-world use</strong><p>Use a phone camera to verify the code before sharing or printing.</p></div></div>
      </div>
    </section><footer>Built as a practical frontend product demo · QR Code Studio</footer>
  </main>
}
