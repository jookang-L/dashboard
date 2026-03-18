function TodoMemoPanel({
  todos, completedCount, todoInput, setTodoInput,
  onAddTodo, setDraggingTodoId, onMoveTodo,
  onToggleTodo, onDeleteTodo, memo, setMemo,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex min-h-0 flex-[1.1] flex-col rounded-2xl border border-dashboard-border bg-dashboard-card/60 backdrop-blur-sm p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-dashboard-muted">할 일 목록</p>
          <p className="text-[11px] text-dashboard-muted">{completedCount} / {todos.length}</p>
        </div>
        <div className="mb-2 flex gap-2">
          <input
            value={todoInput}
            onChange={e => setTodoInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onAddTodo() }}
            placeholder="할 일을 입력하세요"
            className="input-sm flex-1"
          />
          <button type="button" onClick={onAddTodo} className="action-btn px-3 py-1.5 text-[12px]">추가</button>
        </div>
        <ul className="min-h-0 flex-1 space-y-1.5 overflow-auto pr-1">
          {todos.map(todo => (
            <li
              key={todo.id} draggable
              onDragStart={() => setDraggingTodoId(todo.id)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onMoveTodo(todo.id)}
              onDragEnd={() => setDraggingTodoId(null)}
              className={`group flex items-center gap-2 rounded-lg border border-dashboard-border bg-dashboard-panel/60 px-3 py-1.5 ${todo.done ? 'opacity-45' : ''}`}
            >
              <input checked={todo.done} onChange={() => onToggleTodo(todo.id)} type="checkbox" className="h-3.5 w-3.5 accent-[color:var(--accent)]" />
              <span className={`flex-1 text-[13px] ${todo.done ? 'line-through' : ''}`}>{todo.text}</span>
              <button type="button" className="hidden text-dashboard-muted text-[11px] group-hover:block" title="드래그">⠿</button>
              <button type="button" className="hidden text-dashboard-muted text-[11px] group-hover:block" onClick={() => onDeleteTodo(todo.id)}>✕</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-dashboard-border bg-dashboard-card/60 backdrop-blur-sm p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dashboard-muted">메모</p>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="자유롭게 메모를 작성하세요."
          className="min-h-0 w-full flex-1 resize-none rounded-lg border border-dashboard-border bg-dashboard-panel/50 p-3 text-[13px] leading-relaxed outline-none ring-dashboard-accent focus:ring-1"
        />
      </div>
    </div>
  )
}

export default TodoMemoPanel
