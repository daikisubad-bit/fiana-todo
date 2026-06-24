'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Section, Task, Status, STATUS_LABELS, STATUS_NEXT, INITIAL_DATA } from '@/lib/data'

type Filter = 'all' | Status

const STATUS_STYLE: Record<Status, string> = {
  urgent: 'bg-orange-100 text-orange-800',
  progress: 'bg-amber-100 text-amber-800',
  todo: 'bg-gray-100 text-gray-600',
  done: 'bg-green-100 text-green-800',
}

export default function Home() {
  const [sections, setSections] = useState<Section[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDue, setEditingDue] = useState<{ id: string; val: string } | null>(null)
  const [newTask, setNewTask] = useState({ title: '', owner: '', due: '', status: 'todo' as Status, note: '', cat: '' })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('todos').select('data').eq('id', 'fiana-tasks').single()
    if (error || !data?.data || (data.data as Section[]).length === 0) {
      await supabase.from('todos').upsert({ id: 'fiana-tasks', data: INITIAL_DATA })
      setSections(INITIAL_DATA)
    } else {
      setSections(data.data as Section[])
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const persist = async (next: Section[]) => {
    setSections(next)
    await supabase.from('todos').update({ data: next, updated_at: new Date().toISOString() }).eq('id', 'fiana-tasks')
  }

  const cycleStatus = async (taskId: string) => {
    const next = sections.map(sec => ({
      ...sec,
      tasks: sec.tasks.map(t => t.id === taskId ? { ...t, status: STATUS_NEXT[t.status] } : t),
    }))
    const task = next.flatMap(s => s.tasks).find(t => t.id === taskId)
    await persist(next)
    showToast(STATUS_LABELS[task!.status] + ' に変更しました')
  }

  const updateDue = async (taskId: string, val: string) => {
    const next = sections.map(sec => ({
      ...sec,
      tasks: sec.tasks.map(t => t.id === taskId ? { ...t, due: val } : t),
    }))
    await persist(next)
    setEditingDue(null)
    showToast('納期を更新しました')
  }

  const deleteTask = async (taskId: string) => {
    const next = sections.map(sec => ({ ...sec, tasks: sec.tasks.filter(t => t.id !== taskId) }))
    await persist(next)
    showToast('タスクを削除しました')
  }

  const addTask = async () => {
    if (!newTask.title || !newTask.cat) return
    const id = 't' + Date.now()
    const task: Task = { id, title: newTask.title, owner: newTask.owner, due: newTask.due, status: newTask.status, note: newTask.note }
    const next = sections.map(sec => sec.cat === newTask.cat ? { ...sec, tasks: [...sec.tasks, task] } : sec)
    await persist(next)
    setShowAddModal(false)
    setNewTask({ title: '', owner: '', due: '', status: 'todo', note: '', cat: '' })
    showToast('タスクを追加しました')
  }

  const allTasks = sections.flatMap(s => s.tasks)
  const total = allTasks.length
  const done = allTasks.filter(t => t.status === 'done').length
  const prog = allTasks.filter(t => t.status === 'progress').length
  const urg = allTasks.filter(t => t.status === 'urgent').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('URLをコピーしました')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">読み込み中...</div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg z-50">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-medium text-gray-900">フィアナAIチャンネル 開設ToDo</h1>
            <p className="text-xs text-gray-400 mt-1">バッジをタップ → ステータス変更　納期をクリック → 直接編集</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAddModal(true)} className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">
              ＋ タスク追加
            </button>
            <button onClick={copyUrl} className="text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">
              🔗 URLをコピー
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: '全タスク', val: total, color: 'text-gray-900' },
            { label: '完了', val: done, color: 'text-green-700' },
            { label: '進行中', val: prog, color: 'text-amber-700' },
            { label: '急ぎ', val: urg, color: 'text-orange-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3">
              <div className={`text-2xl font-medium ${s.color}`}>{s.val}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>進捗</span><span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {(['all', 'urgent', 'progress', 'todo', 'done'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter === f ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
              {f === 'all' ? 'すべて' : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        {sections.map(sec => {
          const visible = sec.tasks.filter(t => filter === 'all' || t.status === filter)
          if (visible.length === 0) return null
          return (
            <div key={sec.cat} className="mb-6">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2 px-1">{sec.cat}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {visible.map(task => (
                  <div key={task.id} className={`bg-white rounded-xl border border-gray-100 p-4 group ${task.status === 'done' ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={`text-sm font-medium leading-snug ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                      <button onClick={() => cycleStatus(task.id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 cursor-pointer ${STATUS_STYLE[task.status]}`}>
                        {STATUS_LABELS[task.status]}
                      </button>
                    </div>
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span>👤</span><span>{task.owner || '未設定'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>📅</span>
                        {editingDue?.id === task.id ? (
                          <input autoFocus
                            className="border-b border-gray-300 outline-none text-xs text-gray-700 w-28 bg-transparent"
                            value={editingDue.val}
                            onChange={e => setEditingDue({ id: task.id, val: e.target.value })}
                            onBlur={() => updateDue(task.id, editingDue.val)}
                            onKeyDown={e => e.key === 'Enter' && updateDue(task.id, editingDue.val)}
                          />
                        ) : (
                          <span className="cursor-pointer hover:text-gray-700 hover:underline"
                            onClick={() => setEditingDue({ id: task.id, val: task.due })}>
                            {task.due || '未設定（クリックで編集）'}
                          </span>
                        )}
                      </div>
                    </div>
                    {task.note && (
                      <div className="mt-2.5 pt-2.5 border-t border-gray-50 text-xs text-gray-400 leading-relaxed">{task.note}</div>
                    )}
                    <button onClick={() => deleteTask(task.id)}
                      className="mt-2 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-base font-medium mb-4">タスクを追加</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">タイトル *</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="例：サムネイルフォーマット作成"
                  value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">カテゴリ *</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white"
                  value={newTask.cat} onChange={e => setNewTask({ ...newTask, cat: e.target.value })}>
                  <option value="">選択してください</option>
                  {sections.map(s => <option key={s.cat} value={s.cat}>{s.cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">担当者</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="例：荒井" value={newTask.owner} onChange={e => setNewTask({ ...newTask, owner: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">納期</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="例：〜6/30" value={newTask.due} onChange={e => setNewTask({ ...newTask, due: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">ステータス</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white"
                  value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value as Status })}>
                  {(Object.keys(STATUS_LABELS) as Status[]).map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">備考</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                  placeholder="任意" value={newTask.note} onChange={e => setNewTask({ ...newTask, note: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAddModal(false)} className="flex-1 text-sm py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                キャンセル
              </button>
              <button onClick={addTask} className="flex-1 text-sm py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">
                追加する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
