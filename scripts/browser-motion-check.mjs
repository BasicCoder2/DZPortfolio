const debugPort = process.env.BROWSER_DEBUG_PORT ?? '9223'
const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) =>
  response.json()
)
const page = targets.find((target) => target.type === 'page' && target.url.includes('127.0.0.1:3105'))
if (!page?.webSocketDebuggerUrl)
  throw new Error('No page target available from the browser debugger.')
const socket = new WebSocket(page.webSocketDebuggerUrl)
let commandId = 0
const pending = new Map()

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  const resolve = pending.get(message.id)
  if (!resolve) return
  pending.delete(message.id)
  resolve(message.result)
})

await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true })
  socket.addEventListener('error', reject, { once: true })
})

function command(method, params = {}) {
  return new Promise((resolve) => {
    const id = ++commandId
    pending.set(id, resolve)
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression,
  })
  return result.result?.value
}

await command('Runtime.enable')
await new Promise((resolve) => setTimeout(resolve, 1200))

const report = await evaluate(`(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  const read = () => {
    const codeMark = document.querySelector('[data-testid="code-mark"]') ?? [...document.querySelectorAll('div')].find((element) => element.textContent?.trim() === '< />')
    const code = document.querySelector('[data-testid="code-mark-rotator"]') ?? codeMark?.querySelector('div')
    const ring = document.querySelector('[data-testid="technology-ring"] > .signature-ambient-motion') ?? document.querySelector('div.absolute.inset-0.rounded-full.border')
    const terminalRoot = document.querySelector('[data-testid="terminal-motif"]') ?? [...document.querySelectorAll('div')].find((element) => element.textContent?.includes('$ dz --focus'))
    const terminal = terminalRoot?.lastElementChild
    const graph = document.querySelector('[data-testid="commit-graph"] path') ?? document.querySelector('svg path')
    const title = document.querySelector('h1')
    const rect = (element) => {
      const box = element?.getBoundingClientRect()
      return box ? [box.x, box.y, box.width, box.height] : null
    }
    return {
      url: location.href,
      testIds: [...document.querySelectorAll('[data-testid]')].map((element) => element.getAttribute('data-testid')),
      bodyText: document.body.innerText.slice(0, 120),
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      codeTransform: code ? getComputedStyle(code).transform : null,
      ringTransform: ring ? getComputedStyle(ring).transform : null,
      codeRect: rect(codeMark),
      ringRect: rect(document.querySelector('[data-testid="technology-ring"]') ?? ring),
      terminal: terminal?.textContent ?? null,
      graphOpacity: graph ? getComputedStyle(graph).opacity : null,
      titleOpacity: title ? getComputedStyle(title).opacity : null,
    }
  }
  const first = read()
  await sleep(1600)
  const second = read()
  await sleep(1000)
  const third = read()
  return { first, second, third }
})()`)

const changed = (first, second) => first !== second && first !== 'none' && second !== 'none'
const stableGeometry = (first, second) =>
  first && second && first.slice(2).every((value, index) => Math.abs(value - second[index + 2]) < 1)
const checks = {
  'OS preference detected': typeof report.first.reduced === 'boolean',
  'CodeMark transform changes':
    changed(report.first.codeTransform, report.second.codeTransform) &&
    changed(report.second.codeTransform, report.third.codeTransform),
  'Technology Ring transform changes':
    changed(report.first.ringTransform, report.second.ringTransform) &&
    changed(report.second.ringTransform, report.third.ringTransform),
  'Signature layout remains stable':
    stableGeometry(report.first.codeRect, report.second.codeRect) &&
    stableGeometry(report.first.ringRect, report.second.ringRect),
  'Commit graph is complete': report.third.graphOpacity === '1',
}

if (!report.first.reduced) {
  checks['Terminal animates'] = report.first.terminal !== report.second.terminal
  checks['Normal entrance reaches visible state'] = report.third.titleOpacity === '1'
} else {
  checks['Terminal is stable'] = report.first.terminal === report.second.terminal
  checks['Reduced entrance is visible'] =
    report.first.titleOpacity === '1' || report.second.titleOpacity === '1'
}

for (const [label, passed] of Object.entries(checks))
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`)
console.log(JSON.stringify(report))
socket.close()
if (Object.values(checks).some((passed) => !passed)) process.exitCode = 1
