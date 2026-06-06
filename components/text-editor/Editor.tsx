"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "./Menubar";

export function RichTextEditor({
  field,
  placeholder,
}: {
  field: any;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[200px] focus:outline-none p-4 props prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value ? JSON.parse(field.value) : "",

    immediatelyRender: false,
  });

  return (
    <div className="border w-full border-input rounded-md overflow-hidden dark:bg-input/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-muted focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
      <Menubar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
