
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { AddTaskButton } from '@/components/tasks-board/AddTaskButton'
import { EmptyTaskPanel } from '@/components/tasks-board/EmptyTaskPanel'
import { TaskBoard } from '@/components/tasks-board/Taskboard'
import { TasksHeader } from '@/components/tasks-board/TasksHeader'
import { useTasksPage } from '@/hooks/useTasksPage'

export function TasksPage() {
  const { projectId, projectName, search, setSearch } = useTasksPage()

  return (
    <AuthenticatedLayout projectId={projectId} projectName={projectName}>
      <div className="flex flex-col gap-4 px-4 py-5 md:gap-6 md:px-8 md:py-8">
        <TasksHeader
          projectName={projectName}
          search={search}
          onSearchChange={setSearch}
        />

      
        <div className="flex flex-col gap-3 md:hidden">
          <AddTaskButton />
          <EmptyTaskPanel className="mt-3 h-160" />
        </div>

       
        <div className="hidden md:block">
          <TaskBoard />
        </div>
      </div>
    </AuthenticatedLayout>
  )
}