# tetris-html-js
A simple Tetris clone game made with HTML, CSS, and JavaScript.
You can download it from the link below.

HTML, CSS, JavaScript로 만든 간단한 테트리스 클론 게임입니다.
다운로드는 아래 링크를 참고해주세요.

HTML、CSS、JavaScriptで作られたシンプルなテトリスクローンゲームです。
ダウンロードは下のリンクからどうぞ。

https://drive.google.com/file/d/1oahrAVf66GSKNaorUsBfgkJ-8Mz7doLu/view?usp=sharing

![image](https://github.com/user-attachments/assets/e5abcd9b-07d1-4296-82c8-a852322abb7c)
![image](https://github.com/user-attachments/assets/5cfd4a8d-aa9a-4950-94a7-8b98164ec0f8)

https://youtu.be/HfsUAycAgpA

# Tetris Clone

## Introduction (English)
This is a simple Tetris clone game built using HTML, CSS, and JavaScript. The game features classic Tetris gameplay with random tetromino generation, line clearing mechanics, and background music. Players can control falling tetrominoes and aim to clear as many lines as possible.

## 소개 (한국어)
이 프로젝트는 HTML, CSS, JavaScript를 사용하여 제작된 간단한 테트리스 클론 게임입니다. 랜덤 블록 생성, 라인 제거 메커니즘, 배경 음악 등의 기능을 포함한 클래식 테트리스 게임플레이를 제공합니다. 플레이어는 떨어지는 블록을 조작하여 최대한 많은 라인을 제거하는 것을 목표로 합니다.

## 紹介 (日本語)
このプロジェクトは、HTML、CSS、JavaScriptを使用して作成されたシンプルなテトリスのクローンゲームです。ランダムなブロック生成、ライン消去メカニズム、BGMなどの機能を備えたクラシックなテトリスのゲームプレイを提供します。プレイヤーは落下するブロックを操作して、できるだけ多くのラインを消去することを目指します。

---

## Project Structure (프로젝트 구조 / プロジェクト構造)

```
tetris-clone
├── src
│   ├── index.html        # HTML structure of the game
│   ├── styles
│   │   └── style.css     # CSS styles for the game
│   ├── scripts
│   │   ├── app.js        # Main game logic
│   │   └── utils.js      # Utility functions
├── assets
│   └── sounds
│       ├── Tetris BGM 1.mp3 ~ Tetris BGM 16.mp3  # Background music
│       └── Game_Over_BGM.mp3                     # Game over sound
└── README.md             # Project documentation
```

---

## Features (기능 / 機能)

### English
- **Classic Gameplay**: Experience the original Tetris mechanics.
- **Random Tetromino Generation**: Each game generates random tetrominoes.
- **Line Clearing**: Clear lines to earn points and level up.
- **Background Music**: 16 random BGM tracks loop during gameplay.
- **Game Over Music**: A special sound plays when the game ends.
- **BGM Volume Control**: Adjust the background music volume using a slider.

### 한국어
- **클래식 게임플레이**: 오리지널 테트리스 메커니즘 제공.
- **랜덤 블록 생성**: 게임마다 랜덤 블록 생성.
- **라인 제거**: 라인을 제거하여 점수를 얻고 레벨 업.
- **배경 음악**: 16개의 랜덤 BGM 트랙이 게임 중 재생.
- **게임 오버 음악**: 게임 종료 시 특별한 음악 재생.
- **BGM 볼륨 조절**: 슬라이더를 사용하여 배경 음악 볼륨 조절.

### 日本語
- **クラシックなゲームプレイ**: オリジナルのテトリスメカニズムを体験。
- **ランダムブロック生成**: ゲームごとにランダムなブロックを生成。
- **ライン消去**: ラインを消去してポイントを獲得し、レベルアップ。
- **背景音楽**: 16種類のランダムBGMがゲーム中に再生。
- **ゲームオーバー音楽**: ゲーム終了時に特別な音楽が再生。
- **BGM音量調整**: スライダーを使用して背景音楽の音量を調整。

---

## Controls (조작법 / 操作方法)

### English
- **Left Arrow**: Move tetromino left
- **Right Arrow**: Move tetromino right
- **Down Arrow**: Soft drop
- **Up Arrow**: Rotate tetromino
- **Space**: Hard drop

### 한국어
- **왼쪽 화살표**: 블록을 왼쪽으로 이동
- **오른쪽 화살표**: 블록을 오른쪽으로 이동
- **아래쪽 화살표**: 블록을 빠르게 내리기
- **위쪽 화살표**: 블록 회전
- **스페이스바**: 블록을 즉시 내리기

### 日本語
- **左矢印キー**: ブロックを左に移動
- **右矢印キー**: ブロックを右に移動
- **下矢印キー**: ブロックを早く落下
- **上矢印キー**: ブロックを回転
- **スペースキー**: ブロックを即座に落下

## License (라이선스 / ライセンス)

This project is licensed under the MIT License. Feel free to modify and distribute as you wish.

이 프로젝트는 MIT 라이선스에 따라 배포됩니다. 자유롭게 수정 및 배포 가능합니다.

このプロジェクトはMITライセンスの下で配布されています。自由に修正および配布が可能です.

English
I planned to implement features like the next block preview, sound effects (with overlapping), and score tracking, but whenever I added one, another broke. So I decided to wrap it up at the point where the game was at least playable.

한국어
다음 블록, 효과음 (소리 중첩), 점수 기록 등도 만들려고 했는데, 하나 넣으면 하나 안되어서 일단 게임이 되는 지점에서 완료하기로 하였습니다.

日本語
次のブロック、効果音（重ねて再生）、スコア記録なども実装しようとしましたが、ひとつ加えると別の機能が壊れてしまうため、とりあえずゲームとして成立する段階で完成とすることにしました。

English
17 BGM tracks created with Suno.ai are included.
The images were generated with NijiJourney.

한국어
Suno.ai로 만든 BGM 17곡이 첨부되어 있습니다.
이미지는 니지저니로 만들었습니다.

日本語
Suno.aiで作成したBGM17曲が含まれています。
画像はNijiJourneyで生成しました。
