
import { AddTaskModal } from '@/components/add-task/AddTaskModal'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { TaskBoard } from '@/components/tasks-board/Taskboard'
import { TasksHeader } from '@/components/tasks-board/TasksHeader'
import { TasksListView } from '@/components/tasks-board/TasksListView'
import { useAddTask } from '@/hooks/useAddTask'
import { useTasksPage } from '@/hooks/useTasksPage'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useProjectTasks } from '@/hooks/useProjectTasks'
import { useState } from 'react'
import { TaskDetailsModal } from '@/components/task-details/TaskDetailsModal'

export function TasksPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const isMobile = !useMediaQuery('(min-width: 768px)')
  const {
    projectId,
    projectName,
    search,
    setSearch,
    debouncedSearch,
  } = useTasksPage()
  const taskPage = useProjectTasks(projectId, debouncedSearch)
  const addTask = useAddTask(projectId, taskPage.retry)

  return (
    <AuthenticatedLayout projectId={projectId} projectName={projectName}>
      <div className="flex min-w-0 flex-col gap-4 px-4 py-5 md:gap-6 md:px-8 md:py-8">
        <TasksHeader
          projectName={projectName}
          search={search}
          onSearchChange={setSearch}
        />

        {!isMobile && (
          <TaskBoard
            tasks={taskPage.tasks}
            pendingTaskIds={taskPage.pendingTaskIds}
            searchTerm={debouncedSearch}
            status={taskPage.status}
            error={taskPage.error}
            hasMore={taskPage.hasMore}
            loadingMore={taskPage.loadingMore}
            loadMoreFailed={taskPage.loadMoreFailed}
            onRetry={taskPage.retry}
            onLoadMore={() => void taskPage.loadMore()}
            onAddTask={(statusId) => addTask.openAddTask({ statusId })}
            onTaskClick={setSelectedTaskId}
            onStatusChange={(taskId, status) => {
              void taskPage.changeTaskStatus(taskId, status)
            }}
          />
        )}

        {isMobile && (
          <TasksListView
            tasks={taskPage.tasks}
            searchTerm={debouncedSearch}
            status={taskPage.status}
            error={taskPage.error}
            hasMore={taskPage.hasMore}
            loadingMore={taskPage.loadingMore}
            loadMoreFailed={taskPage.loadMoreFailed}
            onRetry={taskPage.retry}
            onLoadMore={() => void taskPage.loadMore()}
            onAddTask={() => addTask.openAddTask()}
            onTaskClick={setSelectedTaskId}
          />
        )}
      </div>

      {addTask.isOpen && <AddTaskModal {...addTask.modalProps} />}
      {selectedTaskId && (
        <TaskDetailsModal
          projectId={projectId}
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onCopyLink={() => navigator.clipboard?.writeText(window.location.href)}
        />
      )}
    </AuthenticatedLayout>
  )
}
