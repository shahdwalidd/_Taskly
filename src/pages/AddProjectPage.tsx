import { useNavigate } from 'react-router-dom'
import { AuthenticatedLayout } from '@/components/auth-layout/AuthenticatedLayout'
import { PageBreadcrumb } from '@/components/project-form/PageBreadcrumb'
import { PageHeader } from '@/components/project-form/PageHeader'
import { FormSectionHeader } from '@/components/project-form/FormSectionHeader'
import { FormField } from '@/components/shared/FormField'
import { TextAreaField } from '@/components/shared/TextAreaField'
import { AuthCard } from '@/components/shared/AuthCard'
import { ProTipBanner } from '@/components/project-form/ProTipBanner'
import { FormActions } from '@/components/project-form/FormActions'
import { useAddProject } from '@/hooks/useAddProject'

export function AddProjectPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    descriptionValue,
  } = useAddProject()

  return (
    <AuthenticatedLayout>
      <div className="w-full md:px-10">
        <div className="mt-6 mb-6">
          <PageBreadcrumb
            items={[
              { label: 'Projects' },
              { label: 'Add New Project', isActive: true },
            ]}
          />
          <PageHeader title="Add New Project" />
        </div>

        <div className="h-full w-full md:flex md:justify-center">
          <AuthCard>
            <FormSectionHeader
              title="Initialize New Project"
              description="Define the scope and foundational details of your project."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
              <FormField
                label="Project Title"
                name="title"
                register={register}
                error={errors.title?.message}
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

              <FormActions
                onBack={() => navigate(-1)}
                submitLabel="Create Project"
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
      </div>
    </AuthenticatedLayout>
  )
}
