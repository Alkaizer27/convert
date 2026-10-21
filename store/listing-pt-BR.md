# Textos para a Chrome Web Store (copiar e colar no painel)

## Aba "Item da loja" (Store listing)

**Nome** (vem do manifest): Resolve Aí — Assistente de Estudos

**Resumo** (até 132 caracteres; vem do manifest):
Painel lateral que lê a questão da página e explica a resposta com IA (Claude ou Gemini), com fontes.

**Descrição:**

Estude com um assistente que fica ao lado da página, sem cobrir nada.

Abra o painel do Resolve Aí numa página com uma questão e ele:
• lê a questão e as alternativas direto da tela;
• indica a resposta;
• explica passo a passo como chegar nela;
• mostra as fontes pesquisadas na internet.

Funciona com qualquer matéria: matemática, português, ciências, história e mais.

Recursos:
• Painel lateral do Chrome: a página continua inteira visível.
• Lê o texto selecionado, o texto da página (inclusive quadros incorporados) e a parte visível da tela, útil para gráficos, imagens e fórmulas.
• Escolha entre Claude (Anthropic) e Gemini (Google).
• Caixa para tirar outras dúvidas sobre a mesma página.
• Atalho: Alt+Shift+R.

Requer a sua própria chave de API da Anthropic ou do Google (o Gemini tem cota gratuita). As chaves ficam salvas só no seu navegador.

**Categoria:** Educação
**Idioma:** Português (Brasil)

**Imagens** (pasta `store/`):
- Ícone 128×128: `extension/icons/icon128.png`
- Capturas de tela 1280×800: `store/screenshot-1-1280x800.png`, `store/screenshot-2-1280x800.png`
- Bloco promocional pequeno 440×280: `store/promo-small-440x280.png`

## Aba "Práticas de privacidade" (Privacy practices)

**Finalidade única (Single purpose):**
Ajudar o usuário a estudar, lendo a questão exibida na página atual e mostrando num painel lateral a resposta, a explicação e as fontes geradas por uma IA escolhida pelo usuário.

**Justificativa das permissões:**

| Permissão | Justificativa |
|---|---|
| `sidePanel` | Mostrar a resposta num painel lateral, sem cobrir a página. |
| `scripting` | Ler o texto da questão (e o texto selecionado) na aba ativa quando o usuário abre o painel ou clica em "Responder". |
| `activeTab` | Acessar a aba atual quando o usuário clica no ícone da extensão. |
| `storage` | Guardar as configurações e as chaves de API do usuário localmente. |
| Acesso aos sites (`<all_urls>`) | As questões podem estar em qualquer site de estudo; é necessário para ler o texto da página, capturar a parte visível da tela e chamar as APIs da Anthropic e do Google. A leitura só acontece por ação do usuário. |

**Código remoto:** Não. Todo o código está no pacote; a extensão só envia e recebe dados (JSON) das APIs de IA.

**Uso de dados (marcar):**
- [x] Conteúdo do site (texto e captura da página atual)
- [x] Informações de autenticação (chave de API, guardada localmente)
- Todos os demais: não coletados.

**Declarações (marcar as três):**
- [x] Não vendo nem transfiro dados de usuários a terceiros, fora dos casos de uso aprovados.
- [x] Não uso nem transfiro dados de usuários para fins não relacionados à finalidade única do item.
- [x] Não uso nem transfiro dados de usuários para determinar a capacidade de crédito ou para empréstimos.

**URL da política de privacidade:** endereço público onde `docs/privacidade.html` estiver publicado (ver `docs/PUBLICACAO.md`, passo 5).

## Aba "Distribuição"

- **Visibilidade:** Privada
- **Testadores autorizados:** seu Gmail (em Conta → Testadores autorizados / *Trusted testers*)
- **Regiões:** Brasil (ou todas)
