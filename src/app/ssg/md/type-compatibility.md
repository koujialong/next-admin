# ts 类型兼容性

TypeScript里的类型兼容性是基于结构子类型的。 结构类型是一种只使用其成员来描述类型的方式。 它正好与名义（nominal）类型形成对比。
```ts
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// OK, because of structural typing
p = new Person();
```
在使用基于名义类型的语言，比如C#或Java中，这段代码会报错，因为Person类没有明确说明其实现了Named接口。

TypeScript的结构性子类型是根据JavaScript代码的典型写法来设计的。 因为JavaScript里广泛地使用匿名对象，例如函数表达式和对象字面量，所以使用结构类型系统来描述这些类型比使用名义类型系统更好。

## 基础
TypeScript结构化类型系统的基本规则是，如果`x`要兼容`y`，那么`y`至少具有与`x`相同的属性。比如：
```ts
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y;
```
这里要检查`y`是否能赋值给`x`，编译器检查`x`中的每个属性，看是否能在`y`中也找到对应属性。 在这个例子中，y必须包含名字是`name`的`string`类型成员。`y`满足条件，因此赋值正确。

检查函数参数时使用相同的规则：
```ts
function greet(n: Named) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
```
注意，`y`有个额外的`location`属性，但这不会引发错误。 只有目标类型（这里是 `Named`）的成员会被一一检查是否兼容。

这个比较过程是递归进行的，检查每个成员及子成员。

## 比较两个函数
相对来讲，在比较原始类型和对象类型的时候是比较容易理解的，问题是如何判断两个函数是兼容的。 下面我们从两个简单的函数入手，它们仅是参数列表略有不同
```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```
下面来看看如何处理返回值类型，创建两个仅是返回值类型不同的函数：
```ts
let x = () => ({name: 'Alice'});
let y = () => ({name: 'Alice', location: 'Seattle'});

x = y; // OK
y = x; // Error because x() lacks a location property
```

## 函数参数双向协变
当比较函数参数类型时，只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功。 这是不稳定的，因为调用者可能传入了一个具有更精确类型信息的函数，
但是调用这个传入的函数的时候却使用了不是那么精确的类型信息。 实际上，这极少会发生错误，并且能够实现很多JavaScript里的常见模式。例如：
```ts
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y));
listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + ',' + e.y)));

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

## 可选参数及剩余参数
比较函数兼容性的时候，可选参数与必须参数是可交换的。 原类型上额外的可选参数并不会造成错误，目标类型的可选参数没有对应的参数也不是错误。

当一个函数有剩余参数时，它被当做无限个可选参数。

这对于类型系统来说是不稳定的，但从运行时的角度来看，可选参数一般来说是不强制的，因为对于大多数函数来说相当于传递了一些`undefinded`。

有一个好的例子，常见的函数接收一个回调函数并用对于程序员来说是可预知的参数但对类型系统来说是不确定的参数来调用：
```ts
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ', ' + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ', ' + y));
```

## 枚举
枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的。比如，
```ts
enum Status { Ready, Waiting };
enum Color { Red, Blue, Green };

let status = Status.Ready;
status = Color.Green;  //error
```

## 类
类与对象字面量和接口差不多，但有一点不同：类有静态部分和实例部分的类型。 比较两个类类型的对象时，只有实例的成员会被比较。 静态成员和构造函数不在比较的范围内。
```ts
class Animal {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size {
    feet: number;
    constructor(numFeet: number) { }
}

let a: Animal;
let s: Size;

a = s;  //OK
s = a;  //OK
```
### 类的私有成员
私有成员会影响兼容性判断。 当类的实例用来检查兼容时，如果它包含一个私有成员，那么目标类型必须包含来自同一个类的这个私有成员。 这允许子类赋值给父类，但是不能赋值给其它有同样类型的类。

## 泛型
因为TypeScript是结构性的类型系统，类型参数只影响使用其做为类型一部分的结果类型。比如，
```ts
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // okay, y matches structure of x
```
上面代码里，`x` 和`y`是兼容的，因为它们的结构使用类型参数时并没有什么不同。 把这个例子改变一下，增加一个成员，就能看出是如何工作的了：
```ts
interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // error, x and y are not compatible
```
在这里，泛型类型在使用时就好比不是一个泛型类型。

对于没指定泛型类型的泛型参数时，会把所有泛型参数当成any比较。 然后用结果类型进行比较，就像上面第一个例子。

比如，
```ts
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // Okay because (x: any)=>any matches (y: any)=>any
```

