/**
 * PR Agent — analisa arquivos alterados no PR com ESLint + IA + status EAS build
 * Roda via GitHub Actions. Não executar localmente.
 */
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)
const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })
const PROJECT_ROOT = process.cwd()

// ─── 1. Pega os arquivos alterados no PR via git ──────────────────────────────

async function getChangedFiles(): Promise<string[]> {
  const base = process.env.GITHUB_BASE_REF ?? 'main'
  const { stdout } = await execAsync(`git diff --name-only origin/${base}...HEAD`)
  return stdout
    .trim()
    .split('\n')
    .filter(f =>
      f.length > 0 &&
      (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) &&
      !f.startsWith('scripts/') &&
      !f.startsWith('coverage/') &&
      !f.endsWith('.spec.ts') &&
      !f.endsWith('.spec.tsx') &&
      !f.endsWith('.test.ts') &&
      !f.endsWith('.test.tsx')
    )
}

// ─── 2. Roda ESLint só nos arquivos alterados ─────────────────────────────────

async function runEslint(files: string[]) {
  if (files.length === 0) return []
  const fileList = files.map(f => `'${f}'`).join(' ')
  let stdout = ''
  try {
    const result = await execAsync(
      `npx eslint ${fileList} --format json --max-warnings=9999`,
      { cwd: PROJECT_ROOT }
    )
    stdout = result.stdout
  } catch (err: any) {
    if (err.stdout) stdout = err.stdout
    else throw new Error(`ESLint falhou: ${err.message}`)
  }
  const all = JSON.parse(stdout || '[]')
  return all.filter((r: any) => r.messages.length > 0)
}

// ─── 3. Lê trecho do arquivo ao redor do warning ─────────────────────────────

async function getSnippet(filePath: string, line: number): Promise<string> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const lines = content.split('\n')
    const start = Math.max(0, line - 4)
    const end = Math.min(lines.length, line + 3)
    return lines
      .slice(start, end)
      .map((l, i) => {
        const n = start + i + 1
        return `${n === line ? '>>>' : '   '} ${String(n).padStart(4)}: ${l}`
      })
      .join('\n')
  } catch {
    return '(não foi possível ler o arquivo)'
  }
}

// ─── 4. Monta o contexto para o LLM ──────────────────────────────────────────

async function buildContext(lintResults: any[]) {
  const parts: string[] = []
  for (const file of lintResults) {
    const relativePath = path.relative(PROJECT_ROOT, file.filePath)
    parts.push(`\n## ${relativePath}`)
    for (const msg of file.messages) {
      const severity = msg.severity === 2 ? '🔴 ERRO' : '🟡 WARNING'
      const snippet = await getSnippet(file.filePath, msg.line)
      parts.push(`
${severity} linha ${msg.line} [${msg.ruleId}]
${msg.message}

\`\`\`
${snippet}
\`\`\``)
    }
  }
  return parts.join('\n')
}

// ─── 5. Consulta o status do último EAS Build ────────────────────────────────

interface EasBuild {
  status: string      // FINISHED | ERRORED | CANCELED | IN_QUEUE | IN_PROGRESS
  platform: string    // ANDROID | IOS
  appVersion: string
  buildProfile: string
  createdAt: string
  artifacts?: { buildUrl?: string }
}

async function getEasBuildStatus(): Promise<EasBuild | null> {
  const token = process.env.EXPO_TOKEN
  const projectId = process.env.EAS_PROJECT_ID // 141877fd-e8b7-4b3a-aebe-278ce2f6a49a

  if (!token || !projectId) return null

  try {
    const res = await fetch(
      `https://api.expo.dev/v2/projects/${projectId}/builds?limit=1&platform=ANDROID`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    const build = data.data?.[0]
    if (!build) return null

    return {
      status: build.status,
      platform: build.platform,
      appVersion: build.appVersion ?? '—',
      buildProfile: build.buildProfile ?? '—',
      createdAt: build.createdAt,
      artifacts: build.artifacts,
    }
  } catch {
    return null
  }
}

function formatEasSection(build: EasBuild | null): string {
  if (!build) return ''

  const statusEmoji: Record<string, string> = {
    FINISHED: '✅',
    ERRORED: '❌',
    CANCELED: '⚠️',
    IN_QUEUE: '⏳',
    IN_PROGRESS: '🔄',
  }

  const emoji = statusEmoji[build.status] ?? '❓'
  const time = new Date(build.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  let section = `## ${emoji} EAS Build — ${build.status}\n\n`
  section += `📱 **Plataforma:** ${build.platform}\n`
  section += `🏷️ **Versão:** ${build.appVersion} (perfil: ${build.buildProfile})\n`
  section += `🕐 **Criado em:** ${time}\n`

  if (build.artifacts?.buildUrl) {
    section += `🔗 **Download:** ${build.artifacts.buildUrl}\n`
  }

  return section
}

// ─── 6. Posta o comentário no PR via GitHub API ───────────────────────────────

async function postComment(body: string) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPOSITORY
  const prNumber = process.env.PR_NUMBER

  if (!token || !repo || !prNumber) {
    console.log('Variáveis do GitHub não encontradas — imprimindo relatório:\n')
    console.log(body)
    return
  }

  const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({ body }),
  })

  if (res.ok) {
    console.log('✅ Comentário postado no PR!')
  } else {
    const err = await res.text()
    throw new Error(`Erro ao postar comentário: ${err}`)
  }
}

// ─── 7. Agent principal ───────────────────────────────────────────────────────

async function runPrAgent() {
  console.log('\n🤖 PR Agent iniciado...\n')

  const changedFiles = await getChangedFiles()
  console.log(`📂 Arquivos alterados: ${changedFiles.length}`)

  const [lintResults, easBuild] = await Promise.all([
    runEslint(changedFiles),
    getEasBuildStatus(),
  ])

  // ── Seção de lint ──
  let lintSection: string

  if (changedFiles.length === 0 || lintResults.length === 0) {
    lintSection = `## ✅ Lint — Nenhum problema encontrado\n\nNenhum warning ou erro nos arquivos alterados deste PR.`
  } else {
    const totalErrors = lintResults.reduce((a: number, r: any) => a + r.errorCount, 0)
    const totalWarnings = lintResults.reduce((a: number, r: any) => a + r.warningCount, 0)
    console.log(`📊 ${totalErrors} erros, ${totalWarnings} warnings`)
    console.log('⏳ Analisando com IA...')

    const context = await buildContext(lintResults)

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      system: `Você é um especialista em qualidade de código React Native, TypeScript e Expo.
Analise os warnings do ESLint e gere um relatório em português formatado em Markdown para ser postado como comentário no GitHub.
Para cada problema: explique o que é, mostre o código corrigido (antes/depois).
Ao final: top 3 regras violadas e estimativa de esforço (rápida/média/trabalhosa).
Seja direto e prático. Use emojis para facilitar a leitura.`,
      prompt: `Analise estes warnings e gere o relatório:\n${context}`,
    })

    lintSection = `## 🔍 Lint — ${totalErrors} erros, ${totalWarnings} warnings\n\n${text}`
  }

  // ── Seção do EAS ──
  const easSection = formatEasSection(easBuild)

  // ── Comentário final ──
  const separator = '\n\n---\n\n'
  const footer = `\n\n---\n_Análise gerada automaticamente pelo PR Agent • ${new Date().toLocaleDateString('pt-BR')}_`

  const comment = [lintSection, easSection].filter(Boolean).join(separator) + footer

  await postComment(comment)
}

runPrAgent().catch(err => {
  console.error(err)
  process.exit(1)
})
