# Fronteira do contrato matemático `ihfr-math-contract-v1`

**Status**: `DECISAO_CONFIRMADA` como formato e governança para consumo futuro. A IMP-005 não executa cálculo, não produz diagnóstico e não define coeficientes científicos.

## Separação de versões

| Referência | Responsabilidade |
|---|---|
| `measurementContractVersion` | significado, formato e validação das medições capturadas |
| `mathContractVersion` | funções, normalizações, pesos, limiares, ausências e saídas científicas |
| `algorithmVersion` | implementação executável que avalia um contrato matemático |
| `contractHash` | hash do manifesto matemático exato usado em uma execução |

Nenhuma dessas referências substitui outra. Dados antigos conservam sua versão de medição; diagnósticos futuros conservam todas as versões e o hash consumidos.

## Manifesto matemático

Um contrato matemático ativável deve ser imutável e conter:

1. `id`, `version`, estado de aprovação, vigência e responsáveis pela aprovação científica e técnica.
2. Entradas referenciadas por IDs estáveis do contrato de medição, com unidade canônica e domínio.
3. Transformação ou normalização de cada entrada, incluindo comportamento nos limites.
4. Subíndices intermediários como grafo acíclico explícito, sem dependência oculta de ordem.
5. Pesos, escala, regra de composição e invariantes verificáveis, incluindo soma esperada quando aplicável.
6. Limiar de cada classe com indicação explícita de fronteira inclusiva ou exclusiva.
7. Política para ausente, desconhecido e não aplicável; nenhum deles vira zero automaticamente.
8. Regra de qualidade/confiança e condição que impede diagnóstico por dados insuficientes.
9. Saídas, intervalo esperado, unidade/escala e explicação rastreável por componente.
10. Hash canônico e conjunto de vetores dourados versionados.

## Interface do avaliador futuro

O avaliador deve ser função pura e determinística:

```text
evaluate(measurementSet, mathContract) -> diagnosisResult
```

Não consulta banco, sessão ou relógio; não corrige entrada; não escolhe automaticamente versão. A camada de aplicação resolve e valida as versões antes da chamada e persiste o resultado com `measurementContractVersion`, `mathContractVersion`, `algorithmVersion`, `contractHash` e `calculatedAt`.

## Vetores dourados

Cada versão ativável precisa de casos independentes de linguagem em JSON ou CSV:

- caso nominal por classe;
- cada fronteira imediatamente abaixo, exatamente nela e imediatamente acima;
- zero, falso e opcionais ausentes;
- combinação insuficiente para diagnóstico;
- valores fora do domínio;
- precisão/arredondamento esperado;
- decomposição esperada de cada subíndice e do resultado final.

TypeScript é a recomendação inicial para reduzir integração. Python pode substituir ou complementar a implementação quando houver justificativa científica/técnica registrada; ambas as implementações devem produzir os mesmos vetores dentro da tolerância declarada pelo contrato.

## Condição de ativação

`ihfr-math-contract-v1` identifica esta fronteira, não uma fórmula ativa. Uma versão calculável posterior só pode ser marcada ativa quando tiver coeficientes, limiares, política de ausência, responsáveis, aprovação e vetores dourados completos. Até lá, a aplicação deve recusar cálculo em vez de inferir valores do schema ou da documentação histórica.
