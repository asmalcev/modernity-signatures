import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { Decoration, DecorationSet } from '@codemirror/view';
import { StateField, StateEffect, EditorState } from '@codemirror/state';

const placeholderText = `const hello = "world";

try {
    await fetch('https://example.com');
} finally {
    console.log('finally');
}
`;

const addHighlight = StateEffect.define<{ from: number; to: number }>({
    map: ({ from, to }, change) => ({
        from: change.mapPos(from),
        to: change.mapPos(to),
    }),
});

const clearHighlights = StateEffect.define();

export const highlightDecorationClass = 'marked-code';
const highlightDecoration = Decoration.mark({
    class: highlightDecorationClass,
});

const highlightField = StateField.define<DecorationSet>({
    create() {
        return Decoration.set([]);
    },
    update(decorations, tr) {
        let nextDecorations = decorations.map(tr.changes);

        tr.effects.forEach((e) => {
            if (e.is(addHighlight)) {
                nextDecorations = nextDecorations.update({
                    add: [highlightDecoration.range(e.value.from, e.value.to)],
                });
            } else if (e.is(clearHighlights)) {
                nextDecorations = Decoration.set([]);
            }
        });

        return nextDecorations;
    },
    provide: (f) => EditorView.decorations.from(f),
});

export const initEditor = () => {
    const editorRoot = document.getElementById('editor');

    if (!editorRoot) {
        return;
    }

    const view = new EditorView({
        parent: editorRoot,
        state: EditorState.create({
            doc: placeholderText,
            extensions: [basicSetup, javascript(), highlightField],
        }),
    });

    return view;
};

export const highlightCode = (editor: EditorView, from: number, to: number) =>
    editor.dispatch({
        effects: [addHighlight.of({ from, to })],
    });

export const clearCodeHighlights = (editor: EditorView) =>
    editor.dispatch({
        effects: [clearHighlights.of(null)],
    });
