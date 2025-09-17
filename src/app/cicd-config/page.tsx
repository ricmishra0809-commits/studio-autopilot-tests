import { PageHeader } from '@/components/shared/page-header';
import { CodeBlock } from '@/components/shared/code-block';
import { githubActionsYaml } from '@/lib/constants';

export default function CiCdConfigPage() {
  return (
    <div>
      <PageHeader
        title="CI/CD Configuration"
        description="A GitHub Actions workflow to run emulator tests and deploy on success. This serves as a reliable backup to the primary n8n workflow."
      />
      <CodeBlock code={githubActionsYaml} language="yaml" />
    </div>
  );
}
