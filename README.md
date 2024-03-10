# modernity-signatures

## Факторы, по которым можно судить о современности кода

- Объявление переменных: `var, let, const`
- Standard built-in objects: `Promise, BigInt, ...`
- Методы объектов: например, у массива `map, filter, reduce, ...`
- Синтаксис: `private properties, async/await, generator, for in, for of`

## Как найти факторы в дереве babel/parser

| Фактор | Как найти |
|---|---|
| `var, let, const` | `(type VariableDeclaration).kind` |
| `generator` | `(type FunctionDeclaration).generator` |
| `async/await` | `(type FunctionDeclaration).async` |
| `private properties` | `(type ClassDeclaration).body(type ClassBody).body.(type ClassPrivateProperty)` |
| `static properties` | `(type ClassDeclaration).body(type ClassBody).body.(type ClassProperty).static` |
| `for` | `(type ForStatement)` |
| `for in` | `(type ForInStatement)` |
| `for of` | `(type ForOfStatement)` |
| ... | ... |

## ??

<https://codereview.stackexchange.com/questions/147892/small-javascript-library-for-ecmascript-version-detection>
