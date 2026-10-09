import { apiRequest } from "./apiClient";
import type { CreateTaskPayload,TaskFormValues ,TaskStatusValue} from "@/types/addTask.types";
export function toCreateTaskPayload(
  projectId: string,
  values: TaskFormValues,
): CreateTaskPayload {
  const description = values.description.trim()
 
  return {
    project_id: projectId,
    title: values.title.trim(),
    status: values.status as TaskStatusValue,
    ...(description ? { description } : {}),
    ...(values.epicId ? { epic_id: values.epicId } : {}),
    ...(values.assigneeId ? { assignee_id: values.assigneeId } : {}),
    ...(values.dueDate ? { due_date: `${values.dueDate}T12:00:00Z` } : {}),
  }
}
export async function createTask(
    payload: CreateTaskPayload,
  accessToken: string,
):Promise<void>{
await apiRequest('/rest/v1/tasks',{method:"POST", accessToken,
    body: JSON.stringify(payload),})
}