import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Markdown, markdownExcerpt, markdownReadingTime } from '@/lib/content/markdown'

/**
 * Markdown safety.
 *
 * Content is authored by the site owner, but it round-trips through a database
 * and is rendered into every visitor's page. If an admin session were ever
 * compromised, this render path is where stored HTML would become executed
 * HTML — so it is tested as though the input were hostile, because in the only
 * scenario that matters it is.
 */
function render(source: string): string {
  return renderToStaticMarkup(<Markdown>{source}</Markdown>)
}

describe('Markdown sanitization', () => {
  it('does not execute a script tag', () => {
    const html = render('Before\n\n<script>alert(1)</script>\n\nAfter')

    expect(html).not.toContain('<script')
    // It survives as visible text rather than vanishing, so an author can see
    // what happened to what they pasted.
    expect(html).toContain('&lt;script&gt;')
  })

  it('does not render raw HTML elements', () => {
    const html = render('<div class="injected"><b>hello</b></div>')

    expect(html).not.toContain('<div class="injected"')
    expect(html).not.toContain('<b>hello</b>')
  })

  it('renders an inline event handler as inert text, not as an attribute', () => {
    const html = render('<img src="x" onerror="alert(1)">')

    // The substring "onerror" is still present — but escaped inside a text
    // node, not parsed as an attribute, so there is nothing for the browser to
    // fire. Asserting its mere absence would have been the wrong test: what
    // matters is that no element was created.
    expect(html).not.toMatch(/<img/)
    expect(html).toContain('&lt;img')
  })

  it('drops a javascript: link target', () => {
    const html = render('[click me](javascript:alert(1))')

    expect(html).not.toContain('javascript:')
    // The link text is preserved; only the dangerous destination is removed.
    expect(html).toContain('click me')
  })

  it('drops a data: URL image source', () => {
    const html = render('![x](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)')
    expect(html).not.toContain('data:text/html')
  })

  it('keeps legitimate links and marks external ones safe', () => {
    const html = render('[docs](https://example.com) and [about](/me)')

    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(html).toContain('href="/me"')
  })

  it('renders ordinary Markdown correctly', () => {
    const html = render('**bold** and `code`\n\n- one\n- two')

    expect(html).toContain('<strong')
    expect(html).toContain('<code')
    expect(html).toContain('<li')
  })

  it('renders GitHub-flavoured tables', () => {
    const html = render('| a | b |\n| - | - |\n| 1 | 2 |')
    expect(html).toContain('<table')
  })
})

describe('heading hierarchy', () => {
  it('demotes an authored H1 to H2, so a page has exactly one H1', () => {
    // This is the fix for the duplicate H1 the MDX article shipped with: the
    // file opened with "# Building Useful Systems" while the page rendered the
    // same title in its own <h1>.
    const html = render('# Building Useful Systems\n\nBody.')

    expect(html).not.toContain('<h1')
    expect(html).toContain('<h2')
  })

  it('shifts every level down by one', () => {
    const html = render('# One\n\n## Two\n\n### Three')

    expect(html).toContain('<h2')
    expect(html).toContain('<h3')
    expect(html).toContain('<h4')
    expect(html).not.toContain('<h1')
  })

  it('does not push past h6', () => {
    const html = render('###### Six')
    expect(html).toContain('<h6')
  })

  it('honours an explicit offset of zero', () => {
    const html = renderToStaticMarkup(<Markdown headingOffset={0}># Title</Markdown>)
    expect(html).toContain('<h1')
  })

  it('renders nothing for empty content', () => {
    expect(render('   ')).toBe('')
  })
})

describe('markdownReadingTime', () => {
  it('always reports at least a minute', () => {
    expect(markdownReadingTime('one two three')).toBe('1 min read')
  })

  it('scales with word count', () => {
    expect(markdownReadingTime('word '.repeat(600))).toBe('3 min read')
  })

  it('does not count fenced code as prose', () => {
    const prose = 'word '.repeat(200)
    const withCode = `${prose}\n\n\`\`\`js\n${'x '.repeat(2000)}\n\`\`\``
    expect(markdownReadingTime(withCode)).toBe(markdownReadingTime(prose))
  })
})

describe('markdownExcerpt', () => {
  it('strips syntax and collapses whitespace', () => {
    expect(markdownExcerpt('## Heading\n\nSome **bold** text.')).toBe('Heading Some bold text.')
  })

  it('keeps link text and drops the target', () => {
    expect(markdownExcerpt('See [the docs](https://example.com).')).toBe('See the docs.')
  })

  it('truncates with an ellipsis', () => {
    const excerpt = markdownExcerpt('word '.repeat(100), 40)
    expect(excerpt.length).toBeLessThanOrEqual(43)
    expect(excerpt.endsWith('...')).toBe(true)
  })
})
