'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import styles from './page.module.css';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface QuestTask {
  quest_id: string;
  task_id: string;
  step_index: number;
  title: string;
  description: string;
  cultural_explanation: string;
  completion_requirement: string;
  unlock_condition: Record<string, unknown>;
  next_task_hint: string;
  difficulty: string;
  reason_codes: string[];
  status: 'locked' | 'active' | 'completed';
}

interface QuestChain {
  quest_id: string;
  place_name: string;
  total_tasks: number;
  current_step: number;
  tasks: QuestTask[];
}

/* ─── Difficulty badge colors ───────────────────────────────────────────────── */

const difficultyConfig: Record<string, { label_vi: string; label_en: string; color: string }> = {
  easy: { label_vi: 'Dễ', label_en: 'Easy', color: '#22c55e' },
  medium: { label_vi: 'Trung bình', label_en: 'Medium', color: '#f59e0b' },
  hard: { label_vi: 'Khó', label_en: 'Hard', color: '#ef4444' },
};

/* ─── API ───────────────────────────────────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchQuestChain(userId: string): Promise<QuestChain | null> {
  try {
    const res = await fetch(`${API_BASE}/storyline/quest?user_id=${userId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function generateNextTask(userId: string): Promise<QuestTask | null> {
  try {
    const res = await fetch(`${API_BASE}/storyline/next-task?user_id=${userId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.task;
  } catch {
    return null;
  }
}

/* ─── Page Component ────────────────────────────────────────────────────────── */

