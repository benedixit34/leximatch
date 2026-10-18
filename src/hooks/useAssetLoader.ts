'use client';

import { useEffect, useRef, useState } from 'react';
import { CITIES } from '@/data/cities';
import { getAudio } from '@/lib/audio';

/** Longest we wait for any single asset. A slow or missing file never blocks the game forever. */
export const TASK_TIMEOUT_MS = 12000;

interface Task {
  label: string;
  run: () => Promise<unknown>;
}

/** Pulls the URL out of a CSS value like  url('https://.../bg.png')  */
function urlFromCss(value: string): string | null {
  return value.match(/url\(\s*["']?([^"')]+)["']?\s*\)/)?.[1] ?? null;
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      console.warn('Could not load image', url);
      resolve(); // a missing background should not stop the game
    };
    img.src = url;
  });
}

/** Never rejects and never hangs: resolves when the task finishes, fails, or times out. */
function settle(task: Task): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.warn(`Gave up waiting for: ${task.label}`);
      resolve();
    }, TASK_TIMEOUT_MS);
    Promise.resolve()
      .then(task.run)
      .catch((err) => console.warn(`Failed: ${task.label}`, err))
      .finally(() => {
        clearTimeout(timer);
        resolve();
      });
  });
}

function buildTasks(): Task[] {
  const tasks: Task[] = [];

  tasks.push({
    label: 'Loading fonts',
    run: () => (document.fonts ? document.fonts.load('500 1em Fredoka') : Promise.resolve()),
  });

  // Background art. The URLs live in globals.css (--img-map, --img-vienna, ...) so there is a single source of truth.
  const root = getComputedStyle(document.documentElement);
  const names = ['map', ...new Set(CITIES.map((c) => c.theme))];
  for (const name of names) {
    const url = urlFromCss(root.getPropertyValue(`--img-${name}`));
    if (url) tasks.push({ label: 'Painting the backgrounds', run: () => loadImage(url) });
  }

  const { music, speech } = getAudio();
  tasks.push({ label: 'Loading music', run: () => music.preload() });
  tasks.push({ label: 'Warming up the German voice', run: () => speech.whenVoicesReady() });

  return tasks;
}

export interface AssetLoaderState {
  /** 0..1 */
  progress: number;
  /** What is being loaded right now */
  label: string;
  ready: boolean;
  done: number;
  total: number;
}

export function useAssetLoader(): AssetLoaderState {
  const [state, setState] = useState<AssetLoaderState>({ progress: 0, label: 'Getting ready', ready: false, done: 0, total: 0 });
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // React StrictMode runs effects twice in development
    started.current = true;

    const tasks = buildTasks();
    const finished = tasks.map(() => false);
    const total = tasks.length;
    setState({ progress: 0, label: tasks[0]?.label ?? 'Ready', ready: total === 0, done: 0, total });

    tasks.forEach((task, i) => {
      void settle(task).then(() => {
        finished[i] = true;
        const done = finished.filter(Boolean).length;
        setState({
          progress: done / total,
          label: tasks[finished.indexOf(false)]?.label ?? 'All set!',
          ready: done === total,
          done,
          total,
        });
      });
    });
  }, []);

  return state;
}