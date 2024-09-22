import "./App.css";
import { useMonacoEditor } from "./MonacoEditor";

function App() {
  const { editorRef, content } = useMonacoEditor<HTMLDivElement>();

  return (
    <div className="editor-wrapper">
      <div ref={editorRef} className="editor" />
    </div>
  );
}

export default App;
