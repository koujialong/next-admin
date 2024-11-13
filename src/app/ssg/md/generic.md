# ts generic 泛型
软件工程中，我们不仅要创建一致的定义良好的API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。
在像C#和Java这样的语言中，可以使用`泛型`来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。
## 基本使用
```ts
function identity<T>(arg: T): T {
    return arg;
}
```
我们给`identity`添加了类型变量`T`。 `T`帮助我们捕获用户传入的类型（比如：`number`），之后我们就可以使用这个类型。 之后我们再次使用了 `T`当做返回值类型。
现在我们可以知道参数类型与返回值类型是相同的了。 这允许我们跟踪函数里使用的类型的信息。

我们把这个版本的identity函数叫做泛型，因为它可以适用于多个类型。 不同于使用 `any`，它不会丢失信息，像第一个例子那像保持准确性，传入数值类型并返回数值类型。

我们定义了泛型函数后，可以用两种方法使用。 第一种是，传入所有的参数，包含类型参数：
```ts
let output = identity<string>("myString");  // type of output will be 'string'
```
这里我们明确的指定了`T`是`string`类型，并做为一个参数传给函数，使用了`<>`括起来而不是`()`。

第二种方法更普遍。利用了类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定`T`的类型：
```ts
let output = identity("myString");  // type of output will be 'string'
```
注意我们没必要使用尖括号（`<>`）来明确地传入类型；编译器可以查看myString的值，然后把`T`设置为它的类型。 类型推论帮助我们保持代码精简和高可读性。
如果编译器不能够自动地推断出类型的话，只能像上面那样明确的传入`T`的类型，在一些复杂的情况下，这是可能出现的。

## 使用泛型变量
使用泛型创建像`identity`这样的泛型函数时，编译器要求你在函数体必须正确的使用这个通用的类型。 换句话说，你必须把这些参数当做是任意或所有类型。

看下之前`identity`例子：
```ts
function identity<T>(arg: T): T {
    return arg;
}
```
如果我们想同时打印出`arg`的长度。 我们很可能会这样做：
```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```
如果这么做，编译器会报错说我们使用了`arg`的`.length`属性，但是没有地方指明`arg`具有这个属性。 记住，这些类型变量代表的是任意类型，所以使用这个函数的人可能传入的是个数字，而数字是没有 `.length`属性的。

现在假设我们想操作`T`类型的数组而不直接是`T`。由于我们操作的是数组，所以`.length`属性是应该存在的。 我们可以像创建其它数组一样创建这个数组：
```ts
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```
你可以这样理解`loggingIdentity`的类型：泛型函数`loggingIdentity`，接收类型参数`T`，和函数`arg`，它是个元素类型是`T`的数组，并返回元素类型是`T`的数组。 
如果我们传入数字数组，将返回一个数字数组，因为此时`T`的的类型为`number`。 这可以让我们把泛型变量`T`当做类型的一部分使用，而不是整个类型，增加了灵活性。

## 泛型接口
我们来到了泛型接口；让我们创建一个泛型接口来与 `identities()` 一起使用：
```ts
interface Identities<V, W> {
   id1: V,
   id2: W
}
```
我在这里使用 `V` 和 `W` 作为类型变量来表示任何字母(或有效的字母和数字名称的组合)都是可以的——除了用于常规目的之外，它们的名称没有任何意义。

现在，我们可以将这个接口应用为 `identities()` 的返回类型，并稍稍修改返回类型去迎合它。我们还可以 `console.log` 这些参数和它们的类型，以便进一步说明:
```ts
function identities<T, U> (arg1: T, arg2: U): Identities<T, U> {
   console.log(arg1 + ": " + typeof (arg1));
   console.log(arg2 + ": " + typeof (arg2));
   let identities: Identities<T, U> = {
    id1: arg1,
    id2: arg2
  };
  return identities;
}
```
我们现在 `identities()` 所做的是将类型 `T` 和 `U` 传递到函数和 `Identities` 接口中，使我们能够定义与参数类型相关的返回类型。

注意:如果编译 TS 项目并查找泛型，则不会找到任何泛型。由于在 Javascript 中不支持泛型，所以在编译器生成的构建中不会看到泛型。泛型纯粹是用于编译时的开发安全网，它将确保代码的类型安全抽象。

## 泛型类
泛型类看上去与泛型接口差不多。 泛型类使用（ `<>` ）括起泛型类型，跟在类名后面。
```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

## 泛型约束
我们定义一个接口来描述约束条件。 创建一个包含 `.length`属性的接口，使用这个接口和`extends`关键字还实现约束：
```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```
现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：
```ts
loggingIdentity(3);  // Error, number doesn't have a .length property
```
我们需要传入符合约束类型的值，必须包含必须的属性：
```ts
loggingIdentity({length: 10, value: 3});
```

## 在泛型约束中使用类型参数
你可以声明一个类型参数，且它被另一个类型参数所约束。比如，
```ts
function find<T, U extends Findable<T>>(n: T, s: U) {
  // ...
}
find (giraffe, myAnimals);
```

## 在泛型里使用类类型
在 TypeScript 使用泛型创建工厂函数时，需要引用构造函数的类类型。比如，
```ts
function create<T>(c: {new(): T; }): T {
    return new c();
}
```
一个更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。
```ts
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function findKeeper<A extends Animal, K> (a: {new(): A;
    prototype: {keeper: K}}): K {

    return a.prototype.keeper;
}

findKeeper(Lion).nametag;  // typechecks!
```
