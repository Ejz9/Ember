import fs from 'node:fs/promises';
import os from 'node:os'
import path from 'node:path'

interface Fragment {
    label: string;
    language: string;
    code: string;
}

interface ComplexityResult {
    total: number;
    stats: any[];
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

export async function calculateComplexity(fragments: Fragment[]): Promise<ComplexityResult> {
    const result: ComplexityResult = { total: 0, stats: [] };

    if (!fragments || fragments.length === 0) {
        return result;
    }
    const tmpDir = path.join(os.tmpdir(), `ember-${Date.now()}-${Math.random().toString(36).slice(2)}`);

    try {
        await fs.mkdir(tmpDir, {recursive: true});

        await Promise.all(fragments.map(async (fragment, index) => {
            const extension = languageExtensions[fragment.language] || 'txt';
            return fs.writeFile(path.join(tmpDir, `fragment-${index}.${extension}`), fragment.code);
        }));

        const proc = Bun.spawn(["scc", "--by-file", "--format", "json", tmpDir], {
            stdout: "pipe",
            stderr: "ignore"
        });

        const text = await new Response(proc.stdout).text();
        const analysis = JSON.parse(text);

        if (Array.isArray(analysis) && analysis.length > 0) {
            result.total = analysis.reduce((sum, group) => sum + (group.Complexity || 0), 0);
            const flatFiles: any[] = []
            for (const group of analysis) {
                if (group.Files) {
                    for (const file of group.Files) {
                        const match = file.Filename.match(/fragment-(\d+)\./);
                        if (match && match[1]) {
                            const index = parseInt(match[1], 10);
                            const originalFragment = fragments[index];
                            if (originalFragment) {
                                file.Label = originalFragment.label;
                            }
                        }
                        flatFiles.push(file);
                    }
                }
            }
            result.stats = flatFiles;
        }

        return result;
    } catch (error) {
        console.error('Error calculating complexity:', error);
        return result;
    } finally {
        await fs.rm(tmpDir, {recursive: true, force: true}).catch(() => {});
    }
}