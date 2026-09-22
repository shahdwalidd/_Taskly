import { AuthenticatedLayout } from '@/components/auth-layout/AuthenticatedLayout'
import { PageHeader } from '@/components/project-form/PageHeader'
import { PageBreadcrumb } from '@/components/project-form/PageBreadcrumb'
import { AuthCard } from '@/components/shared/AuthCard'
import { TextAreaField } from '@/components/shared/TextAreaField'
import { FormActions } from '@/components/project-form/FormActions'
import { ProTipBanner } from '@/components/project-form/ProTipBanner'
import { FormSectionHeader } from '@/components/project-form/FormSectionHeader'
import { FormField } from '@/components/shared/FormField'
import { useEditProject } from '@/hooks/useEditProject'

export function EditProjectPage() {
  const {
    status,
    projectName,
    register,
    handleSubmit,
    onCancel,
    errors,
    isSubmitting,
    descriptionValue,
    saveError,
  } = useEditProject()

  return (
    <AuthenticatedLayout projectName={projectName}>
      <div className="w-full md:px-10">
        <div className="mt-6 mb-6">
          <PageBreadcrumb
            items={[
              { label: 'Projects' },
              { label: projectName || 'Project' },
              { label: 'EDIT', isActive: true },
            ]}
          />
          <PageHeader title="Edit Project" />
        </div>

        {status === 'loading' && (
          <div className="flex justify-center py-20 text-gray-400">
            Loading project data...
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-20 text-center">
            <h2 className="text-ink text-xl font-extrabold">
              Something went wrong
            </h2>
            <p className="mt-2 text-gray-500">
              We couldn&apos;t load this project&apos;s data. Please try again.
            </p>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className="h-full w-full md:flex md:justify-center">
              <AuthCard>
                <FormSectionHeader
                  title="Edit Project"
                  description="Define the scope and foundational details of your project."
                />

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <FormField
                    label="Project Title"
                    name="name"
                    register={register}
                    error={errors.name?.message}
                    isRequired
                  />
                  <TextAreaField
                    label="Description"
                    {...register('description')}
                    error={errors.description?.message}
                    isOptional
                    maxLength={500}
                    currentLength={descriptionValue.length}
                    placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                  />
                  {saveError && (
                    <p role="alert" className="text-sm text-red-600">
                      {saveError}
                    </p>
                  )}
                  <FormActions
                    onBack={onCancel}
                    submitLabel="Save Changes"
                    isSubmitting={isSubmitting}
                  />
                </form>
              </AuthCard>
            </div>

            <div className="flex justify-center">
              <div className="mb-4 w-full md:w-(--layout-auth-width)">
                <ProTipBanner message="You can invite project members and assign epics immediately after the initial creation process." />
              </div>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  )
}
