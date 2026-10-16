import { CodeBlock } from '@axolotesource/ui/components/CodeBlock/CodeBlock'
import { Page } from '@axolotesource/ui/components/Page/Page'
import { useTranslation } from 'react-i18next'

const UIPage = () => {
  const { t } = useTranslation()

  return (
    <Page titleTranslation="ui_components" breadCrumblesItems={[]}>
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold">CodeBlock</h3>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm text-gray-500">{t('monokai_theme_js')}</p>
              <CodeBlock
                language="javascript"
                theme="monokai-sublime"
                code={`const greeting = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greeting('World'));`}
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">{t('github_theme_php')}</p>
              <CodeBlock
                language="php"
                theme="github"
                showLineNumbers
                code={`<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['status' => 'ok']);
    }
}`}
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">{t('atom_theme_bash')}</p>
              <CodeBlock
                language="bash"
                theme="atom-one-dark"
                showLanguage={false}
                showCopyButton={false}
                code={`npm install
npm run dev`}
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-500">{t('inline_code')}</p>
              <p className="text-sm">
                {t('use_command')} <CodeBlock code="php artisan migrate" inline /> {t('run_migrations')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default UIPage
