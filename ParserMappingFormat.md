# Parser Mapping Format

Используемые обозначения:

```txt
__type - внутренний идентификатор, соответствующий шаблону ноды
__parent - тип родительской ноды
__any_parent - тип любого из родителей вверх по дереву
__negative - нода должна не соответствовать шаблону
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
