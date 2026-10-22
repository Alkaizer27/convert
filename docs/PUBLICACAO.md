# Resolve Aí: do zero até a Chrome Web Store

Os passos marcados com 👤 dependem de você (login, pagamento, aprovação). Todo o resto já está pronto no repositório.

## Fase 1: usar agora, sem loja (5 minutos)

1. 👤 **Criar a chave do Gemini (grátis):** entre em https://aistudio.google.com/app/apikey com seu Gmail e clique em *Create API key*. Copie a chave (começa com `AIza`).
2. 👤 *(Opcional)* **Criar a chave do Claude:** em https://console.anthropic.com/settings/keys. A assinatura do Claude.ai não vale aqui: é preciso adicionar créditos em *Billing*.
3. **Instalar a extensão:** descompacte `resolve-ai-0.1.1.zip` numa pasta fixa e abra `chrome://extensions`. Ative o **Modo do desenvolvedor** e clique em **Carregar sem compactação**, escolhendo a pasta.
4. Clique no ícone da extensão e depois em **⚙**. Cole a chave e clique em **Testar Gemini**. Deve aparecer "Funcionou ✓".
   - Se o nome do modelo do Gemini estiver desatualizado, a extensão encontra sozinha o modelo Flash mais novo e salva.
   - Se o modelo estiver sobrecarregado (erro 503), ela tenta outro modelo Flash automaticamente.
   - **No nível gratuito, a pesquisa no Google não está liberada** (confirmado com a sua chave em 22/10/2026): o Gemini responde normalmente, mas sem fontes, e o painel avisa. Para ter fontes, ative o faturamento no AI Studio ou use o Claude.
5. Abra uma página com uma questão e clique no ícone (ou use **Alt+Shift+R**).

## Fase 2: publicar como privada, para aparecer em qualquer Chrome com seu Gmail

1. 👤 **Ativar a verificação em duas etapas** na conta Google: https://myaccount.google.com/signinoptions/twosv
2. 👤 **Criar a conta de desenvolvedor:** em https://chrome.google.com/webstore/devconsole, pague a taxa única de US$ 5 e aceite o contrato.
3. **Gerar o pacote:** rode `./scripts/package.sh` (cria `dist/resolve-ai-<versão>.zip`) ou use o .zip que já foi enviado.
4. 👤 No painel, clique em **Novo item** e envie o .zip.
5. 👤 **Publicar a política de privacidade num endereço público.** Escolha uma das opções:
   - **GitHub Pages:** em *Settings → Pages* do repositório, escolha a pasta `/docs`. O endereço fica `https://alkaizer27.github.io/convert/privacidade.html`. Exige repositório público ou plano pago.
   - **Google Sites ou Google Docs público:** copie o texto de `docs/privacidade.html`.
   - Antes de publicar, troque `SEU-EMAIL-DE-CONTATO` pelo e-mail que você quer mostrar.
6. 👤 **Preencher as abas** copiando os textos de `store/listing-pt-BR.md`:
   - **Item da loja:** descrição, categoria Educação, ícone e imagens da pasta `store/`;
   - **Práticas de privacidade:** finalidade única, justificativa de cada permissão, uso de dados e URL da política;
   - **Distribuição:** visibilidade **Privada**, com seu Gmail em **Testadores autorizados**.
7. 👤 Clique em **Enviar para revisão**. A primeira análise costuma levar de alguns dias a algumas semanas.
8. Depois de aprovada:
   - instale pelo link da loja;
   - remova a versão "sem compactação" em `chrome://extensions`, para não ficar com duas;
   - em qualquer computador onde você entrar no Chrome com seu Gmail (com a sincronização ativada), ela é instalada sozinha.
   - As chaves de API **não** sincronizam: cole de novo em cada computador.

## Atualizações

1. Aumente `version` em `extension/manifest.json` (ex.: `0.1.0` → `0.1.1`).
2. Rode `./scripts/package.sh`.
3. 👤 No painel da loja, abra **Pacote → Enviar novo pacote** e depois **Enviar para revisão**.

## Teste automático

```bash
node tests/smoke.mjs
```

O teste carrega a extensão num Chromium, lê uma página de quiz de exemplo e confere as chamadas para Claude e Gemini, com as APIs simuladas.
