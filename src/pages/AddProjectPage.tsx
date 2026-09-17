
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "../components/authlayout-com/AuthenticatedLayout";
import { PageBreadcrumb } from "../components/add,editproject-com/PageBreadcrumb";
import { PageHeader } from "../components/add,editproject-com/PageHeader";
import { FormSectionHeader } from "../components/add,editproject-com/FormSectionHeader";
import { FormField } from "../components/shared/FormField";
import { TextAreaField } from "../components/add,editproject-com/TextAreaField";
import { AuthCard } from "../components/shared/AuthCard";
import { ProTipBanner } from "../components/add,editproject-com/ProTipBanner";
import { FormActions } from "../components/add,editproject-com/FormActions";


const addProjectSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters.") .max(100, 'Project title must not exceed 100 characters'),

  description: z.string().max(500).optional(),
});

type AddProjectFormValues = z.infer<typeof addProjectSchema>;

export function AddProjectPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddProjectFormValues>({
    resolver: zodResolver(addProjectSchema),
  });

  const descriptionValue = useWatch({ control, name: "description" }) ?? "";

  function onSubmit(values: AddProjectFormValues) {
    console.log(values); 
  }

  return (
    <AuthenticatedLayout>
    <div className="w-full md:px-10">
      <div className="mb-6 mt-6 " >
        <PageBreadcrumb
          items={[
            { label: "Projects" },
            { label: "Add New Project", isActive: true },
          ]}
        />
        <PageHeader title="Add New Project" />
      </div>

      <div className="w-full h-full md:flex md:justify-center">
        <AuthCard>
          <FormSectionHeader
            title="Initialize New Project"
            description="Define the scope and foundational details of your project."
          />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <FormField<AddProjectFormValues>
              label="Project Title"
              name="title"
              register={register}
              error={errors.title?.message}
              isRequired
            />

            <TextAreaField
              label="Description"
              {...register("description")}
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

      <div className=" flex justify-center">
        <div className="w-full md:w-(--layout-auth-width) mb-4">
          <ProTipBanner message="You can invite project members and assign epics immediately after the initial creation process." />
        </div>
      </div>
    </div>
    </AuthenticatedLayout>
  );
}