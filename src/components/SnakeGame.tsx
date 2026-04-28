import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const current = directionRef.current;

    if ((key === 'arrowup' || key === 'w') && current.y === 0) {
      directionRef.current = { x: 0, y: -1 };
    } else if ((key === 'arrowdown' || key === 's') && current.y === 0) {
      directionRef.current = { x: 0, y: 1 };
    } else if ((key === 'arrowleft' || key === 'a') && current.x === 0) {
      directionRef.current = { x: -1, y: 0 };
    } else if ((key === 'arrowright' || key === 'd') && current.x === 0) {
      directionRef.current = { x: 1, y: 0 };
    }
    setDirection(directionRef.current);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    setSnake(prev => {
      const head = prev[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Collision check (walls)
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prev;
      }

      // Collision check (self)
      if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const interval = setInterval(() => {
      moveSnake();
    }, Math.max(80, BASE_SPEED - Math.floor(score / 50) * 10));

    return () => clearInterval(interval);
  }, [moveSnake, gameOver, gameStarted, score]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = canvas.width / GRID_SIZE;
    const cellHeight = canvas.height / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = '#ec4899'; // pink-500
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ec4899';
    ctx.beginPath();
    ctx.arc(
      food.x * cellWidth + cellWidth / 2,
      food.y * cellHeight + cellHeight / 2,
      cellWidth / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((seg, i) => {
      ctx.fillStyle = '#22d3ee'; // cyan-400
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#22d3ee';
      
      const padding = 1;
      ctx.fillRect(
        seg.x * cellWidth + padding,
        seg.y * cellHeight + padding,
        cellWidth - padding * 2,
        cellHeight - padding * 2
      );
      ctx.shadowBlur = 0;
    });

  }, [snake, food]);

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      <div className="flex gap-16 justify-center w-full mb-6">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Current Score</p>
          <p className="text-2xl font-mono text-pink-500 font-bold tracking-widest">{score.toString().padStart(4, '0')}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">High Score</p>
          <p className="text-2xl font-mono text-cyan-400 font-bold tracking-widest">{highScore.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <section className="bg-black rounded-xl border-4 border-white/5 shadow-2xl relative flex items-center justify-center overflow-hidden w-full max-w-[500px] aspect-square">
        {/* Game Grid Simulation background */}
        <div className="absolute inset-0 opacity-10 bg-[image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
        
        <canvas 
          ref={canvasRef}
          width={400}
          height={400}
          className="relative z-10 w-full max-w-[400px] aspect-square"
        />
        
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-[#050508]/80 flex flex-col items-center justify-center backdrop-blur-md z-20">
            <motion.h2 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-3xl font-black font-sans tracking-tighter italic mb-8 ${gameOver ? 'text-pink-500' : 'text-cyan-500'}`}
            >
              {gameOver ? 'SYSTEM FAILURE' : 'INITIALIZE'}
            </motion.h2>
            
            <button 
              onClick={resetGame}
              className={`flex items-center gap-3 px-8 py-3 rounded text-black font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${gameOver ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]' : 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]'}`}
            >
              {gameOver ? (
                <>
                  <RefreshCw className="w-5 h-5" /> REBOOT
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current border-current" /> EXECUTE
                </>
              )}
            </button>
            <div className="mt-8 flex gap-4 text-[10px] font-bold text-white/30 tracking-widest">
              <span>W / A / S / D TO MOVE</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
