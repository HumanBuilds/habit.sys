'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 14;
const TICK_MS = 120;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

function randomFood(snake: Point[]): Point {
    let food: Point;
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
        };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
    return food;
}

export function SnakeGame() {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 10 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const dirRef = useRef<Direction>('RIGHT');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem('habit-sys-snake-high');
        if (stored) setHighScore(parseInt(stored, 10));
    }, []);

    const reset = useCallback(() => {
        const initial = [{ x: 10, y: 10 }];
        setSnake(initial);
        setFood(randomFood(initial));
        setDirection('RIGHT');
        dirRef.current = 'RIGHT';
        setGameOver(false);
        setScore(0);
        setStarted(true);
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (gameOver) {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    reset();
                }
                return;
            }
            if (!started) {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setStarted(true);
                }
                return;
            }

            const cur = dirRef.current;
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    if (cur !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    if (cur !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    if (cur !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    if (cur !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); }
                    break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [gameOver, started, reset]);

    // Game loop
    useEffect(() => {
        if (!started || gameOver) return;

        const interval = setInterval(() => {
            setSnake(prev => {
                const head = { ...prev[0] };
                const dir = dirRef.current;

                if (dir === 'UP') head.y -= 1;
                else if (dir === 'DOWN') head.y += 1;
                else if (dir === 'LEFT') head.x -= 1;
                else if (dir === 'RIGHT') head.x += 1;

                // Wall collision
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setGameOver(true);
                    return prev;
                }

                // Self collision
                if (prev.some(s => s.x === head.x && s.y === head.y)) {
                    setGameOver(true);
                    return prev;
                }

                const newSnake = [head, ...prev];

                // Eat food
                setFood(currentFood => {
                    if (head.x === currentFood.x && head.y === currentFood.y) {
                        setScore(s => {
                            const newScore = s + 1;
                            setHighScore(hi => {
                                if (newScore > hi) {
                                    localStorage.setItem('habit-sys-snake-high', String(newScore));
                                    return newScore;
                                }
                                return hi;
                            });
                            return newScore;
                        });
                        const nextFood = randomFood(newSnake);
                        return nextFood;
                    }
                    newSnake.pop();
                    return currentFood;
                });

                return newSnake;
            });
        }, TICK_MS);

        return () => clearInterval(interval);
    }, [started, gameOver]);

    // Canvas rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const size = GRID_SIZE * CELL_SIZE;

        // Get theme colours from CSS vars
        const styles = getComputedStyle(document.documentElement);
        const fg = styles.getPropertyValue('--color-black').trim() || '#000000';
        const bg = styles.getPropertyValue('--color-white').trim() || '#FFFFFF';

        // Clear
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, size, size);

        // Grid dots
        ctx.fillStyle = fg;
        ctx.globalAlpha = 0.08;
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                ctx.fillRect(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 1, 1);
            }
        }
        ctx.globalAlpha = 1;

        // Food
        ctx.fillStyle = fg;
        ctx.fillRect(
            food.x * CELL_SIZE + 2,
            food.y * CELL_SIZE + 2,
            CELL_SIZE - 4,
            CELL_SIZE - 4,
        );

        // Snake
        snake.forEach((segment, i) => {
            ctx.fillStyle = fg;
            if (i === 0) {
                // Head — full cell
                ctx.fillRect(
                    segment.x * CELL_SIZE,
                    segment.y * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE,
                );
            } else {
                // Body — inset 1px
                ctx.fillRect(
                    segment.x * CELL_SIZE + 1,
                    segment.y * CELL_SIZE + 1,
                    CELL_SIZE - 2,
                    CELL_SIZE - 2,
                );
            }
        });

        // Border
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, size, size);
    }, [snake, food]);

    const size = GRID_SIZE * CELL_SIZE;

    // Touch controls
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStart.current.x;
        const dy = touch.clientY - touchStart.current.y;
        touchStart.current = null;

        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
            if (!started) setStarted(true);
            if (gameOver) reset();
            return;
        }

        const cur = dirRef.current;
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0 && cur !== 'LEFT') { dirRef.current = 'RIGHT'; setDirection('RIGHT'); }
            else if (dx < 0 && cur !== 'RIGHT') { dirRef.current = 'LEFT'; setDirection('LEFT'); }
        } else {
            if (dy > 0 && cur !== 'UP') { dirRef.current = 'DOWN'; setDirection('DOWN'); }
            else if (dy < 0 && cur !== 'DOWN') { dirRef.current = 'UP'; setDirection('UP'); }
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex gap-4 text-xs font-bold tracking-widest">
                <span>SCORE: {score}</span>
                <span>HI: {highScore}</span>
            </div>

            <div
                className="relative"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <canvas
                    ref={canvasRef}
                    width={size}
                    height={size}
                    className="border-2 border-black"
                    style={{ imageRendering: 'pixelated' }}
                />

                {!started && !gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                        <button
                            onClick={() => setStarted(true)}
                            className="text-sm font-bold tracking-widest cursor-pointer hover:underline"
                        >
                            [ START ]
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80">
                        <p className="text-lg font-bold tracking-widest">GAME OVER</p>
                        <p className="text-xs font-bold tracking-widest">SCORE: {score}</p>
                        <button
                            onClick={reset}
                            className="text-sm font-bold tracking-widest cursor-pointer hover:underline"
                        >
                            [ RETRY ]
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as const).map(dir => {
                    const labels: Record<Direction, string> = { UP: '\u25B2', DOWN: '\u25BC', LEFT: '\u25C0', RIGHT: '\u25B6' };
                    return (
                        <button
                            key={dir}
                            onPointerDown={() => {
                                if (gameOver || !started) return;
                                const cur = dirRef.current;
                                const opposites: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
                                if (cur !== opposites[dir]) {
                                    dirRef.current = dir;
                                    setDirection(dir);
                                }
                            }}
                            className={`w-10 h-10 border-2 border-black flex items-center justify-center cursor-pointer text-lg transition-colors ${
                                direction === dir ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                            }`}
                        >
                            {labels[dir]}
                        </button>
                    );
                })}
            </div>

            <p className="text-xs tracking-widest opacity-60">WASD / ARROWS / SWIPE / TAP</p>
        </div>
    );
}
