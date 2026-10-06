import { AssigneeSelect } from '@/components/createEpic-form/Assigneeselect'
import { DeadlineField } from '@/components/createEpic-form/DeadlineField'
import { EpicActions } from '@/components/createEpic-form/EpicActions'
import { Epicheader } from '@/components/createEpic-form/Epicheader'
import { AuthenticatedLayout } from '@/components/app-layout/AuthenticatedLayout'
import { PageBreadcrumb } from '@/components/project-form/PageBreadcrumb'
import { FormField } from '@/components/shared/FormField'
import { AuthCard } from '@/components/shared/AuthCard'
import { TextAreaField } from '@/components/shared/TextAreaField'
import { useCreateEpic } from '@/hooks/Usecreateepic'
import { getTodayISO } from '@/utils/formatDate'

export function CreateEpicPage() {
  const {
    projectId,
    projectName,
    register,
    handleSubmit,
    setValue,
    onSubmit,
    handleCancel,
    errors,
    isSubmitting,
    descriptionValue,
    assigneeValue,
    deadlineValue,
    memberOptions,
    membersStatus,
    isMembersEmpty,
    isAssigneeDisabled,
    assigneePlaceholder,
    refetchMembers,
  } = useCreateEpic()

  return (
    <AuthenticatedLayout projectId={projectId} projectName={projectName}>
      <div className="w-full px-4 md:px-10">
        <div className="mt-6 mb-6 flex flex-col gap-8">
          <div className="hidden md:block">
            <PageBreadcrumb
              items={[
                { label: 'Projects' },
                { label: projectName },
                { label: 'Epics' },
                { label: 'New Epic', isActive: true },
              ]}
            />
          </div>

          <Epicheader />
        </div>

        <div className="h-full w-full md:flex md:justify-center md:[--layout-auth-width:min(100%,48rem)]">
          <AuthCard>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <FormField
                label="Title"
                name="title"
                placeholder="e.g. Structural Foundation Phase"
                register={register}
                error={errors.title?.message}
                isRequired
              />

              <TextAreaField
                id="description"
                label="Description"
                {...register('description')}
                error={errors.description?.message}
                isOptional
                maxLength={500}
                currentLength={descriptionValue.length}
                placeholder="Describe the scope and objectives of this epic..."
              />

              <div className="grid gap-6 md:grid-cols-2 md:gap-9">
                <AssigneeSelect
                  id="assignee_id"
                  options={memberOptions}
                  value={assigneeValue}
                  disabled={isAssigneeDisabled}
                  onChange={(value) =>
                    setValue('assignee_id', value, { shouldValidate: true })
                  }
                  placeholder={assigneePlaceholder}
                  error={errors.assignee_id?.message}
                />

                <DeadlineField
                  id="deadline"
                  value={deadlineValue}
                  onChange={(value) =>
                    setValue('deadline', value, { shouldValidate: true })
                  }
                  error={errors.deadline?.message}
                  min={getTodayISO()}
                />
              </div>

              {membersStatus === 'error' && (
                <p role="alert" className="text-error text-sm">
                  Failed to load project members. You can still create the epic
                  without an assignee.{' '}
                  <button
                    type="button"
                    onClick={refetchMembers}
                    className="cursor-pointer font-semibold underline"
                  >
                    Retry
                  </button>
                </p>
              )}

              {isMembersEmpty && (
                <p className="text-slate-medium text-sm">
                  No project members available yet. You can still create the
                  epic without an assignee.
                </p>
              )}

              <EpicActions
                onCancel={handleCancel}
                submitLabel="Create Epic"
                isSubmitting={isSubmitting}
              />
            </form>
          </AuthCard>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
