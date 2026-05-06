# PWA e Play Store

Este projeto já tem a base de PWA:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `public/icons/*`
- registro do service worker em `src/components/ServiceWorkerRegister.tsx`
- metadados PWA no `src/app/layout.tsx`

## Antes de publicar

1. Configure `NEXT_PUBLIC_SITE_URL` com o domínio real em produção.
2. Publique o site em HTTPS.
3. Rode uma auditoria Lighthouse na URL publicada e corrija alertas de PWA, performance e acessibilidade.
4. Teste a instalação pelo Chrome no Android.

## Gerar app Android com Bubblewrap

Instale e rode:

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://SEU-DOMINIO/manifest.webmanifest
bubblewrap build
```

Use um package name estável, por exemplo:

```text
br.org.institutobethleite.app
```

O build gera um arquivo `.aab` para envio ao Google Play Console.

## Digital Asset Links

Depois de gerar a chave de assinatura do app, o Bubblewrap informa o conteúdo do arquivo `assetlinks.json`.

Publique esse arquivo em:

```text
https://SEU-DOMINIO/.well-known/assetlinks.json
```

Sem esse arquivo correto, a Trusted Web Activity abre com barra de navegador ou falha na validação.

## Play Console

No Google Play Console, crie o app e preencha:

- descrição curta e completa;
- categoria;
- política de privacidade;
- classificação indicativa;
- segurança dos dados;
- screenshots;
- ícone;
- feature graphic;
- contato do desenvolvedor.

Para contas pessoais recentes, o Google pode exigir testes fechados antes da publicação pública.
