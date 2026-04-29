import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isColliding = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isColliding) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4 font-display">
        <div className="flex items-center gap-2">
          <Trophy className="text-neon-yellow w-5 h-5" />
          <span className="text-2xl font-bold tracking-wider neon-text-cyan">{score}</span>
        </div>
        <button 
          onClick={resetGame}
          className="p-2 rounded-full bg-cyber-gray hover:bg-neon-cyan/20 transition-colors neon-border-cyan group"
        >
          <RefreshCw className="w-5 h-5 text-neon-cyan group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      <div className="relative p-2 rounded-xl bg-cyber-gray neon-border-cyan overflow-hidden">
        {/* Game Grid */}
        <div 
          className="grid gap-[1px] bg-cyber-black/50"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(85vw, 400px)',
            aspectRatio: '1/1'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`relative rounded-[2px] transition-all duration-200 ${
                  isSnake 
                    ? isHead ? 'bg-neon-cyan neon-border-cyan z-10' : 'bg-neon-cyan/60'
                    : isFood ? 'bg-neon-pink animate-pulse neon-border-pink' : 'bg-transparent'
                }`}
              >
                {isFood && (
                   <div className="absolute inset-0 bg-neon-pink/30 blur-sm rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cyber-black/80 flex flex-col items-center justify-center backdrop-blur-sm"
            >
              <h2 className={`text-4xl font-display font-bold mb-6 ${isGameOver ? 'neon-text-pink text-neon-pink' : 'neon-text-cyan text-neon-cyan'}`}>
                {isGameOver ? 'GAME OVER' : 'PAUSED'}
              </h2>
              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan rounded-full font-display font-bold hover:bg-neon-cyan hover:text-cyber-black transition-all duration-300 neon-border-cyan uppercase tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                {isGameOver ? 'Try Again' : 'Resume'}
              </button>
              {!isGameOver && (
                <p className="mt-4 text-xs text-neon-cyan/50 font-display">Press SPACE to toggle</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-xs font-display text-gray-500 uppercase tracking-widest">
        <span>Arrows to move</span>
        <span>•</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
};
