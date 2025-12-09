import type {Snippet} from "#shared/snippet-schema";

export function filteredSnippets (snippets: Snippet[] | undefined, query: string) {
    if (!snippets) {
        return [];
    }
    return snippets.map((snippet: Snippet) => ({
        ...snippet,
        tabItems: snippet.fragments ? snippet.fragments.map(f => ({
            label: f.label.slice(f.label.lastIndexOf('.') + 1),
            code: f.code,
            language: f.language
        })) : []
    })).filter(snippet => {
        if (!query) {
            return true;
        }
        console.log(snippet)
        return (snippet.title?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
            (snippet.description?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
            (snippet.tags ?? []).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    });
}
