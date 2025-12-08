# Assertion 単体試験 簡易ツール

　テスト結果を次のように一覧したい。HTML画面とconsoleで。

```
例外 E
失敗 F
保留 H
成功 S
```

* ブラウザで実行できること（Node.js不要）
* EMS不要で実行できること（`<script type="module">`＋`import`でないと使えないのは困る）
* テスト結果が一目で判ること（成否）
    * テスト件数が一目で判ること（数）
        * テスト結果の内容が一目で判ること（色、字）
            * 成功: 緑
            * 失敗: 赤
            * 例外: 青
            * 保留: 灰
    * 修正すべき箇所が一目で判ること
        * 問題種別: 失敗／例外
        * 問題箇所のファイルパスと行列位置
    * ダークモードに対応すること
* テストしたい内容を式で書けること
* テスト結果が真／偽／例外のいずれか期待値を定義できること
* 引数

```javascript
eqTrue(true);      // 成功+1
eqTrue(false);     // 失敗+1
eqTrue(()=>true);  // 成功+1
eqTrue(()=>false); // 失敗+1
eqTrue(()=>{throw new Error()}) // 例外+1
eqTrue(async()=>true); // 保留+1のち保留-1し最後に成功+1
```

# Assertion不満一覧

* 最初に`cont a = new Assertion()`せねばならない
* 最後に`a.fin()`を呼び出さねばならない
* 引数テストパターンの実装を配列渡すだけで実装できない（エラーテスト時も同じ）

# 改善案

```javascript
const a = new Assertion();
a.t();
a.f();
a.e();
// a.fin(); がなくてもasync()なテスト実行完了を待機してくれる仕組みをどうにかして作る。
```
```javascript
a.t(true);  // 例外発生時はキャッチできない（カウントされず実行時エラーになる）
a.t(false); // 例外発生時はキャッチできない（カウントされず実行時エラーになる）
a.t(()=>{throw new Error()}); // 例外カウントされる
a.t(()=>true);
a.t(async()=>true);

// 以下は期待値パターンがないため場合によっては使えない。もっと使いやすいインタフェースはないか？
a.t(()=>[引数パターン1,引数パターン2], (...args)=>true); // 引数パターン一つあたり値が一つだけの場合はこちらが使える（もし全部配列なら以下と区別がつかなくなるので注意）
a.t(()=>[[引数パターン1],[引数パターン2]], (...args)=>true); 
a.t(async()=>[引数パターン1,引数パターン2], (...args)=>true);
a.t(async()=>[[引数パターン1],[引数パターン2]], (...args)=>true); 
a.t(()=>[引数パターン1,引数パターン2], async(...args)=>true);
a.t(()=>[[引数パターン1],[引数パターン2]], async(...args)=>true); 
a.t(async()=>[引数パターン1,引数パターン2], async(...args)=>true);
a.t(async()=>[[引数パターン1],[引数パターン2]], async(...args)=>true); 
```
```javascript
a.f(true);  // 例外発生時はキャッチできない（カウントされず実行時エラーになる）
a.f(false); // 例外発生時はキャッチできない（カウントされず実行時エラーになる）
a.t(()=>{throw new Error()}); // 例外カウントされる
a.f(()=>false);
a.f(async()=>false);

// 以下は期待値パターンがないため場合によっては使えない。もっと使いやすいインタフェースはないか？
a.f(()=>[引数パターン1,引数パターン2], (...args)=>false); // 引数パターン一つあたり値が一つだけの場合はこちらが使える（もし全部配列なら以下と区別がつかなくなるので注意）
a.f(()=>[[引数パターン1],[引数パターン2]], (...args)=>false)
a.f(async()=>[引数パターン1,引数パターン2], (...args)=>false);
a.f(async()=>[[引数パターン1],[引数パターン2]], (...args)=>false)
a.f(()=>[引数パターン1,引数パターン2], async(...args)=>false);
a.f(()=>[[引数パターン1],[引数パターン2]], async(...args)=>false)
a.f(async()=>[引数パターン1,引数パターン2], async(...args)=>false);
a.f(async()=>[[引数パターン1],[引数パターン2]], async(...args)=>false)
```
```javascript
a.e(Error, `message`, ()=>{throw Error(`message`)});
a.e(Error, `message`, (()=>[引数パターン1,引数パターン2], (...args)=>{throw Error(`message`)});
a.e(Error, `message`, (()=>[[引数パターン1],[引数パターン2]], (...args)=>{throw Error(`message`)});
```

　尚、次のように異なる複数のテストを一つのメソッドで一括実行することはしない。理由はテスト問題発生時にその箇所が解りにくくなるから。問題発生コード行数はこのメソッドを呼び出した行数になるが、引数で渡した全テストが同じ行数を返してしまう。これではどのテストに問題があったか特定しづらい。よってこの方法は提供しない。

```javascript
a.ts(
    true,
    false,
    ()=>true,
    ()=>false,
    ()=>{throw new Error('message')},
    async()=>true,
    async()=>false,
    async()=>{throw new Error('message')},
    ...,
);
a.fs(上記に同じ);
```

　では、引数パターンを複数指定して一つのテストにまとめるのはどうか。これならテスト内容は一つにできるから、どのテストで問題があったか判別しやすいはず。

