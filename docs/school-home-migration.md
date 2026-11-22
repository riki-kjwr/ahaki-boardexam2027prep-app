# 学校選択型への安全な移行

## ファイル構造
- `index.html`: 以前と同じ共有URLで表示する学校選択画面。
- `oniki.html`: 旧 `index.html` と完全に同一。原本 Git blob SHA: `f4149d0df0a4cbbfe427bd55138cc562ea05f482`。
- `judo.html`: まだ作らない。日本医専アプリ完成時に追加。
- `tests/verify-school-home.mjs`: 原本同一性と旧リンクを自動確認。

## 学校を追加する場合
新しい学校用のHTMLファイルを追加し、`index.html` の学校選択 `<nav>` 内にリンクを1件追加する。日本医専は現在の「準備中」カードを `<a class="school" href="./judo.html">` に変更するだけで公開できる。鬼木の4種類（卒試・期末・授業・国試）の内部コードは変更しない。

## ⭐・履歴を消さないための条件
旧アプリには4つの `iframe.srcdoc` と固定のブラウザ `localStorage` 保存キーがある。
- `oniki-fourway-grad-trial-20261120-v1`
- `oniki-fourway-term-trial-20261120-v1`
- `oniki-fourway-class-trial-20261120-v1`
- `oniki-fourway-national-trial-20261120-v1`

新しい `index.html` は localStorage に触れない。閲覧元の GitHub Pages オリジン（ドメイン/ポート/方式）が変わらないため `oniki.html` に変更しても同じ保存領域を使う。別端末、別ブラウザ、サイトデータ消去、プライベートブラウズは例外。

## Spreadsheet／HTML更新システムとの連携
現存する旧 `index.html` には問題データが直接埋め込まれており、実行時の `fetch` や XHR 通信は確認できない。Spreadsheetの同期結果からHTMLを再生成する場合、**今後の出力先を `oniki.html` に切り替える**。従来どおり `index.html` を上書きすると学校選択が消える。このリポジトリには外部同期設定ファイルはなかったため、外部で設定された出力先は別途確認すること。

## 確認事項（公開前後）
1. `node tests/verify-school-home.mjs` を実行して成功する。
2. ドラフトPRの差分を確認し、旧アプリのBlob SHAが一致する。
3. 学校ホーム→鬼木学園→4種類の学習画面の操作をiPhone・iPad・PCで確認する。
4. 学習途中に⭐をつけてから閉じる／再度開く／学習履歴を参照し、保存を検証する。
5. `/#app=grad`, `/#app=term`, `/#app=class`, `/#app=national` の旧リンクを検証する。
6. 使用端末では公開切替の前にアプリのバックアップ出力機能で学習データを保存しておく。
7. **mainへマージしない間は公開アプリに影響しない。** GitHub Pagesでは通常作業ブランチのプレビューは自動生成されない。別URLのプレビューでは、端末の既存localStorageの引き継ぎはテストできないため同一オリジン上の最終確認も必要。

公開への切替はPRの承認・手動マージで行う。自動マージは禁止。
