# Resolve Aí — Assistente de Estudos (extensão do Chrome)

Painel lateral do Chrome que lê a questão que está na tela e responde com IA (Claude ou Gemini):
**resposta**, **explicação passo a passo** e **fontes** pesquisadas na internet.
O painel fica ao lado da página, sem cobrir nada.

## Instalar no seu Chrome (modo desenvolvedor)

1. Baixe esta pasta do repositório (ou faça `git clone`).
2. Abra `chrome://extensions`.
3. Ative **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e escolha a pasta `extension/`.
5. Fixe o ícone na barra (ícone de quebra-cabeça → alfinete).

## Configurar as chaves de API

Clique no ícone da extensão → **⚙** e cole pelo menos uma chave:

| IA | Onde criar a chave | Observação |
|---|---|---|
| Claude | [console.anthropic.com](https://console.anthropic.com/settings/keys) | A assinatura do Claude.ai (Pro/Max) **não** inclui a API; é cobrada à parte, por uso. Precisa adicionar créditos. |
| Gemini | [aistudio.google.com](https://aistudio.google.com/app/apikey) | Tem cota gratuita; basta entrar com a conta Google. |

As chaves ficam salvas só neste navegador, neste computador (`chrome.storage.local`).

## Como usar

- Abra a página com a questão e clique no ícone (ou **Alt+Shift+R**). O painel abre e já responde.
- Para uma questão específica, **selecione o texto** dela antes e clique em **Responder questão da tela**.
- Troque entre Claude e Gemini no seletor do topo.
- Use a caixa de baixo para perguntar mais coisas sobre a página.

## Como funciona

- `manifest.json`: Manifest V3, painel lateral (`chrome.sidePanel`).
- `lib/page.js`: lê o texto da página (inclusive iframes e o texto selecionado) e tira uma captura da área visível.
- `lib/providers.js`: chama a API do Claude (com pesquisa na web e citações) ou do Gemini (com Google Search).
- `sidepanel.*`: interface do painel. `options.*`: configurações.

## Publicar depois na Chrome Web Store (privada)

Compacte a pasta `extension/` em .zip e envie pelo
[Developer Dashboard](https://chrome.google.com/webstore/devconsole) com visibilidade **Privada**
e seu Gmail na lista de testadores. Assim ela sincroniza em qualquer Chrome em que você entrar.
