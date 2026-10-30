import { useEffect, useState } from 'react'
import { getValidAccessToken } from '@/services/AuthService'
import { getProjects } from '@/services/ProjectService'
import {
  getTasksCalendarStats,
  getTasksCountPerProject,
} from '@/services/StatisticsService'
import type { CalendarStatsFilters, ProjectTaskCount, TasksCalendarStats } from '@/services/StatisticsService'
import type { Project } from '@/types/project.types'

type RequestState<T> =
  | { key: string; status: 'loading'; data: null; error: null }
  | { key: string; status: 'error'; data: null; error: string }
  | { key: string; status: 'success'; data: T; error: null }

const loadingState = <T,>(key: string): RequestState<T> => ({
  key,
  status: 'loading',
  data: null,
  error: null,
})

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'We could not load these statistics. Please try again.'
}

const PROJECTS_KEY = 'projects'

export function useMyStatistics(filters: CalendarStatsFilters) {
  const { startDate, endDate, projectId, status } = filters
  const statisticsKey = [startDate, endDate, projectId ?? '', status ?? ''].join('|')
  const projectCountsKey = [startDate, endDate].join('|')

  const [statistics, setStatistics] = useState<RequestState<TasksCalendarStats>>(
    () => loadingState(statisticsKey),
  )
  const [projectCounts, setProjectCounts] = useState<RequestState<ProjectTaskCount[]>>(
    () => loadingState(projectCountsKey),
  )
  const [projects, setProjects] = useState<RequestState<Project[]>>(
    () => loadingState(PROJECTS_KEY),
  )
  const [statisticsRetry, setStatisticsRetry] = useState(0)
  const [projectCountsRetry, setProjectCountsRetry] = useState(0)
  const [projectsRetry, setProjectsRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    void getValidAccessToken()
      .then((accessToken) =>
        getTasksCalendarStats(
          { startDate, endDate, projectId, status },
          accessToken,
          controller.signal,
        ),
      )
      .then((data) => {
        if (!controller.signal.aborted) {
          setStatistics({ key: statisticsKey, status: 'success', data, error: null })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setStatistics({
            key: statisticsKey,
            status: 'error',
            data: null,
            error: getErrorMessage(error),
          })
        }
      })

    return () => controller.abort()
  }, [startDate, endDate, projectId, status, statisticsKey, statisticsRetry])

  useEffect(() => {
    const controller = new AbortController()

    void getValidAccessToken()
      .then((accessToken) =>
        getTasksCountPerProject(startDate, endDate, accessToken, controller.signal),
      )
      .then((data) => {
        if (!controller.signal.aborted) {
          setProjectCounts({ key: projectCountsKey, status: 'success', data, error: null })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setProjectCounts({
            key: projectCountsKey,
            status: 'error',
            data: null,
            error: getErrorMessage(error),
          })
        }
      })

    return () => controller.abort()
  }, [startDate, endDate, projectCountsKey, projectCountsRetry])

  useEffect(() => {
    const controller = new AbortController()

    void getValidAccessToken()
      .then((accessToken) => getProjects(accessToken, undefined, undefined, controller.signal))
      .then(({ projects: projectData }) => {
        if (!controller.signal.aborted) {
          setProjects({ key: PROJECTS_KEY, status: 'success', data: projectData, error: null })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setProjects({
            key: PROJECTS_KEY,
            status: 'error',
            data: null,
            error: getErrorMessage(error),
          })
        }
      })

    return () => controller.abort()
  }, [projectsRetry])

  const retryStatistics = () => {
    setStatistics(loadingState(statisticsKey))
    setStatisticsRetry((value) => value + 1)
  }
  const retryProjectCounts = () => {
    setProjectCounts(loadingState(projectCountsKey))
    setProjectCountsRetry((value) => value + 1)
  }
  const retryProjects = () => {
    setProjects(loadingState(PROJECTS_KEY))
    setProjectsRetry((value) => value + 1)
  }

  return {
    statistics: statistics.key === statisticsKey
      ? statistics
      : loadingState<TasksCalendarStats>(statisticsKey),
    projectCounts: projectCounts.key === projectCountsKey
      ? projectCounts
      : loadingState<ProjectTaskCount[]>(projectCountsKey),
    projects,
    retryStatistics,
    retryProjectCounts,
    retryProjects,
  }
}
