import fs from 'node:fs/promises';
import os from 'node:os'
import path from 'node:path'

interface Fragment {
    label: string;
    language: string;
    code: string;
}

const languageExtensions: Record<string, string> = {
    'C': 'c', 'C++': 'cpp', 'C#': 'cs', 'CSS': 'css', 'Dart': 'dart',
    'Docker': 'dockerfile', 'Go': 'go', 'GraphQL': 'graphql', 'HTML': 'html',
    'Java': 'java', 'JavaScript': 'js', 'JSON': 'json', 'Kotlin': 'kt',
    'Lua': 'lua', 'Markdown': 'md', 'MySQL': 'sql', 'PHP': 'php',
    'Plaintext': 'txt', 'PowerShell': 'ps1', 'Python': 'py', 'R': 'r',
    'Ruby': 'rb', 'Rust': 'rs', 'SCSS': 'scss', 'Shell': 'sh',
    'SQL': 'sql', 'Swift': 'swift', 'TypeScript': 'ts', 'XML': 'xml',
    'YAML': 'yaml'
};

export async function calculateComplexity(fragments: Fragment[]): Promise<string> {
    if (!fragments || fragments.length === 0) {
        return '0';
    }
    const tmpDir = path.join(os.tmpdir(), `ember-${Date.now()}-${Math.random().toString(36).slice(2)}`);

    try {
        await fs.mkdir(tmpDir, {recursive: true});

        await Promise.all(fragments.map(async (fragment, index) => {
            const extension = languageExtensions[fragment.language] || 'txt';
            return fs.writeFile(path.join(tmpDir, `fragment-${index}.${extension}`), fragment.code);
        }));

        const proc = Bun.spawn(["scc", "--format", "json", tmpDir], {
            stdout: "pipe",
            stderr: "ignore"
        });

        const text = await new Response(proc.stdout).text();
        const analysis = JSON.parse(text);

        let totalComplexity = 0;
        if (Array.isArray(analysis)) {
            totalComplexity = analysis.reduce((sum, file) => sum + (file.complexity || 0))
        }

        return totalComplexity.toString();
    } catch (error) {
        console.error('Error calculating complexity:', error);
        return '0';
    } finally {
        await fs.rm(tmpDir, {recursive: true, force: true}).catch(() => {});
    }
}