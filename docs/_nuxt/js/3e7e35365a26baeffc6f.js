(window.webpackJsonp=window.webpackJsonp||[]).push([[93],{387:function(n,e,t){"use strict";t.r(e),e.default="# 使用 transform 进行数据转换\n\nApache ECharts<sup>TM</sup> 5 开始支持了“数据转换”（ data transform ）功能。在 echarts 中，“数据转换” 这个词指的是，给定一个已有的“数据集”（[dataset](${optionPath}#dataset)）和一个“转换方法”（[transform](${optionPath}#dataset.transform)），echarts 能生成一个新的“数据集”，然后可以使用这个新的“数据集”绘制图表。这些工作都可以声明式地完成。\n\n抽象地来说，数据转换是这样一种公式：`outData = f(inputData)`。`f` 是转换方法，例如：`filter`、`sort`、`regression`、`boxplot`、`cluster`、`aggregate`(todo) 等等。有了数据转换能力后，我们就至少可以做到这些事情：\n\n- 把数据分成多份用不同的饼图展现。\n- 进行一些数据统计运算，并展示结果。\n- 用某些数据可视化算法处理数据，并展示结果。\n- 数据排序。\n- 去除或直选择数据项。\n- ...\n\n## 数据转换基础使用\n\n在 echarts 中，数据转换是依托于数据集（[dataset](${optionPath}#dataset)）来实现的. 我们可以设置 [dataset.transform](${optionPath}#dataset.transform) 来表示，此 dataset 的数据，来自于此 transform 的结果。\n\n下面是上述例子的效果，三个饼图分别显示了 2011、2012、2013 年的数据。\n\n```js live\nvar option = {\n  dataset: [\n    {\n      // 这个 dataset 的 index 是 `0`。\n      source: [\n        ['Product', 'Sales', 'Price', 'Year'],\n        ['Cake', 123, 32, 2011],\n        ['Cereal', 231, 14, 2011],\n        ['Tofu', 235, 5, 2011],\n        ['Dumpling', 341, 25, 2011],\n        ['Biscuit', 122, 29, 2011],\n        ['Cake', 143, 30, 2012],\n        ['Cereal', 201, 19, 2012],\n        ['Tofu', 255, 7, 2012],\n        ['Dumpling', 241, 27, 2012],\n        ['Biscuit', 102, 34, 2012],\n        ['Cake', 153, 28, 2013],\n        ['Cereal', 181, 21, 2013],\n        ['Tofu', 395, 4, 2013],\n        ['Dumpling', 281, 31, 2013],\n        ['Biscuit', 92, 39, 2013],\n        ['Cake', 223, 29, 2014],\n        ['Cereal', 211, 17, 2014],\n        ['Tofu', 345, 3, 2014],\n        ['Dumpling', 211, 35, 2014],\n        ['Biscuit', 72, 24, 2014]\n      ]\n      // id: 'a'\n    },\n    {\n      // 这个 dataset 的 index 是 `1`。\n      // 这个 `transform` 配置，表示，此 dataset 的数据，来自于此 transform 的结果。\n      transform: {\n        type: 'filter',\n        config: { dimension: 'Year', value: 2011 }\n      }\n      // 我们还可以设置这些可选的属性： `fromDatasetIndex` 或 `fromDatasetId`。\n      // 这些属性，指定了，transform 的输入，来自于哪个 dataset。例如，\n      // `fromDatasetIndex: 0` 表示输入来自于 index 为 `0` 的 dataset 。又例如，\n      // `fromDatasetId: 'a'` 表示输入来自于 `id: 'a'` 的 dataset。\n      // 当这些属性都不指定时，默认认为，输入来自于 index 为 `0` 的 dataset 。\n    },\n    {\n      // 这个 dataset 的 index 是 `2`。\n      // 同样，这里因为 `fromDatasetIndex` 和 `fromDatasetId` 都没有被指定，\n      // 那么输入默认来自于 index 为 `0` 的 dataset 。\n      transform: {\n        // 这个类型为 \"filter\" 的 transform 能够遍历并筛选出满足条件的数据项。\n        type: 'filter',\n        // 每个 transform 如果需要有配置参数的话，都须配置在 `config` 里。\n        // 在这个 \"filter\" transform 中，`config` 用于指定筛选条件。\n        // 下面这个筛选条件是：选出维度（ dimension ）'Year' 中值为 2012 的所有\n        // 数据项。\n        config: { dimension: 'Year', value: 2012 }\n      }\n    },\n    {\n      // 这个 dataset 的 index 是 `3`。\n      transform: {\n        type: 'filter',\n        config: { dimension: 'Year', value: 2013 }\n      }\n    }\n  ],\n  series: [\n    {\n      type: 'pie',\n      radius: 50,\n      center: ['25%', '50%'],\n      // 这个饼图系列，引用了 index 为 `1` 的 dataset 。也就是，引用了上述\n      // 2011 年那个 \"filter\" transform 的结果。\n      datasetIndex: 1\n    },\n    {\n      type: 'pie',\n      radius: 50,\n      center: ['50%', '50%'],\n      datasetIndex: 2\n    },\n    {\n      type: 'pie',\n      radius: 50,\n      center: ['75%', '50%'],\n      datasetIndex: 3\n    }\n  ]\n};\n```\n\n现在我们简单总结下，使用 transform 时的几个要点：\n\n- 在一个空的 dataset 中声明 `transform`, `fromDatasetIndex`/`fromDatasetId` 来表示我们要生成新的数据。\n- 系列引用这个 dataset 。\n\n## 数据转换的进阶使用\n\n#### 链式声明 transform\n\n`transform` 可以被链式声明，这是一个语法糖。\n\n```js\noption = {\n  dataset: [\n    {\n      source: [\n        // 原始数据\n      ]\n    },\n    {\n      // 几个 transform 被声明成 array ，他们构成了一个链，\n      // 前一个 transform 的输出是后一个 transform 的输入。\n      transform: [\n        {\n          type: 'filter',\n          config: { dimension: 'Product', value: 'Tofu' }\n        },\n        {\n          type: 'sort',\n          config: { dimension: 'Year', order: 'desc' }\n        }\n      ]\n    }\n  ],\n  series: {\n    type: 'pie',\n    // 这个系列引用上述 transform 的结果。\n    datasetIndex: 1\n  }\n};\n```\n\n> 注意：理论上，任何 transform 都可能有多个输入或多个输出。但是，如果一个 transform 被链式声明，它只能获取前一个 transform 的第一个输出作为输入（第一个 transform 除外），以及它只能把自己的第一个输出给到后一个 transform （最后一个 transform 除外）。\n\n#### 一个 transform 输出多个 data\n\n在大多数场景下，transform 只需输出一个 data 。但是也有一些场景，需要输出多个 data ，每个 data 可以被不同的 series 或者 dataset 所使用。\n\n例如，在内置的 \"boxplot\" transform 中，除了 boxplot 系列所需要的 data 外，离群点（ outlier ）也会被生成，并且可以用例如散点图系列显示出来。例如，[example](${exampleEditorPath}boxplot-light-velocity)。\n\n我们提供配置 [dataset.fromTransformResult](${optionPath}#dataset.fromTransformResult) 来满足这种情况，例如：\n\n```js\noption = {\n  dataset: [\n    {\n      // 这个 dataset 的 index 为 `0`。\n      source: [\n        // 原始数据\n      ]\n    },\n    {\n      // 这个 dataset 的 index 为 `1`。\n      transform: {\n        type: 'boxplot'\n      }\n      // 这个 \"boxplot\" transform 生成了两个数据：\n      // result[0]: boxplot series 所需的数据。\n      // result[1]: 离群点数据。\n      // 当其他 series 或者 dataset 引用这个 dataset 时，他们默认只能得到\n      // result[0] 。\n      // 如果想要他们得到 result[1] ，需要额外声明如下这样一个 dataset ：\n    },\n    {\n      // 这个 dataset 的 index 为 `2`。\n      // 这个额外的 dataset 指定了数据来源于 index 为 `1` 的 dataset。\n      fromDatasetIndex: 1,\n      // 并且指定了获取 transform result[1] 。\n      fromTransformResult: 1\n    }\n  ],\n  xAxis: {\n    type: 'category'\n  },\n  yAxis: {},\n  series: [\n    {\n      name: 'boxplot',\n      type: 'boxplot',\n      // Reference the data from result[0].\n      // 这个 series 引用 index 为 `1` 的 dataset 。\n      datasetIndex: 1\n    },\n    {\n      name: 'outlier',\n      type: 'scatter',\n      // 这个 series 引用 index 为 `2` 的 dataset 。\n      // 从而也就得到了上述的 transform result[1] （即离群点数据）\n      datasetIndex: 2\n    }\n  ]\n};\n```\n\n另外，[dataset.fromTransformResult](${optionPath}#dataset.fromTransformResult) 和 [dataset.transform](${optionPath}#dataset.transform) 能同时出现在一个 dataset 中，这表示，这个 transform 的输入，是上游的结果中以 `fromTransformResult` 获取的结果。例如：\n\n```js\n{\n  fromDatasetIndex: 1,\n  fromTransformResult: 1,\n  transform: {\n    type: 'sort',\n    config: { dimension: 2, order: 'desc' }\n  }\n}\n```\n\n#### 在开发环境中 debug\n\n使用 transform 时，有时候我们会配不对，显示不出来结果，并且不知道哪里错了。所以，这里提供了一个配置项 `transform.print` 方便 debug 。这个配置项只在开发环境中生效。如下例：\n\n```js\noption = {\n  dataset: [\n    {\n      source: []\n    },\n    {\n      transform: {\n        type: 'filter',\n        config: {},\n        // 配置为 `true` 后， transform 的结果\n        // 会被 console.log 打印出来。\n        print: true\n      }\n    }\n  ]\n  // ...\n};\n```\n\n## 数据转换器 \"filter\"\n\necharts 内置提供了能起过滤作用的数据转换器。我们只需声明 `transform.type: \"filter\"`，以及给出数据筛选条件。如下例：\n\n```js live\noption = {\n  dataset: [\n    {\n      source: [\n        ['Product', 'Sales', 'Price', 'Year'],\n        ['Cake', 123, 32, 2011],\n        ['Latte', 231, 14, 2011],\n        ['Tofu', 235, 5, 2011],\n        ['Milk Tee', 341, 25, 2011],\n        ['Porridge', 122, 29, 2011],\n        ['Cake', 143, 30, 2012],\n        ['Latte', 201, 19, 2012],\n        ['Tofu', 255, 7, 2012],\n        ['Milk Tee', 241, 27, 2012],\n        ['Porridge', 102, 34, 2012],\n        ['Cake', 153, 28, 2013],\n        ['Latte', 181, 21, 2013],\n        ['Tofu', 395, 4, 2013],\n        ['Milk Tee', 281, 31, 2013],\n        ['Porridge', 92, 39, 2013],\n        ['Cake', 223, 29, 2014],\n        ['Latte', 211, 17, 2014],\n        ['Tofu', 345, 3, 2014],\n        ['Milk Tee', 211, 35, 2014],\n        ['Porridge', 72, 24, 2014]\n      ]\n    },\n    {\n      transform: {\n        type: 'filter',\n        config: { dimension: 'Year', '=': 2011 }\n        // 这个筛选条件表示，遍历数据，筛选出维度（ dimension ）\n        // 'Year' 上值为 2011 的所有数据项。\n      }\n    }\n  ],\n  series: {\n    type: 'pie',\n    datasetIndex: 1\n  }\n};\n```\n\n这是 filter 的另一个例子的效果：\n\n<md-example src=\"data-transform-filter\"></md-example>\n\n在 \"filter\" transform 中，有这些要素：\n\n**关于维度（ dimension ）：**\n\n`config.dimension` 指定了维度，能设成这样的值：\n\n- 设定成声明在 dataset 中的维度名，例如 `config: { dimension: 'Year', '=': 2011 }`。不过， dataset 中维度名的声明并非强制，所以我们也可以\n- 设定成 dataset 中的维度 index （index 值从 0 开始）例如 `config: { dimension: 3, '=': 2011 }`。\n\n**关于关系比较操作符：**\n\n关系操作符，可以设定这些：\n`>`（`gt`）、`>=`（`gte`）、`<`（`lt`）、`<=`（`lte`）、`=`（`eq`）、`!=`（`ne`、`<>`）、`reg`。（小括号中的符号或名字，是别名，设置起来作用相同）。他们首先基本地能基于数值大小进行比较，然后也有些额外的功能特性：\n\n- 多个关系操作符能声明在一个 {} 中，例如 `{ dimension: 'Price', '>=': 20, '<': 30 }`。这表示“与”的关系，即，筛选出价格大于等于 20 小于 30 的数据项。\n- data 里的值，不仅可以是数值（ number ），也可以是“类数值的字符串”（“ numeric string ”）。“类数值的字符串”本身是一个字符串，但是可以被转换为字面所描述的数值，例如 `' 123 '`。转换过程中，空格（全角半角空格）和换行符都能被消除（ trim ）。\n- 如果我们需要对日期对象（JS `Date`）或者日期字符串（如 '2012-05-12'）进行比较，我们需要手动指定 `parser: 'time'`，例如 `config: { dimension: 3, lt: '2012-05-12', parser: 'time' }`。\n- 纯字符串比较也被支持，但是只能用在 `=` 或 `!=` 上。而 `>`, `>=`, `<`, `<=` 并不支持纯字符串比较，也就是说，这四个操作符的右值，不能是字符串。\n- `reg` 操作符能提供正则表达式比较。例如， `{ dimension: 'Name', reg: /\\s+Müller\\s*$/ }` 能在 `'Name'` 维度上选出姓 `'Müller'` 的数据项。\n\n**关于逻辑比较：**\n\n我们也支持了逻辑比较操作符 **与或非**（ `and` | `or` | `not` ）：\n\n```js\noption = {\n  dataset: [\n    {\n      source: [\n        // ...\n      ]\n    },\n    {\n      transform: {\n        type: 'filter',\n        config: {\n          // 使用 and 操作符。\n          // 类似地，同样的位置也可以使用 “or” 或 “not”。\n          // 但是注意 “not” 后应该跟一个 {...} 而非 [...] 。\n          and: [\n            { dimension: 'Year', '=': 2011 },\n            { dimension: 'Price', '>=': 20, '<': 30 }\n          ]\n        }\n        // 这个表达的是，选出 2011 年价格大于等于 20 但小于 30 的数据项。\n      }\n    }\n  ],\n  series: {\n    type: 'pie',\n    datasetIndex: 1\n  }\n};\n```\n\n`and`/`or`/`not` 自然可以被嵌套，例如：\n\n```js\ntransform: {\n  type: 'filter',\n  config: {\n    or: [{\n      and: [{\n        dimension: 'Price', '>=': 10, '<': 20\n      }, {\n        dimension: 'Sales', '<': 100\n      }, {\n        not: { dimension: 'Product', '=': 'Tofu' }\n      }]\n    }, {\n      and: [{\n        dimension: 'Price', '>=': 10, '<': 20\n      }, {\n        dimension: 'Sales', '<': 100\n      }, {\n        not: { dimension: 'Product', '=': 'Cake' }\n      }]\n    }]\n  }\n}\n```\n\n**关于解析器（ parser ）：**\n\n还可以指定“解析器”（ parser ）来对值进行解析后再做比较。现在支持的解析器有：\n\n- `parser: 'time'`：把原始值解析成时间戳（ timestamp ）后再做比较。这个解析器的行为，和 `echarts.time.parse` 相同，即，当原始值为时间对象（ JS `Date` 实例），或者是时间戳，或者是描述时间的字符串（例如 `'2012-05-12 03:11:22'` ），都可以被解析为时间戳，然后就可以基于数值大小进行比较。如果原始数据是其他不可解析为时间戳的值，那么会被解析为 NaN。\n- `parser: 'trim'`：如果原始数据是字符串，则把字符串两端的空格（全角半角）和换行符去掉。如果不是字符串，还保持为原始数据。\n- `parser: 'number'`：强制把原始数据转成数值。如果不能转成有意义的数值，那么转成 `NaN`。在大多数场景下，我们并不需要这个解析器，因为按默认策略，“像数值的字符串”就会被转成数值。但是默认策略比较严格，这个解析器比较宽松，如果我们遇到含有尾缀的字符串（例如 `'33%'`, `12px`），我们需要手动指定 `parser: 'number'`，从而去掉尾缀转为数值才能比较。\n\n这个例子显示了如何使用 `parser: 'time'`：\n\n```js\noption = {\n  dataset: [\n    {\n      source: [\n        ['Product', 'Sales', 'Price', 'Date'],\n        ['Milk Tee', 311, 21, '2012-05-12'],\n        ['Cake', 135, 28, '2012-05-22'],\n        ['Latte', 262, 36, '2012-06-02'],\n        ['Milk Tee', 359, 21, '2012-06-22'],\n        ['Cake', 121, 28, '2012-07-02'],\n        ['Latte', 271, 36, '2012-06-22']\n        // ...\n      ]\n    },\n    {\n      transform: {\n        type: 'filter',\n        config: {\n          dimension: 'Date',\n          '>=': '2012-05',\n          '<': '2012-06',\n          parser: 'time'\n        }\n      }\n    }\n  ]\n};\n```\n\n**形式化定义：**\n\n最后，我们给出，数据转换器 \"filter\" 的 config 的形式化定义：\n\n```ts\ntype FilterTransform = {\n  type: 'filter';\n  config: ConditionalExpressionOption;\n};\ntype ConditionalExpressionOption =\n  | true\n  | false\n  | RelationalExpressionOption\n  | LogicalExpressionOption;\ntype RelationalExpressionOption = {\n  dimension: DimensionName | DimensionIndex;\n  parser?: 'time' | 'trim' | 'number';\n  lt?: DataValue; // less than\n  lte?: DataValue; // less than or equal\n  gt?: DataValue; // greater than\n  gte?: DataValue; // greater than or equal\n  eq?: DataValue; // equal\n  ne?: DataValue; // not equal\n  '<'?: DataValue; // lt\n  '<='?: DataValue; // lte\n  '>'?: DataValue; // gt\n  '>='?: DataValue; // gte\n  '='?: DataValue; // eq\n  '!='?: DataValue; // ne\n  '<>'?: DataValue; // ne (SQL style)\n  reg?: RegExp | string; // RegExp\n};\ntype LogicalExpressionOption = {\n  and?: ConditionalExpressionOption[];\n  or?: ConditionalExpressionOption[];\n  not?: ConditionalExpressionOption;\n};\ntype DataValue = string | number | Date;\ntype DimensionName = string;\ntype DimensionIndex = number;\n```\n\n> 注意：使用[按需引入](${lang}/basics/import#按需引入-echarts-图表和组件)接口时，如果需要使用该内置转换器，除了 `Dataset` 组件，还需引入 `Transform` 组件。\n\n```ts\nimport {\n  DatasetComponent,\n  TransformComponent\n} from 'echarts/components';\n\necharts.use([\n  DatasetComponent,\n  TransformComponent\n]);\n```\n\n## 数据转换器 \"sort\"\n\n\"sort\" 是另一个内置的数据转换器，用于排序数据。目前主要能用于在类目轴（ `axis.type: 'category'` ）中显示排过序的数据。例如：\n\n```js\noption = {\n  dataset: [\n    {\n      dimensions: ['name', 'age', 'profession', 'score', 'date'],\n      source: [\n        [' Hannah Krause ', 41, 'Engineer', 314, '2011-02-12'],\n        ['Zhao Qian ', 20, 'Teacher', 351, '2011-03-01'],\n        [' Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],\n        ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],\n        [' Karle Neumann ', 25, 'Engineer', 253, '2011-04-02'],\n        [' Adrian Groß', 19, 'Teacher', null, '2011-01-16'],\n        ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],\n        [' Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],\n        ['Han Meimei ', 67, 'Engineer', 366, '2011-03-12']\n      ]\n    },\n    {\n      transform: {\n        type: 'sort',\n        // 按分数排序\n        config: { dimension: 'score', order: 'asc' }\n      }\n    }\n  ],\n  series: {\n    type: 'bar',\n    datasetIndex: 1\n  }\n  // ...\n};\n```\n\n<md-example src=\"data-transform-sort-bar\"></md-example>\n\n数据转换器 \"sort\" 还有一些额外的功能：\n\n- 可以多重排序，多个维度一起排序。见下面的例子。\n- 排序规则是这样的：\n  - 默认按照数值大小排序。其中，“可转为数值的字符串”也被转换成数值，和其他数值一起按大小排序。\n  - 对于其他“不能转为数值的字符串”，也能在它们之间按字符串进行排序。这个特性有助于这种场景：把相同标签的数据项排到一起，尤其是当多个维度共同排序时。见下面的例子。\n  - 当“数值及可转为数值的字符串”和“不能转为数值的字符串”进行排序时，或者它们和“其他类型的值”进行比较时，它们本身是不知如何进行比较的。那么我们称呼“后者”为“incomparable”，并且可以设置 `incomparable: 'min' | 'max'` 来指定一个“incomparable”在这个比较中是最大还是最小，从而能使它们能产生比较结果。这个设定的用途，比如可以是，决定空值（例如 `null`, `undefined`, `NaN`, `''`, `'-'`）在排序的头还是尾。\n- 解析器 `parser: 'time' | 'trim' | 'number'` 可以被使用，和数据转换器 \"filter\" 中的情况一样。\n  - 如果要对时间进行排序（例如，值为 JS `Date` 实例或者时间字符串如 `'2012-03-12 11:13:54'`），我们需要声明 `parser: 'time'`。\n  - 如果需要对有后缀的数值进行排序（如 `'33%'`, `'16px'`）我们需要声明 `parser: 'number'`。\n\n这是一个“多维度排序”的例子。\n\n```js\noption = {\n  dataset: [\n    {\n      dimensions: ['name', 'age', 'profession', 'score', 'date'],\n      source: [\n        [' Hannah Krause ', 41, 'Engineer', 314, '2011-02-12'],\n        ['Zhao Qian ', 20, 'Teacher', 351, '2011-03-01'],\n        [' Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],\n        ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],\n        [' Karle Neumann ', 25, 'Engineer', 253, '2011-04-02'],\n        [' Adrian Groß', 19, 'Teacher', null, '2011-01-16'],\n        ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],\n        [' Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],\n        ['Han Meimei ', 67, 'Engineer', 366, '2011-03-12']\n      ]\n    },\n    {\n      transform: {\n        type: 'sort',\n        config: [\n          // 对两个维度按声明的优先级分别排序。\n          { dimension: 'profession', order: 'desc' },\n          { dimension: 'score', order: 'desc' }\n        ]\n      }\n    }\n  ],\n  series: {\n    type: 'bar',\n    datasetIndex: 1\n  }\n  //...\n};\n```\n\n<md-example src=\"doc-example/data-transform-multiple-sort-bar\"></md-example>\n\n最后，我们给出数据转换器 \"sort\" 的 config 的形式化定义。\n\n```ts\ntype SortTransform = {\n  type: 'filter';\n  config: OrderExpression | OrderExpression[];\n};\ntype OrderExpression = {\n  dimension: DimensionName | DimensionIndex;\n  order: 'asc' | 'desc';\n  incomparable?: 'min' | 'max';\n  parser?: 'time' | 'trim' | 'number';\n};\ntype DimensionName = string;\ntype DimensionIndex = number;\n```\n\n> 注意：使用[按需引入](${lang}/basics/import#按需引入-echarts-图表和组件)接口时，如果需要使用该内置转换器，除了 `Dataset` 组件，还需引入 `Transform` 组件。\n\n```ts\nimport {\n  DatasetComponent,\n  TransformComponent\n} from 'echarts/components';\n\necharts.use([\n  DatasetComponent,\n  TransformComponent\n]);\n```\n\n## 使用外部的数据转换器\n\n除了上述的内置的数据转换器外，我们也可以使用外部的数据转换器。外部数据转换器能提供或自己定制更丰富的功能。下面的例子中，我们使用第三方库 [ecStat](https://github.com/ecomfe/echarts-stat) 提供的数据转换器。\n\n生成数据的回归线：\n\n```js\n// 首先要注册外部数据转换器。\necharts.registerTransform(ecStatTransform(ecStat).regression);\n```\n\n```js\noption = {\n  dataset: [\n    {\n      source: rawData\n    },\n    {\n      transform: {\n        // 引用注册的数据转换器。\n        // 注意，每个外部的数据转换器，都有名空间（如 'ecStat:xxx'，'ecStat' 是名空间）。\n        // 而内置数据转换器（如 'filter', 'sort'）没有名空间。\n        type: 'ecStat:regression',\n        config: {\n          // 这里是此外部数据转换器所需的参数。\n          method: 'exponential'\n        }\n      }\n    }\n  ],\n  xAxis: { type: 'category' },\n  yAxis: {},\n  series: [\n    {\n      name: 'scatter',\n      type: 'scatter',\n      datasetIndex: 0\n    },\n    {\n      name: 'regression',\n      type: 'line',\n      symbol: 'none',\n      datasetIndex: 1\n    }\n  ]\n};\n```\n\n一些使用 echarts-stat 的例子：\n\n- [聚集 (Aggregate)](${exampleEditorPath}data-transform-aggregate&edit=1&reset=1)\n- [直方图 (Histogram)](${exampleEditorPath}bar-histogram&edit=1&reset=1)\n- [简单聚类 (Clustering)](${exampleEditorPath}scatter-clustering&edit=1&reset=1)\n- [线性回归线 (Linear Regression)](${exampleEditorPath}scatter-linear-regression&edit=1&reset=1)\n- [指数回归线 (Exponential Regression)](${exampleEditorPath}scatter-exponential-regression&edit=1&reset=1)\n- [对数回归线 (Logarithmic Regression)](${exampleEditorPath}scatter-logarithmic-regression&edit=1&reset=1)\n- [多项式回归线 (Polynomial Regression)](${exampleEditorPath}scatter-polynomial-regression&edit=1&reset=1)\n"}}]);