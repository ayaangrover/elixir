import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

interface CodeEditorProps {
  initialCode: string;
  readOnly?: boolean;
  onSubmit?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, readOnly = false, onSubmit }) => {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="border border-gray-300 rounded-md p-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        readOnly={readOnly}
        className="w-full h-40 font-mono text-sm p-2 border border-gray-200 rounded"
      />
      {!readOnly && onSubmit && (
        <Button onClick={() => onSubmit(code)} className="mt-2">
          Submit
        </Button>
      )}
    </div>
  );
};

export default CodeEditor;