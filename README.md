# Conecta Ação — versão modular

## Estrutura

```text
index.html       # estrutura e telas
style.css        # aparência responsiva
js/data.js       # dados iniciais e listas fixas
js/storage.js    # armazenamento temporário em localStorage
js/qr.js         # criação de links e QR Codes temporários
js/app.js        # funcionamento do portal e administração
```

## Administração local

1. Acesse a seção **Administração** no fim da página.
2. Entre com `organizacao@conectaacao.org` e `conecta2026`.
3. Use as abas para editar dados da instituição, cadastrar atividades, consultar inscrições e gerar QR Codes.

## Importante

Esta versão é um frontend funcional. Os dados são salvos apenas no navegador em `localStorage`; portanto, não são compartilhados entre computadores e a senha não é segura para uso real.

O próximo passo é substituir `storage.js` por chamadas para uma API e banco de dados (por exemplo, Supabase). No backend real, autenticação, permissões, inscrições e QR Codes temporários precisam ser validados no servidor.