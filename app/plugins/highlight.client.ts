import 'highlight.js/styles/atom-one-dark.css';
import hljs from "highlight.js";
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('plaintext', plaintext)

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            hljs: hljs
        }
    }
});