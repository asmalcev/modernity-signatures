# modernity-signatures

## Факторы, по которым можно судить о версии исходного кода

- Объявление переменных: `var, let, const`
- Standard built-in objects: `Promise, BigInt, ...`
- Методы объектов: например, у массива `map, filter, reduce, ...`
- Синтаксис: `private properties, async/await, generator, for in, for of, template literals, arrow function expressions`

## Как найти факторы в дереве babel/parser

| Фактор               | Как найти                                                                       |
| -------------------- | ------------------------------------------------------------------------------- |
| `var, let, const`    | `(type VariableDeclaration).kind`                                               |
| `generator`          | `(type FunctionDeclaration).generator`                                          |
| `async/await`        | `(type FunctionDeclaration).async`                                              |
| `private properties` | `(type ClassDeclaration).body(type ClassBody).body.(type ClassPrivateProperty)` |
| `static properties`  | `(type ClassDeclaration).body(type ClassBody).body.(type ClassProperty).static` |
| `for`                | `(type ForStatement)`                                                           |
| `for in`             | `(type ForInStatement)`                                                         |
| `for of`             | `(type ForOfStatement)`                                                         |
| ...                  | ...                                                                             |

## ??

<https://codereview.stackexchange.com/questions/147892/small-javascript-library-for-ecmascript-version-detection>
<https://gist.github.com/bgoonz/9816ce9ac7ddad2ae0cbd7f192f17bf1>
<https://docs.w3cub.com/javascript>
<https://github.com/mdn/browser-compat-data/tree/main>

## Алгоритм

1. Обходим AST дерево
2. Определяем текущий элемент
3. Смотрим информацию в compat data
4. Если есть вложенные, то для каждого из них запускаем шаг [2]
5. Переходим к следующему элементу и запускаем для него шаг [2] или завершаем, если следующего нет

