
 export interface AddProjectPayload{
    name: string,
    description?: string
}
 export interface AddProjectErrorResponse{
    code :number,
   details: string,
    hint: string,
    message: string
}
