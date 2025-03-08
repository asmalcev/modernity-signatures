import { parse } from '@babel/parser';
import { scan } from '../../src/scan';
import {
    clearCodeHighlights,
    highlightCode,
    highlightDecorationClass,
    initEditor,
} from './editor';

const renderJson = (
    obj: Record<string, unknown>,
    replacers?: Record<string, (li: HTMLLIElement, node: unknown) => void>
) => {
    const objRoot = document.createElement('ul');

    const renderNode = (
        root: HTMLElement,
        node: unknown,
        key: string,
        level: number
    ) => {
        if (node === null || node === undefined) return;

        const li = document.createElement('li');

        if (replacers && replacers[key]) {
            replacers[key](li, node);
        } else if (typeof node === 'string' || typeof node === 'number') {
            const p = document.createElement('p');

            p.innerHTML = `${key} = ${String(node)}`;

            li.appendChild(p);
        } else if (typeof node === 'object') {
            const nodeRoot = document.createElement('details');

            const summary = document.createElement('summary');
            summary.innerText = key;
            if (level === 1) {
                summary.classList.add('feature');
            }
            nodeRoot.appendChild(summary);

            Object.keys(node).forEach((key) => {
                const childNode = (node as Record<string, unknown>)[key];
                renderNode(nodeRoot, childNode, key, level + 1);
            });

            li.appendChild(nodeRoot);
        }

        if (level > 0) {
            li.style.marginLeft = `var(--space)`;
        }
        root.appendChild(li);
    };

    renderNode(objRoot, obj, 'root', 0);

    return objRoot;
};

const init = () => {
    const editor = initEditor();

    const computeBtn = document.getElementById('compute');
    const output = document.getElementById('output');

    if (!computeBtn || !editor || !output) {
        return;
    }

    const locReplacer = (li: HTMLLIElement, node: unknown) => {
        const btn = document.createElement('button');
        btn.innerText =
            'Hover on me to highlight code. Click to scroll to node';
        btn.classList.add('loc-btn');

        type Loc = { index: number; column: number; line: number };
        const locNode = node as { start: Loc; end: Loc };

        btn.addEventListener('click', () => {
            document
                .querySelector(`.${highlightDecorationClass}`)
                ?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
        });

        btn.addEventListener('mouseover', () => {
            highlightCode(editor, locNode.start.index, locNode.end.index);
        });

        btn.addEventListener('mouseout', () => {
            clearCodeHighlights(editor);
        });

        li.appendChild(btn);
    };

    computeBtn.addEventListener('click', () => {
        const code = editor.state.doc.toString();

        const parsed = parse(code, {
            sourceType: 'module',
        });

        console.log(parsed);

        // @ts-ignore
        const report = scan(parsed.program.body);

        output.innerHTML = '';
        output.appendChild(renderJson(report, { loc: locReplacer }));
    });
};

init();
