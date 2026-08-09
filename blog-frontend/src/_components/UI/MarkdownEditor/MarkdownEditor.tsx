"use client";

import { useEffect, useRef } from "react";
import { Crepe } from "@milkdown/crepe";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

interface IMarkdownEditorProps {
  defaultValue?: string;
  onChange: (content: string) => void;
}

const MarkdownEditor = ({
  defaultValue = "# Моя первая статья\n\nНачните писать здесь...",
  onChange,
}: IMarkdownEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const crepe = new Crepe({
      root: editorRef.current,
      defaultValue,
    });

    crepe.on((listener) => {
      listener.markdownUpdated((_, markdown) => {
        onChangeRef.current(markdown);
      });
    });

    crepe.create();

    return () => {
      crepe.destroy();
    };
  }, [defaultValue]);

  return <div ref={editorRef} />;
};

export default MarkdownEditor;
