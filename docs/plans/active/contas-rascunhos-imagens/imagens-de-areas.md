# Imagens de áreas monitoradas

## Decisão e primeiro recorte

`DECISAO_CONFIRMADA`: upload via API Cloudinary, plano gratuito inicialmente.

| Opção | Vantagem | Custo/risco | Estado |
|---|---|---|---|
| Uma foto de capa | Compatível com `CollectionArea.image`, UI simples e menor consumo | Não registra evolução temporal | `RECOMENDACAO` inicial. |
| Galeria | Histórico/contexto rico | Ordenação, legenda, autoria, quotas, moderação e privacidade | Futuro/pendente. |

O campo atual é somente `String?` e não é exposto pelos DTOs nem escrito pelo serviço. Não deve ser ligado diretamente a uma URL do cliente. Recomenda-se modelo `AreaImage` com ownership/metadados e migração compatível.

## Upload seguro recomendado

1. Usuário escolhe arquivo; cliente faz checagem preliminar, nunca autoritativa.
2. Backend revalida conta `ACTIVE`, papel, vínculo, laboratório ativo e área contextual.
3. Backend emite assinatura Cloudinary curta com parâmetros fechados: `resource_type=image`, timestamp, public ID aleatório/prefixo controlado, preset/transformações aprovados, `overwrite=false`.
4. Cliente envia direto ao endpoint HTTPS Cloudinary. `api_secret` nunca é exposto.
5. Cliente finaliza no backend; backend valida assinatura/resposta e, quando necessário, consulta Admin API por `asset_id`.
6. Backend checa tipo real, formato, bytes, dimensões e pertencimento ao namespace esperado; persiste nova capa e job de cleanup da anterior.

Uploads unsigned são possíveis no provedor, mas o preset pode ser reutilizado por quem o conhece. `RECOMENDACAO`: signed upload devido a área autenticada, ownership e custo limitado do plano gratuito.

## Acesso e privacidade

Cloudinary `upload` é público por padrão; `private` restringe original, e `authenticated` restringe original e derivados mediante acesso assinado. Fotos podem expor pessoas, localização, placas e características ambientais.

`PENDENCIA_DE_DECISAO`: nível de acesso. Padrão conservador recomendado: `authenticated` e URLs assinadas/curtas entregues após autorização. Se a equipe confirmar que capas são públicas, registrar a decisão e ainda remover metadados EXIF, evitar nome original e aplicar moderação/consentimento operacional.

## Validação e processamento

`PROPOSTA` inicial: JPEG, PNG e WebP; máximo 10 MiB de entrada; limites de dimensão configuráveis; orientação normalizada; EXIF removido; derivado de capa em tamanho definido pela UI e formato automático apenas se custo/compatibilidade forem medidos. MIME, magic bytes e decodificação real devem concordar; extensão não basta. SVG/raw ficam fora.

Não codificar quotas atuais no produto. Acompanhar créditos Cloudinary (armazenamento, largura de banda e transformações conforme plano), restringir transformações arbitrárias e revisar console/documentação antes da ativação.

## Substituição, exclusão e órfãos

- Nova imagem só vira atual após upload verificado e commit SQL.
- Antiga é destruída depois por job idempotente usando `asset_id`/`public_id`; falha gera retry.
- Se persistência falha após upload, registrar/encaminhar o novo asset para cleanup; nunca apagar a capa antiga.
- Exclusão remove referência/torna estado `PENDING_DELETE` e agenda destroy autenticado. Repetição trata `not found` como sucesso reconciliado.
- Reconciliador compara assets do namespace/tag com registros, respeita janela de segurança e nunca apaga automaticamente objeto desconhecido sem ownership comprovado.
- Deletar área continua regido pelas regras atuais; não introduzir cascade externo silencioso.

## DTO proposto

```json
{"image":{"url":"URL autorizada ou derivada","width":1200,"height":800,"alt":"Foto da área Nome","revision":3}}
```

Não retornar `apiKey`, assinatura reutilizável, `apiSecret`, tags internas, asset de outra área ou resposta bruta do provedor. Texto alternativo padrão descreve função/área; legenda humana fica para galeria futura.
