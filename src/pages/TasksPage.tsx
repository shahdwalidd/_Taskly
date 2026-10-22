
import { AddTaskModal } from '@/components/add-task/AddTaskModal'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { TaskBoard } from '@/components/tasks-board/Taskboard'
import { TasksHeader } from '@/components/tasks-board/TasksHeader'
import { useAddTask } from '@/hooks/useAddTask'
import { useTasksPage } from '@/hooks/useTasksPage'
import { useState } from 'react'
import { TaskDetailsModal } from '@/components/task-details/TaskDetailsModal'

export function TasksPage() {
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
  const {
    projectId,
    projectName,
    search,
    setSearch,
  } = useTasksPage()
  const addTask = useAddTask(projectId)

  return (
    <AuthenticatedLayout projectId={projectId} projectName={projectName}>
      <div className="flex min-w-0 flex-col gap-4 px-4 py-5 md:gap-6 md:px-8 md:py-8">
        <TasksHeader
          projectName={projectName}
          search={search}
          onSearchChange={setSearch}
        />

        <TaskBoard
          projectId={projectId}
          onAddTask={(statusId) => addTask.openAddTask({ statusId })}
          onTaskClick={() => setIsTaskDetailsOpen(true)}
        />
      </div>

      {addTask.isOpen && <AddTaskModal {...addTask.modalProps} />}
      {isTaskDetailsOpen && (
        <TaskDetailsModal
          onClose={() => setIsTaskDetailsOpen(false)}
          onCopyLink={() => navigator.clipboard?.writeText(window.location.href)}
        />
      )}
    </AuthenticatedLayout>
  )
}
