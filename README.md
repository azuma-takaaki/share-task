
# 積み上げ城

### **https://tumiagejou.herokuapp.com/**  
<br />

## サービス概要
**ゲーム感覚だから学習習慣を継続できる**  
<br />
日々のプログラミング学習の成果をゲーム感覚で記録する, 学習記録サービスです. 積み上げ(学習の成果)を記録すると自分のお城も日々積み上がって大きくなっていきます.
<br />
<br />

### 作成した経緯
  プログラミングの勉強を始めた頃, モチベーションを保つのに苦労しました. そこでモチベーション維持のために2つの工夫をしました.
  1つ目は, twitterで学習記録のツイートを始めたことです. 毎日「#今日の積み上げ」ハッシュタグと共に学習記録をツイートしていきました. 「#今日の積み上げ」はプログラミング初学者が日々の学習記録をツイートし, 学習仲間を探すためのハッシュタグです. このハッシュタグを通じて自分と同じ境遇の人と繋がることで孤独感が減り仲間と頑張っている感覚が得られました.
  2つ目は, GitHubに毎日草を生やすことです. とにかく1日も休まず草を生やす. 壁にぶつかって思うように進まない時もありましたが, とにかく草を生やしました. 挫折しそうな時でもGitHubのコミット履歴を見れば「辛い時でも毎日プログラミング学習と向き合ってきた」という自負が生まれ頑張れました.
   以上2つから, 「学習仲間と繋がること」と「日々の積み上げが可視化されていること」がプログラミング学習で必要なのではないかと考えました.
   そこで, 上記2つを叶えるサービスを作りたいと考え生まれたのがこの「積み上げ城」です. 同じ挑戦をしている仲間を見つけることができ, さらに積み上げた日数によって「お城の大きさや豪華さ」と言う形で可視化されます.

# 使用技術

### フロントエンド
- React (react-rails というgemを使用し完全SPA化)
- Three.js (react-three-fiberというライブラリを使用し3DモデルのCRUDを実現)

### バックエンド
- Ruby　2.7.0
- Rails　6.1.4.1

### インフラ
- Heroku にデプロイ


## 使用画面と機能
<br />

|マイページ① 全体の紹介|
| :---: |
|![マイページ](https://user-images.githubusercontent.com/65389934/135866390-9d13ae15-49bd-4eb2-8602-ab35b7baf352.jpeg)
|今までの学習履歴の確認と, 自分の立てた城の編集ができます|
<br />
<br />

|マイページ②「積み上げ」タブ|
| :---: |
|![マイページ_2_積み上げタブ](https://user-images.githubusercontent.com/65389934/135866529-803afebd-1ce7-4f2b-93a7-84cf20bbdc16.jpeg)
|「積み上げ」タブを選択すると今日の積み上げ（学習記録)の一覧が表示され、画面下部のボタンから1日に1度だけ今日の積み上げを登録することができます。今日の積み上げを登録すると積み上げポイントがもらえ、それを消費して3Dモデルを追加し、城を大きくすることができます！|
<br />
<br />

|マイページ③「増築」タブ|
| :---: |
|![マイページ_3_増築タブ](https://user-images.githubusercontent.com/65389934/135866606-3950f81e-b4bc-4f29-9b8a-96181b9965a1.jpeg)
|「増築」タブを選択すると3Dモデル一覧が表示され、クリックするとその3Dモデルのプレビューが表示されます。3Dモデルのプレビューを表示した状態で画面下部の3Dモデル追加ボタンを押すと3Dモデルが追加されます。この時、今日の積み上げを登録する際に得られる積み上げポイントを消費します。|
<br />
<br />