```javascript
a.cases(
    ()=>[引数パターン1,引数パターン2],
    (...args)=>true,
);
```
```javascript
a.cases(
    ()=>[引数パターン1,引数パターン2],
    ()=>[期待値パターン1,期待値パターン2], // [(...args)=>true, (...args)=>false]
);
// このパターンはa.t();をそれぞれ一個ずつ書くのと同じ。先述の通り異なる複数のテストを一箇所に書くと問題箇所の特定が困難になる問題があるので避けるべき。
```

* 引数パターン
    * 結果がどれも同じになる場合
    * 結果がそれぞれ異なる場合
        * 結果が同じ式で表現できる場合（引数を変数として同一の式を創れば異なる結果を同じ式で統一できる場合）

　上記はつまり、複数の引数パターンがあれど、引数を変数として同一の式で真偽判定できる場合を意味する。つまり以下の場合のみ存在意義がある。

```javascript
a.cases(
    ()=>[引数パターン1,引数パターン2],
    (...args)=>true,
);
```

　あとは結果が真／偽／例外のいずれかであるかを指定し区別できれば良さそう。つまり以下のようなメソッドを新設する価値がありそう。

```javascript
a.tc(()=>[引数パターン1,引数パターン2], (...args)=>true);
a.fc(()=>[引数パターン1,引数パターン2], (...args)=>true);
a.fc(Error, 'message', ()=>[引数パターン1,引数パターン2], (...args)=>true);
```

　式でなく単純な値でも渡せるようにしたい。それが可能なのは引数パターンだけ。テストケースは関数式で書かねばならない。引数が必要だから。

```javascript
a.tc([引数パターン1,引数パターン2], (...args)=>true);
a.fc([引数パターン1,引数パターン2], (...args)=>true);
a.ec(Error, 'message', [引数パターン1,引数パターン2], (...args)=>true);
```

　引数パターン生成とテストケースは任意で`async`も使えるようにしたい。テストケースで`async`があれば実行時は完了までの間一時的に保留される。

```javascript
a.tc(async()=>[引数パターン1,引数パターン2], async(...args)=>true);
a.fc(async()=>[引数パターン1,引数パターン2], async(...args)=>true);
a.ec(Error, 'message', async()=>[引数パターン1,引数パターン2], async(...args)=>true);
```

# 実装

```javascript
const a = new Assertion();
a.t(true);
a.t(async()=>true);
a.f(false);
a.f(async()=>false);
a.e(Error, 'message', ()=>{throw new Error(`message`)});
a.e(Error, 'message', async()=>{throw new Error(`message`)});
// a.fin();を呼び出さずとも完了か否か判断できるようにしたい。
```

　テストケースが何個あるか不明であり、いつ定義を完了させたかも不定である。このとき、どうやって完了したか否かを判断するか。

　簡単なのは以下のように一つのメソッド内で全テストケースの定義を完了させること。このとき`a`は旧コードの`new Assertion()`インスタンスである。欠点はコードがネストすること。

```javascript
Assertion.tests((a)=>{
    a.t(true);
    a.t(async()=>true);
    a.f(false);
    a.f(async()=>false);
    a.e(Error, 'message', ()=>{throw new Error(`message`)});
    a.e(Error, 'message', async()=>{throw new Error(`message`)});
    // a.fin();を呼び出さずとも完了か否か判断できるようにしたい。
})
```
```javascript
Unitest.assert((a)=>{
    a.t(true);
    a.t(async()=>true);
    a.f(false);
    a.f(async()=>false);
    a.e(Error, 'message', ()=>{throw new Error(`message`)});
    a.e(Error, 'message', async()=>{throw new Error(`message`)});
    // a.fin();を呼び出さずとも完了か否か判断できるようにしたい。
});
```
```javascript
class Unitest {
    static assert(fn) {
        const a = new Assertion();
        fn(a);         // テストケースの定義
        this.#test(a); // テストケースの実行
        this.#show(a); // テストケースの表示
    }
    static #test(a) {// 全テストを実行する

    }
}
class Assertion {// Unitest.assert((a)=>{})のように利用者は外部からAssertインスタンスとして利用する
    constructor() {} // 内部で全テストケースを関数として保持する
    t() {}
    f() {}
    e() {}
    tc() {}
    fc() {}
    ec() {}
}
class Show {// テスト結果をHTMLに画面表示する（結果一覧。問題箇所一覧。）

}
```

* 単体試験(UnitTest)
    * Assertion(主張)
        * 真／偽／例外(型,メッセージ)
            * 式
                * `async`


* ソースコード上


# カバレッジ率について

　カバレッジ率は、ソースコード上において一度でも実行した部分の比率を指す。これが100%なら、少なくとも一度は全コードを実行したことになる。もし100%未満なら、まだテストコードすら書いてない部分があるはず。

　カバレッジ率の算出はJavaScript単体だけでは不可能。但しChrome v73以降なら可能。

1. Chrome v73以降を起動する
2. F12キーなどでデベロッパツールを開く
3. `︙`アイコンをクリックする
4. `その他のツール`→`カバレッジ`をクリックする
5. `カバレッジ`タブが開く
6. `⟳`アイコンをクリックする
7. ファイルごとにカバレッジ率が出る
8. ファイル名をクリックするとコードが表示され、未実行箇所の行が赤色になっている。

　これにてカバレッジ率を確認すべし。

