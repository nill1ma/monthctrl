/**
 * Test Runner Agent — executa os unit tests e reporta falhas com análise via IA.
 * Roda automaticamente no pre-commit via Husky (orchestrator).
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const PROJECT_ROOT = process.cwd()

// ─── 1. Executa o Jest via jest-expo e captura a saída ───────────────────────

interface TestRunResult {
  passed: boolean
  output: string
  failedSuites: number
  failedTests: number
}

async function runTests(): Promise<TestRunResult> {
  try {
    const { stdout, stderr } = await execAsync(
      'npx jest --passWithNoTests --no-coverage 2>&1',
      {
        cwd: PROJECT_ROOT,
        timeout: 120_000,
        env: {
          ...process.env,
          // jest-expo precisa saber o preset
          CI: 'true',
        },
      }
    )
    const output = stdout + stderr
    return { passed: true, output, failedSuites: 0, failedTests: 0 }
  } catch (err: any) {
    const output = (err.stdout ?? '') + (err.stderr ?? '')
    const suitesMatch = output.match(/(\d+) test suite[s]? failed/)
    const testsMatch = output.match(/(\d+) test[s]? failed/)
    return {
      passed: false,
      output,
      failedSuites: suitesMatch ? parseInt(suitesMatch[1]) : 0,
      failedTests: testsMatch ? parseInt(testsMatch[1]) : 0,
    }
  }
}

// ─── 2. Agent principal ───────────────────────────────────────────────────────

export async function runTestRunnerAgent(): Promise<{ hasErrors: boolean }> {
  console.log('\n🧪 Test Runner Agent iniciado...\n')

  const result = await runTests()

  if (result.passed) {
    console.log('✅ Todos os testes passaram — commit liberado.\n')
    return { hasErrors: false }
  }

  console.log(`❌ ${result.failedTests} teste(s) falharam em ${result.failedSuites} suite(s)`)
  console.log('⏳ Analisando falhas com IA...\n')

  const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })
  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    system: `Você é um engenheiro de software sênior especializado em testes em TypeScript/React Native com Jest e jest-expo.
Analise as falhas de testes abaixo e gere um relatório objetivo.
Para cada falha: identifique a causa raiz, explique por que o teste falhou e sugira a correção.
Use emojis, seja direto e responda em português.`,
    prompt: `Analise estas falhas de testes:\n\n${result.output.slice(0, 8000)}`,
  })

  console.log('━'.repeat(60))
  console.log('🧪 RELATÓRIO DE FALHAS NOS TESTES')
  console.log('━'.repeat(60))
  console.log(text)
  console.log('━'.repeat(60))
  console.log(`\n🚫 Commit bloqueado: ${result.failedTests} teste(s) falhando.`)
  console.log('   Corrija os testes acima antes de commitar.\n')

  return { hasErrors: true }
}
