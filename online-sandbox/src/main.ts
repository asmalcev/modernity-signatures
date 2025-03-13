import { parse } from '@babel/parser';
import { scan } from '../../src/scan';
import { getBrowserSupport } from '../../src/getBrowserSupport';
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
    const browserSupportOutput = document.getElementById(
        'browser-support-output'
    );

    if (!computeBtn || !editor || !output || !browserSupportOutput) {
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

    const generateBrowserSupportTable = (featureKey: string, compat: any) => {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.innerText = featureKey;

        details.appendChild(summary);

        const table = document.createElement('table');

        const trh = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.innerText = 'Browser';

        const th2 = document.createElement('th');
        th2.innerText = 'Version added';

        trh.appendChild(th1);
        trh.appendChild(th2);

        table.appendChild(trh);

        Object.entries(compat.__compat.support).forEach(
            ([browser, version]: [string, any]) => {
                const tr = document.createElement('tr');

                const td1 = document.createElement('td');
                td1.innerText = browser;

                const td2 = document.createElement('td');
                td2.innerText = String(version.version_added);

                tr.appendChild(td1);
                tr.appendChild(td2);

                table.appendChild(tr);
            }
        );

        details.appendChild(table);

        return details;
    };

    computeBtn.addEventListener('click', () => {
        const code = editor.state.doc.toString();

        const parsed = parse(code, {
            sourceType: 'module',
        });

        console.log('program', parsed);

        // @ts-ignore
        const report = scan(parsed.program.body);

        output.innerHTML = '';

        const h2features = document.createElement('h2');
        h2features.innerText = 'Features';
        output.appendChild(h2features);

        output.appendChild(renderJson(report, { loc: locReplacer }));

        const browserSupport: Record<string, any> = {};

        browserSupportOutput.innerHTML = '';

        const h2support = document.createElement('h2');
        h2support.innerText = 'Browser support';
        browserSupportOutput.appendChild(h2support);

        for (const key in report) {
            browserSupport[key] = getBrowserSupport(key);

            if (!browserSupport[key]) continue;

            const featureDetail = generateBrowserSupportTable(
                key,
                browserSupport[key]
            );

            browserSupportOutput.appendChild(featureDetail);
        }

        // console.info(browserSupport);
    });
};

init();
