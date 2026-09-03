import { requireAdmin } from "@/lib/admin/auth";
import { getProjects } from "@/lib/admin/queries";
import { formatDate } from "@/lib/utils";
import { PaymentPill, ProjectStatusPill } from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getProjects();

  const currency = (value: number | null, code: string) =>
    value === null
      ? "—"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: code,
          maximumFractionDigits: 0,
        }).format(value);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="type-h2 text-[1.9rem]">Projects</h1>
        <p className="mt-2 text-[0.92rem] text-slate">
          {projects.length} {projects.length === 1 ? "project" : "projects"}, soonest deadline first.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-20 text-center">
          <p className="text-[0.95rem] text-ink">No projects yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-[0.86rem] leading-relaxed text-muted">
            Create a project row against a won lead to start tracking delivery, deadlines and
            payment.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="hidden grid-cols-[1.5fr_1.1fr_0.9fr_0.9fr_0.8fr] items-center gap-4 border-b border-line px-6 py-3 lg:grid">
            {["Project", "Client", "Status", "Deadline", "Payment"].map((heading) => (
              <span key={heading} className="type-mono text-[0.55rem] text-muted">
                {heading}
              </span>
            ))}
          </div>

          <ul className="divide-y divide-line">
            {projects.map((project) => {
              const overdue =
                project.deadline !== null &&
                new Date(project.deadline) < new Date() &&
                !["launched", "cancelled"].includes(project.status);

              return (
                <li
                  key={project.id}
                  className="grid grid-cols-1 gap-3 px-6 py-4 lg:grid-cols-[1.5fr_1.1fr_0.9fr_0.9fr_0.8fr] lg:items-center lg:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.92rem] text-ink">{project.name}</p>
                    <p className="truncate text-[0.78rem] text-muted">
                      {currency(project.budget, project.currency)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[0.85rem] text-slate">
                      {project.leads?.business_name ?? "—"}
                    </p>
                    <p className="truncate text-[0.76rem] text-muted">
                      {project.leads?.name ?? ""}
                    </p>
                  </div>

                  <div className="justify-self-start">
                    <ProjectStatusPill status={project.status} />
                  </div>

                  <span
                    className={`text-[0.85rem] ${overdue ? "text-signal" : "text-slate"}`}
                    title={overdue ? "Past deadline" : undefined}
                  >
                    {project.deadline ? formatDate(project.deadline) : "—"}
                  </span>

                  <div className="justify-self-start">
                    <PaymentPill status={project.payment} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
