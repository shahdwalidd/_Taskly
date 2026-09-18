
import { useNavigate } from "react-router-dom";
import { AuthenticatedLayout } from "../components/authlayout-com/AuthenticatedLayout";
import { ProjectPgeHeader } from "../components/projectlist-com/ProjectsPageHeader";
import { ProjectCard } from "../components/projectlist-com/ProjectCard";
import { AddProjectCard } from "../components/projectlist-com/AddProjectCard";
import { FloatingAddButton } from "../components/projectlist-com/FloatingAddButton";
import { Pagination } from "../components/shared/Pagination";

const MOCK_PROJECTS = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  name: "Skyline Residence Phase II",
  description:
    "Structural review and aesthetic curation for the high-rise residential complex in the downtown district tes...",
  createdAt: "12 Oct 2025",
}));

export function ProjectsPage() {
  const navigate = useNavigate();

  return (
    <AuthenticatedLayout projectName="Active Project Na...">
      <div className="px-6 py-8 md:px-10">
        <ProjectPgeHeader
          title="Projects"
          subtitle="Manage and curate your projects"
          onCreateClick={() => navigate("/project/add")}
        />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {MOCK_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              createdAt={project.createdAt}
              onClick={() => {}}
            />
          ))}

          <AddProjectCard onClick={() => {}} />
        </div>

        <div className="mt-12 flex justify-end">
          <Pagination totalPages={15} />
        </div>
      </div>

      <FloatingAddButton onClick={() => navigate("/project/add")} />
    </AuthenticatedLayout>
  );
}