export default function StorylinePage() {
  const { locale } = useI18n();
  const [chain, setChain] = useState<QuestChain | null>(null);
  const [selectedTask, setSelectedTask] = useState<QuestTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  /* ── Load quest chain on mount ─────────────────────────────────────────── */
  useEffect(() => {
    fetchQuestChain('demo-user').then((data) => {
      setChain(data);
      setLoading(false);
    });
  }, []);

  /* ── Handle task node click ────────────────────────────────────────────── */
  const handleNodeClick = useCallback((task: QuestTask) => {
    if (task.status === 'locked') return;
    setSelectedTask((prev) => (prev?.task_id === task.task_id ? null : task));
  }, []);

  /* ── Handle "Start Task" click ─────────────────────────────────────────── */
  const handleStartTask = useCallback(async () => {
    if (!chain) return;
    setGenerating(true);
    const task = await generateNextTask('demo-user');
    setGenerating(false);
    if (task) {
      setSelectedTask({
        ...task,
        quest_id: task.quest_id || chain.quest_id,
        step_index: task.step_index || chain.current_step,
        unlock_condition: task.unlock_condition || {},
        next_task_hint: task.next_task_hint || '',
        reason_codes: task.reason_codes || [],
        status: 'active',
      } as QuestTask);
    }
  }, [chain]);

  /* ── Handle "Complete Task" ────────────────────────────────────────────── */
  const handleCompleteTask = useCallback(() => {
    if (!chain || !selectedTask) return;
    setChain((prev) => {
      if (!prev) return prev;
      const updatedTasks = prev.tasks.map((t, i) => {
        if (t.task_id === selectedTask.task_id) {
          return { ...t, status: 'completed' as const };
        }
        // Unlock the next task
        if (i > 0 && prev.tasks[i - 1]?.task_id === selectedTask.task_id) {
          return { ...t, status: 'active' as const };
        }
        return t;
      });
      return {
        ...prev,
        tasks: updatedTasks,
        current_step: Math.min(prev.current_step + 1, prev.total_tasks),
      };
    });
    setSelectedTask(null);
  }, [chain, selectedTask]);

  /* ── Render ────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>{locale === 'vi' ? 'Đang tải hành trình...' : 'Loading quest...'}</p>
      </div>
    );
  }

  if (!chain) {
    return (
      <div className={styles.errorContainer}>
        <p>{locale === 'vi' ? 'Không thể tải quest. Hãy thử lại.' : 'Could not load quest. Please try again.'}</p>
        <Link href="/" className={styles.backLink}>← {locale === 'vi' ? 'Về trang chủ' : 'Back home'}</Link>
      </div>
    );
  }

  const completedCount = chain.tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className={styles.pageWrapper}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className={styles.questHeader}>
        <Link href="/" className={styles.backButton}>←</Link>
        <div className={styles.questHeaderInfo}>
          <span className={styles.questHeaderLabel}>
            {locale === 'vi' ? 'Hành trình' : 'Quest'}
          </span>
          <h1 className={styles.questTitle}>{chain.place_name}</h1>
        </div>
        <div className={styles.progressBadge}>
          {completedCount}/{chain.total_tasks}
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <div className={styles.mainContent}>
        {/* ── Quest Path (Left / Center) ────────────────────────────────── */}
        <div className={styles.pathContainer}>
          <div className={styles.pathTrack}>
            {chain.tasks.map((task, index) => {
              const isCompleted = task.status === 'completed';
              const isActive = task.status === 'active';
              const isLocked = task.status === 'locked';
              const isSelected = selectedTask?.task_id === task.task_id;
              // Zig-zag offset pattern like Duolingo
              const offsetX = index % 2 === 0 ? -40 : 40;

              return (
                <div key={task.task_id} className={styles.pathStep}>
                  {/* Connector line to next node */}
                  {index < chain.tasks.length - 1 && (
                    <div
                      className={`${styles.connector} ${isCompleted ? styles.connectorCompleted : ''}`}
                    />
                  )}

                  {/* Task Node */}
                  <button
                    className={`
                      ${styles.taskNode}
                      ${isCompleted ? styles.taskNodeCompleted : ''}
                      ${isActive ? styles.taskNodeActive : ''}
                      ${isLocked ? styles.taskNodeLocked : ''}
                      ${isSelected ? styles.taskNodeSelected : ''}
                    `}
                    style={{ '--offset-x': `${offsetX}px` } as CSSProperties}
                    onClick={() => handleNodeClick(task)}
                    disabled={isLocked}
                    aria-label={task.title}
                  >
                    {isCompleted ? (
                      <span className={styles.nodeIcon}>✓</span>
                    ) : isActive ? (
                      <span className={styles.nodeIcon}>▶</span>
                    ) : (
                      <span className={styles.nodeIcon}>🔒</span>
                    )}
                    <span className={styles.nodeStep}>{task.step_index}</span>
                  </button>

                  {/* Task label (shown next to node) */}
                  <span
                    className={`${styles.taskLabel} ${isLocked ? styles.taskLabelLocked : ''}`}
                    style={{ '--offset-x': `${offsetX}px` } as CSSProperties}
                  >
                    {task.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Task Detail Card (Right Panel / Expanded) ─────────────────── */}
        {selectedTask && (
          <div className={styles.taskCard}>
            <div className={styles.taskCardHeader}>
              <div className={styles.taskCardStep}>
                {locale === 'vi' ? 'Bước' : 'Step'} {selectedTask.step_index}
              </div>
              <span
                className={styles.difficultyBadge}
                style={{
                  backgroundColor: difficultyConfig[selectedTask.difficulty]?.color || '#6b7280',
                }}
              >
                {locale === 'vi'
                  ? difficultyConfig[selectedTask.difficulty]?.label_vi
                  : difficultyConfig[selectedTask.difficulty]?.label_en}
              </span>
            </div>

            <h2 className={styles.taskCardTitle}>{selectedTask.title}</h2>
            <p className={styles.taskCardDescription}>{selectedTask.description}</p>

            {/* Cultural explanation */}
            <div className={styles.culturalBox}>
              <div className={styles.culturalBoxIcon}>📚</div>
              <div>
                <h3 className={styles.culturalBoxTitle}>
                  {locale === 'vi' ? 'Giải thích văn hóa' : 'Cultural Context'}
                </h3>
                <p className={styles.culturalBoxText}>
                  {selectedTask.cultural_explanation}
                </p>
              </div>
            </div>

            {/* Completion requirement */}
            <div className={styles.requirementBox}>
              <span className={styles.requirementIcon}>📷</span>
              <span>{selectedTask.completion_requirement}</span>
            </div>

            {/* Next task hint */}
            {selectedTask.next_task_hint && (
              <div className={styles.hintBox}>
                <span className={styles.hintIcon}>💡</span>
                <span className={styles.hintText}>{selectedTask.next_task_hint}</span>
              </div>
            )}

            {/* Reason codes */}
            {selectedTask.reason_codes.length > 0 && (
              <div className={styles.tagRow}>
                {selectedTask.reason_codes.map((code) => (
                  <span key={code} className={styles.tag}>#{code}</span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className={styles.taskCardActions}>
              {selectedTask.status === 'active' && (
                <>
                  <button
                    className={styles.btnStart}
                    onClick={handleStartTask}
                    disabled={generating}
                  >
                    {generating
                      ? (locale === 'vi' ? '🤖 Đang tạo task mới...' : '🤖 Generating...')
                      : (locale === 'vi' ? '🚀 Bắt đầu' : '🚀 Start')
                    }
                  </button>
                  <button
                    className={styles.btnComplete}
                    onClick={handleCompleteTask}
                  >
                    {locale === 'vi' ? '✅ Hoàn thành' : '✅ Complete'}
                  </button>
                </>
              )}
              {selectedTask.status === 'completed' && (
                <div className={styles.completedMessage}>
                  {locale === 'vi' ? '🎉 Đã hoàn thành!' : '🎉 Completed!'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
