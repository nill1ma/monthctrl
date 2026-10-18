/**
 * A11y Agent — analisa componentes React Native staged para violações de acessibilidade
 * Roda automaticamente no pre-commit via Husky.
 *
 * React Native não tem jsx-a11y. Este agent usa análise estática via IA para identificar:
 * - Elementos interativos sem accessibilityLabel
 * - TouchableOpacity/Pressable sem accessible={true} e label
 * - Imagens sem accessibilityLabel ou role="image"
 * - Inputs sem accessibilityLabel ou accessibilityHint
 * - Elementos com onPress mas sem papel de acessibilidade
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile } from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)
const PROJECT_ROOT = process.cwd()

// ─── 1. Pega os arquivos .tsx staged ─────────────────────────────────────────

async function getStagedFiles(): Promise<string[]> {
  const { stdout } = await execAsync('git diff --cached --name-only --diff-filter=ACM')
  return stdout
    .trim()
    .split('\n')
    .filter(f =>
      f.length > 0 &&
      (f.endsWith('.tsx') || f.endsWith('.jsx')) &&
      (f.startsWith('src/app/') || f.startsWith('src/components/') || f.startsWith('src/screens/')) &&
      !f.startsWith('src/i18n/')
    )
}

// ─── 2. Lê o conteúdo completo dos arquivos ───────────────────────────────────

async function readFiles(files: string[]): Promise<{ file: string; content: string }[]> {
  const results = []
  for (const file of files) {
    try {
      const content = await readFile(path.join(PROJECT_ROOT, file), 'utf-8')
      results.push({ file, content })
    } catch {}
  }
  return results
}

// ─── 3. Agent principal ───────────────────────────────────────────────────────

export async function runA11yAgent(): Promise<{ hasErrors: boolean }> {
  console.log('\n♿ A11y Agent iniciado...\n')

  const stagedFiles = await getStagedFiles()

  if (stagedFiles.length === 0) {
    console.log('✅ Nenhum componente React Native no staged — commit liberado.\n')
    return { hasErrors: false }
  }

  console.log(`📂 Componentes staged: ${stagedFiles.join(', ')}\n`)

  const filesContent = await readFiles(stagedFiles)

  if (filesContent.length === 0) {
    console.log('✅ Nenhum arquivo legível — commit liberado.\n')
    return { hasErrors: false }
  }

  const context = filesContent
    .map(({ file, content }) => `## ${file}\n\`\`\`tsx\n${content}\n\`\`\``)
    .join('\n\n')

  console.log('⏳ Analisando acessibilidade com IA...\n')

  const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY })
  const { text } = await generateText({
    model: google('gemini-2.0-flash'),
    system: `Você é um especialista em acessibilidade mobile (WCAG 2.1 AA) e React Native.

Analise os componentes React Native abaixo e identifique violações de acessibilidade.

ERROS CRÍTICOS (🔴 — bloqueiam commit):
- TouchableOpacity / Pressable / TouchableHighlight com onPress mas sem accessibilityLabel
- Image sem accessibilityLabel (quando não é decorativa) ou sem accessibilityRole="image" + accessibilityLabel
- TextInput sem accessibilityLabel ou accessibilityHint
- Elementos com accessibilityRole="button" mas sem accessibilityLabel

WARNINGS (🟡 — não bloqueiam, mas devem ser corrigidos):
- Elementos clicáveis sem accessibilityHint (dica do que acontece ao clicar)
- FlatList sem accessibilityLabel na lista ou nos itens
- Componente que parece ser um formulário mas não usa accessibilityRole nos inputs
- Falta de accessible={true} em contêineres agrupados

IGNORAR:
- Props internas, utilitários, helpers sem JSX
- Ícones decorativos com accessibilityElementsHidden={true}
- Componentes que já têm accessibilityLabel correto

Para cada violação:
- Arquivo e linha aproximada
- Severidade (🔴 ERRO ou 🟡 WARNING)
- O trecho de código problemático
- Código corrigido (antes/depois)

Ao final: resumo do impacto para usuários com deficiência visual usando TalkBack/VoiceOver.
Responda em português.`,
    prompt: `Analise estes componentes React Native:\n\n${context}`,
  })

  // Detecta se há erros críticos na resposta do LLM
  const hasErrors = text.includes('🔴 ERRO') || text.includes('ERRO CRÍTICO')

  console.log('━'.repeat(60))
  console.log('♿ RELATÓRIO DE ACESSIBILIDADE (React Native)')
  console.log('━'.repeat(60))
  console.log(text)
  console.log('━'.repeat(60))

  if (hasErrors) {
    console.log('\n🚫 Commit bloqueado: erros críticos de acessibilidade encontrados.')
    console.log('   Corrija os erros 🔴 acima antes de commitar.\n')
  } else {
    console.log('\n✅ Nenhum erro crítico de acessibilidade — commit liberado.\n')
  }

  return { hasErrors }
}
