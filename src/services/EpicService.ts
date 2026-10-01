import type  { CreateEpicPayload } from "@/types/epics.types";
import { apiRequest } from './apiClient'

export async function createEpic(
	projectId: string,
	payload: Omit<CreateEpicPayload, 'project_id'>,
	accessToken: string,
): Promise<void> {
	await apiRequest('/rest/v1/epics', {
		method: 'POST',
		accessToken,
		body: JSON.stringify({
			project_id: projectId,
			...payload,
		}),
	})
}
