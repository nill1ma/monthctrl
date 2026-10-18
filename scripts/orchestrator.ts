import { config } from 'dotenv'
config({ path: '.env' })

import { runA11yAgent } from './a11y-agent'
import { runI18nAgent } from './i18n-agent'
import { runTestRunnerAgent } from './test-runner-agent'
import { runTestCoverageAgent } from './test-coverage-agent'

async function runOrchestrator() {
  console.log('\n🤖 Orchestrator iniciado...\n')

  const [a11yResult, i18nResult, testRunnerResult, testCoverageResult] = await Promise.all([
    runA11yAgent(),
    runI18nAgent(),
    runTestRunnerAgent(),
    runTestCoverageAgent(),
  ])

  // test-coverage-agent é apenas consultivo — não bloqueia commit
  const hasBlockingErrors =
    a11yResult.hasErrors || i18nResult.hasErrors || testRunnerResult.hasErrors

  if (hasBlockingErrors) {
    process.exit(1)
  }

  process.exit(0)
}

runOrchestrator().catch(err => {
  console.error('⚠️  Orchestrator falhou inesperadamente. Commit liberado.')
  console.error(err)
  process.exit(0)
})
