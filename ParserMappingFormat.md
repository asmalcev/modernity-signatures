# Parser Mapping Format

Используемые обозначения:

```txt
__type - внутренний тип, соответствующий шаблону ноды
__parent - тип парсера родительской ноды
```

Типу ноды соответствует лишь один внутренний тип:

```json
{
    "[ParserNodeType]": "[InternalKey]"
}
```

Типу ноды соответствует несколько внутренних типов в зависимости от дополнительных условий:

```json
{
    "[ParserNodeType]": [
        {
            "[PropertyKey]": "[PropertyValue1]",
            "__type": "[InternalKey1]"
        },
        {
            "[PropertyKey]": "[PropertyValue2]",
            "__type": "[InternalKey2]"
        },
    ],

    "[ParserNodeType]": [
        {
            "__parent": "[ParserNodeType1]",
            "__type": "[InternalKey1]"
        },
        {
            "__parent": "[ParserNodeType2]",
            "__type": "[InternalKey2]"
        },
    ],
}
```
