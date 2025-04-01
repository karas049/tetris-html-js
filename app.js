class TetrisGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        this.context = this.canvas.getContext('2d');
        if (!this.context) {
            console.error('Canvas context not found');
            return;
        }

        // 블록 크기 계산: 캔버스 크기 / 보드 크기
        const blockWidth = this.canvas.width / 10; // 360 / 10 = 36
        const blockHeight = this.canvas.height / 20; // 720 / 20 = 36
        this.context.scale(blockWidth, blockHeight); // 블록 크기를 36x36으로 고정

        this.board = this.createBoard(10, 20); // 10x20 보드
        this.resetGame();
        document.addEventListener('keydown', this.handleKeyPress.bind(this)); // 키 입력 이벤트 추가
        this.isPaused = false; // 게임 일시 정지 상태 추가
        this.invisibleCeiling = 0; // 천장 위치를 0번째 행으로 설정
        this.currentTetromino = null; // 현재 블록 초기화
        this.isGameStarted = false; // 게임 시작 여부 플래그
        this.level = 1; // 초기 레벨
        this.speed = 1; // 초기 스피드
        this.score = 0; // 초기 점수
        this.linesCleared = 0; // 제거된 라인 수
        this.updateGameInfo(); // 초기 Game Info 업데이트
        this.bgmAudio = new Audio(); // BGM 오디오 객체
        this.bgmList = Array.from({ length: 16 }, (_, i) => `assets/sounds/Tetris BGM ${i + 1}.mp3`); // BGM 파일 목록
        this.currentBgmIndex = -1; // 현재 재생 중인 BGM 인덱스
        this.isGameOver = false; // 게임 오버 상태
        this.updateBgmName(""); // 초기 BGM 이름 표시

        // BGM 볼륨 조절 이벤트 추가
        const bgmVolumeSlider = document.getElementById("bgm-volume");
        if (bgmVolumeSlider) {
            bgmVolumeSlider.addEventListener("input", (event) => {
                this.setBgmVolume(event.target.value);
            });
        }
    }

    createBoard(width, height) {
        return Array.from({ length: height }, () => Array(width).fill(0));
    }

    resetGame() {
        this.board = this.createBoard(10, 20);
        this.currentTetromino = null; // 현재 블록 초기화
        this.score = 0;
        this.level = 1;
        this.speed = 1;
        this.linesCleared = 0;
        this.isGameOver = false;
        this.isGameStarted = false; // 게임 시작 플래그 초기화
        clearInterval(this.interval);
        this.updateGameInfo(); // Game Info 초기화
        this.stopBgm(); // BGM 중지
    }

    getRandomTetromino() {
        const tetrominos = [
            {
                rotations: [
                    [[1, 1, 1, 1]], // I
                    [[1], [1], [1], [1]]
                ],
                color: 'cyan'
            },
            {
                rotations: [
                    [[1, 1], [1, 1]] // O (회전해도 동일)
                ],
                color: 'yellow'
            },
            {
                rotations: [
                    [[0, 1, 1], [1, 1, 0]], // S
                    [[1, 0], [1, 1], [0, 1]]
                ],
                color: 'green'
            },
            {
                rotations: [
                    [[1, 1, 0], [0, 1, 1]], // Z
                    [[0, 1], [1, 1], [1, 0]]
                ],
                color: 'red'
            },
            {
                rotations: [
                    [[1, 1, 1], [0, 1, 0]], // T
                    [[0, 1], [1, 1], [0, 1]],
                    [[0, 1, 0], [1, 1, 1]],
                    [[1, 0], [1, 1], [1, 0]]
                ],
                color: 'purple'
            },
            {
                rotations: [
                    [[1, 1, 1], [1, 0, 0]], // L
                    [[1, 0], [1, 0], [1, 1]],
                    [[0, 0, 1], [1, 1, 1]],
                    [[1, 1], [0, 1], [0, 1]]
                ],
                color: 'orange'
            },
            {
                rotations: [
                    [[1, 1, 1], [0, 0, 1]], // J
                    [[0, 1], [0, 1], [1, 1]],
                    [[1, 0, 0], [1, 1, 1]],
                    [[1, 1], [1, 0], [1, 0]]
                ],
                color: 'blue'
            }
        ];
        const randomIndex = Math.floor(Math.random() * tetrominos.length);
        const randomTetromino = tetrominos[randomIndex];
        return {
            rotations: randomTetromino.rotations,
            color: randomTetromino.color,
            rotationIndex: 0, // 초기 회전 상태
            pos: { x: Math.floor(this.board[0].length / 2) - 1, y: 0 }
        };
    }

    startGame() {
        if (this.isGameOver) {
            this.resetGame();
            this.hideGameOverPopup(); // 게임 오버 팝업 숨기기
        }

        if (!this.isGameStarted) {
            this.isGameStarted = true; // 게임 시작 플래그 설정
            this.currentTetromino = this.getRandomTetromino(); // 새로운 블록 생성
            this.playRandomBgm(); // 랜덤 BGM 재생
        }

        // 기존 interval이 있으면 정리
        if (this.interval) {
            clearInterval(this.interval);
        }

        this.isPaused = false; // 게임 시작 시 일시 정지 해제

        // 새로운 interval 시작
        this.interval = setInterval(() => {
            this.update();
            this.draw();
        }, 500 / this.speed);
    }

    pauseGame() {
        if (this.interval) {
            clearInterval(this.interval); // 게임 루프 중단
            this.interval = null; // interval 초기화
            this.isPaused = true; // 일시 정지 상태 설정
            this.showPausePopup(); // Pause 팝업 표시
        }
    }

    update() {
        if (this.isGameOver) {
            clearInterval(this.interval); // 게임 루프 중단
            this.showGameOverPopup(); // Game Over 팝업 표시
            return;
        }

        if (this.isPaused) return; // 일시 정지 상태에서는 업데이트 중단

        if (!this.currentTetromino) {
            console.error('No current tetromino to update.');
            return;
        }

        this.currentTetromino.pos.y++;
        if (this.checkCollision()) {
            this.currentTetromino.pos.y--;
            this.mergeTetromino();

            // 천장 충돌 시 새로운 블록 생성 방지
            if (this.isGameOver) return;

            this.clearLines();
        }
    }

    checkCollision() {
        const { rotations, rotationIndex, pos } = this.currentTetromino;
        const matrix = rotations[rotationIndex];
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (
                    matrix[y][x] !== 0 &&
                    (
                        pos.y + y >= this.board.length || // 아래쪽 경계 충돌
                        pos.x + x < 0 || // 왼쪽 경계 충돌
                        pos.x + x >= this.board[0].length || // 오른쪽 경계 충돌
                        this.board[pos.y + y]?.[pos.x + x] !== 0 // 다른 블록과 충돌
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    mergeTetromino() {
        const { rotations, rotationIndex, pos, color } = this.currentTetromino;
        const matrix = rotations[rotationIndex];
        let reachedCeiling = false; // 천장 충돌 여부 확인 변수

        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    // 천장 충돌 감지
                    if (pos.y + y <= this.invisibleCeiling) {
                        reachedCeiling = true;
                    } else {
                        this.board[pos.y + y][pos.x + x] = { value, color }; // 값과 색상 저장
                    }
                }
            });
        });

        // 천장 충돌 시 게임 종료
        if (reachedCeiling) {
            this.isGameOver = true;
            console.log('Game Over: Block reached the invisible ceiling'); // 디버깅용 로그 추가
            clearInterval(this.interval);
            this.showGameOverPopup();
        } else {
            this.currentTetromino = this.getRandomTetromino(); // 새로운 블록 생성
        }
    }

    clearLines() {
        const initialLength = this.board.length;
        this.board = this.board.filter(row => row.some(cell => cell === 0));
        const linesRemoved = initialLength - this.board.length;

        while (this.board.length < 20) {
            this.board.unshift(Array(this.board[0].length).fill(0));
        }

        if (linesRemoved > 0) {
            const points = linesRemoved * 10 * this.level; // 점수 계산
            this.score += points;
            this.linesCleared += linesRemoved;

            // 모든 블록 제거 시 추가 점수
            if (this.linesCleared === 20) {
                this.score += 100;
            }

            // 레벨 업 조건
            if (this.score >= this.level * 500) {
                this.level++;
                this.speed += 0.5;
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.update();
                    this.draw();
                }, 500 / this.speed); // 스피드 반영
            }

            this.updateGameInfo(); // Game Info 업데이트
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMatrix(this.board, { x: 0, y: 0 });
        this.drawMatrix(this.currentTetromino.rotations[this.currentTetromino.rotationIndex], this.currentTetromino.pos, this.currentTetromino.color);
    }

    drawMatrix(matrix, offset, color = null) {
        matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0 || (cell && cell.value !== 0)) { // 값이 0이 아닌 경우만 그리기
                    const drawColor = cell.color || color || 'gray'; // 색상 우선순위
                    this.context.fillStyle = drawColor;
                    this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
                    this.context.strokeStyle = 'black';
                    this.context.lineWidth = 0.05;
                    this.context.strokeRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    handleKeyPress(event) {
        if (this.isGameOver) return;

        // 방향키 및 추가 키 입력 시 기본 동작(스크롤) 방지
        const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
        if (validKeys.includes(event.key)) {
            event.preventDefault();
        }

        this.processKey(event.key); // 키 처리 로직 호출
        this.draw(); // 키 입력 후 화면 갱신
    }

    processKey(key) {
        switch (key) {
            case 'ArrowUp': // Rotate
                this.rotateTetromino();
                if (this.checkCollision()) {
                    this.rotateTetromino(true); // 충돌 시 원래 상태로 되돌림
                }
                break;
            case 'ArrowDown': // Soft Drop
                this.softDrop();
                break;
            case 'ArrowLeft': // Move Left
                this.moveLeft();
                break;
            case 'ArrowRight': // Move Right
                this.moveRight();
                break;
            case ' ': // Hard Drop (Space key)
                this.hardDrop();
                break;
            default:
                console.log(`Unhandled key: ${key}`); // 디버깅용 로그 추가
        }
    }

    softDrop() {
        this.currentTetromino.pos.y++;
        if (this.checkCollision()) {
            this.currentTetromino.pos.y--;
            this.mergeTetromino();
            this.clearLines();
            this.currentTetromino = this.getRandomTetromino();
            if (this.checkCollision()) {
                this.isGameOver = true;
                console.log('Game Over');
                clearInterval(this.interval);
            }
        }
    }

    moveLeft() {
        this.currentTetromino.pos.x--;
        if (this.checkCollision()) {
            this.currentTetromino.pos.x++;
        }
    }

    moveRight() {
        this.currentTetromino.pos.x++;
        if (this.checkCollision()) {
            this.currentTetromino.pos.x--;
        }
    }

    hardDrop() {
        while (!this.checkCollision()) {
            this.currentTetromino.pos.y++;
        }
        this.currentTetromino.pos.y--; // 충돌 직전 위치로 되돌림
        this.mergeTetromino();
        this.clearLines();
        this.currentTetromino = this.getRandomTetromino();
        if (this.checkCollision()) {
            this.isGameOver = true;
            console.log('Game Over');
            clearInterval(this.interval);
        }
    }

    rotateTetromino(reverse = false) {
        const tetromino = this.currentTetromino;
        const totalRotations = tetromino.rotations.length;

        // 회전 인덱스를 순환적으로 변경
        if (reverse) {
            tetromino.rotationIndex = (tetromino.rotationIndex - 1 + totalRotations) % totalRotations;
        } else {
            tetromino.rotationIndex = (tetromino.rotationIndex + 1) % totalRotations;
        }

        // 충돌 감지
        if (this.checkCollision()) {
            // 충돌 시 원래 상태로 되돌림
            tetromino.rotationIndex = reverse
                ? (tetromino.rotationIndex + 1) % totalRotations
                : (tetromino.rotationIndex - 1 + totalRotations) % totalRotations;
        }
    }

    showGameOverPopup() {
        const popup = document.getElementById('game-over-popup');
        const finalScoreElement = document.getElementById('final-score'); // 마지막 점수를 표시할 요소
        if (popup && finalScoreElement) {
            finalScoreElement.textContent = this.score; // 마지막 점수를 설정
            popup.classList.remove('hidden'); // 'hidden' 클래스 제거하여 팝업 표시
            this.playGameOverBgm(); // 게임 오버 BGM 재생
            console.log('Game Over popup displayed'); // 디버깅용 로그 추가
        } else {
            console.error('Game Over popup or final score element not found');
        }
    }

    hideGameOverPopup() {
        const popup = document.getElementById('game-over-popup');
        if (popup) {
            popup.classList.add('hidden'); // 'hidden' 클래스 추가하여 팝업 숨기기
        } else {
            console.error('Game Over popup element not found');
        }
    }

    showPausePopup() {
        const popup = document.getElementById('pause-popup');
        popup.classList.remove('hidden'); // Pause 팝업 표시
    }

    hidePausePopup() {
        const popup = document.getElementById('pause-popup');
        popup.classList.add('hidden'); // Pause 팝업 숨기기

        // 게임 재개
        if (!this.isGameOver) {
            this.isPaused = false; // 일시 정지 해제
            this.startGame(); // 게임 루프 재개
        }
    }

    updateGameInfo() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('speed').textContent = this.speed.toFixed(1); // 소수점 1자리 표시
    }

    playRandomBgm() {
        this.currentBgmIndex = Math.floor(Math.random() * this.bgmList.length); // 랜덤 인덱스 선택
        this.playBgm();
    }

    playBgm() {
        if (this.bgmAudio) {
            this.bgmAudio.pause(); // 기존 재생 중인 BGM 중지
        }
        this.bgmAudio.src = this.bgmList[this.currentBgmIndex]; // 현재 BGM 설정
        this.bgmAudio.loop = false; // 순차 재생을 위해 루프 비활성화
        this.bgmAudio.play();
        this.updateBgmName(this.bgmList[this.currentBgmIndex]); // 현재 BGM 이름 업데이트

        // BGM 종료 시 다음 곡 재생
        this.bgmAudio.onended = () => {
            this.currentBgmIndex = (this.currentBgmIndex + 1) % this.bgmList.length; // 다음 곡으로 이동
            this.playBgm();
        };
    }

    stopBgm() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0; // 재생 위치 초기화
        }
    }

    playGameOverBgm() {
        this.stopBgm(); // 기존 BGM 중지
        this.bgmAudio.src = "assets/sounds/Game_Over_BGM.mp3"; // 게임 오버 BGM 설정
        this.bgmAudio.loop = false; // 루프 비활성화
        this.bgmAudio.play();
        this.updateBgmName("Game Over BGM"); // 현재 BGM 이름 업데이트
    }

    updateBgmName(name) {
        const bgmNameElement = document.getElementById("bgm-name");
        if (bgmNameElement) {
            bgmNameElement.textContent = name ? `Now Playing: ${name}` : "No BGM Playing";
        }
    }

    setBgmVolume(volume) {
        const normalizedVolume = volume / 100; // 0~100 값을 0~1로 변환
        this.bgmAudio.volume = normalizedVolume; // BGM 볼륨 설정
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new TetrisGame('tetrisCanvas');

    // Start 버튼 클릭 시 게임 시작
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        game.startGame();
    });

    // Pause 버튼 클릭 시 게임 일시 정지
    const pauseButton = document.getElementById('pause-button');
    pauseButton.addEventListener('click', () => {
        game.pauseGame();
    });

    // Close 버튼 클릭 시 Game Over 팝업 닫기
    const closeGameOverButton = document.getElementById('close-game-over-button');
    closeGameOverButton.addEventListener('click', () => {
        game.hideGameOverPopup();
    });

    // Close 버튼 클릭 시 Pause 팝업 닫기
    const closePauseButton = document.getElementById('close-pause-button');
    closePauseButton.addEventListener('click', () => {
        game.hidePausePopup();
    });

    // game.startGame(); // 초기 자동 시작 제거
});