export interface CreateEpicPayload{
    title: string,
    description: string,
    assignee_id?: string,
   project_id?: string,
    deadline?: string
  }
  export interface EpicListItem {
  id: string
  code: string 
  title: string
  assigneeName: string
  createdBy: string
  date: string 
}