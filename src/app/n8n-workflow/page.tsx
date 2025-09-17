import { PageHeader } from '@/components/shared/page-header';
import { CodeBlock } from '@/components/shared/code-block';
import { n8nWorkflowJson } from '@/lib/constants';

export default function N8nWorkflowPage() {
  return (
    <div>
      <PageHeader
        title="n8n Workflow"
        description="A no-code workflow to automate your entire testing and deployment pipeline. Copy this JSON and import it into your n8n instance."
      />
      <CodeBlock code={n8nWorkflowJson} language="json" />
    </div>
  );
}
