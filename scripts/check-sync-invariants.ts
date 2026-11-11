import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dir, "..")
const failures: string[] = []

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry)
    return statSync(path).isDirectory() ? walk(path) : path
  })
}

// 1. No unresolved merge conflict markers in plugin content.
const conflictMarker = /^(<{7}|>{7}|={7})( |$)/m
for (const path of walk(resolve(root, "plugins"))) {
  if (!path.endsWith(".md") && !path.endsWith(".yml") && !path.endsWith(".yaml") && !path.endsWith(".json")) continue
  if (conflictMarker.test(readFileSync(path, "utf8"))) failures.push(`conflict markers in ${path}`)
}

// 2. Every plugin skill has well-formed frontmatter with a name matching its directory.
for (const plugin of readdirSync(resolve(root, "plugins"))) {
  const skillPath = resolve(root, "plugins", plugin, "skills", plugin, "SKILL.md")
  const content = readFileSync(skillPath, "utf8")
  const match = /^---\n(.*\n)?---/s.exec(content)
  if (!match) { failures.push(`no frontmatter in ${skillPath}`); continue }
  const name = /^name:\s*(\S+)$/m.exec(match[1])
  if (!name) failures.push(`no name in frontmatter of ${skillPath}`)
  else if (name[1] !== plugin) failures.push(`name mismatch in ${skillPath}: ${name[1]} != ${plugin}`)
}

// 3. Local overrides survive every sync.
const overrides = [
  "build-iterated-agentic-loop",
  "design-control-loop",
  "rpi",
  "visual-pr",
]
for (const plugin of overrides) {
  const skillPath = resolve(root, "plugins", plugin, "skills", plugin, "SKILL.md")
  if (!readFileSync(skillPath, "utf8").includes("disable-model-invocation: true")) {
    failures.push(`local override lost: disable-model-invocation flag missing in ${plugin}`)
  }
}

if (failures.length > 0) {
  console.error(`sync invariants FAILED (${failures.length}):`)
  for (const failure of failures) console.error(` - ${failure}`)
  process.exit(1)
}
console.log('sync invariants OK: no conflict markers, frontmatter well-formed, local overrides preserved')