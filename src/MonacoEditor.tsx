import { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

type Returns<T extends HTMLElement> = {
  editorRef: React.RefObject<T>;
  content: string;
};

export function useMonacoEditor<T extends HTMLElement>(): Returns<T> {
  const editorRef = useRef<T>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!editorRef.current) return;

    window.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === "typescript" || label === "javascript") {
          return new tsWorker();
        }
        return new editorWorker();
      },
    };

    const monacoEditor = editor.create(editorRef.current, {
      language: "javascript",
      padding: { top: 10, bottom: 10 },
      minimap: {
        renderCharacters: false,
      },
    });

    // responsive layout
    // ref. https://berezuzu.medium.com/resizable-monaco-editor-3e922ad54e4
    const resetEditorLayoutEvent = () => {
      monacoEditor.layout({ width: 0, height: 0 });

      window.requestAnimationFrame(() => {
        if (!editorRef.current) return;

        const rect = editorRef.current.getBoundingClientRect();

        monacoEditor.layout({ width: rect.width, height: rect.height });
      });
    };
    window.addEventListener("resize", resetEditorLayoutEvent);

    monacoEditor.onDidChangeModelContent(() => {
      setContent(monacoEditor.getValue());
    });

    return () => {
      window.removeEventListener("resize", resetEditorLayoutEvent);
      monacoEditor.dispose();
    };
  }, []);

  return {
    editorRef,
    content,
  };
}
