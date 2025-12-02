"use client"

import "@/styles/tiptap.scss"
import React from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const extensions = [StarterKit]

function MenuBar({ editor }) {
  if (!editor) return null

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isBold: false,
          canBold: false,
          isItalic: false,
          canItalic: false,
          isStrike: false,
          canStrike: false,
          isCode: false,
          canCode: false,
          canClearMarks: false,
          isParagraph: true,
          isHeading1: false,
          isHeading2: false,
          isHeading3: false,
          isHeading4: false,
          isHeading5: false,
          isHeading6: false,
          isBulletList: false,
          isOrderedList: false,
          isCodeBlock: false,
          isBlockquote: false,
          canUndo: false,
          canRedo: false,
        }
      }

      return {
        isBold: editor.isActive("bold") ?? false,
        canBold: editor.can().chain().toggleBold().run() ?? false,
        isItalic: editor.isActive("italic") ?? false,
        canItalic: editor.can().chain().toggleItalic().run() ?? false,
        isStrike: editor.isActive("strike") ?? false,
        canStrike: editor.can().chain().toggleStrike().run() ?? false,
        isCode: editor.isActive("code") ?? false,
        canCode: editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: editor.isActive("paragraph") ?? false,
        isHeading1: editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: editor.isActive("bulletList") ?? false,
        isOrderedList: editor.isActive("orderedList") ?? false,
        isCodeBlock: editor.isActive("codeBlock") ?? false,
        isBlockquote: editor.isActive("blockquote") ?? false,
        canUndo: editor.can().chain().undo().run() ?? false,
        canRedo: editor.can().chain().redo().run() ?? false,
      }
    },
  })

  if (!editorState) return null

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? "is-active" : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? "is-active" : ""}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? "is-active" : ""}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? "is-active" : ""}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState.isHeading1 ? "is-active" : ""}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState.isHeading2 ? "is-active" : ""}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editorState.isHeading3 ? "is-active" : ""}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editorState.isHeading4 ? "is-active" : ""}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editorState.isHeading5 ? "is-active" : ""}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editorState.isHeading6 ? "is-active" : ""}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? "is-active" : ""}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? "is-active" : ""}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? "is-active" : ""}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          Redo
        </button>
      </div>
    </div>
  )
}

export default function TipTap({ value, onChange }) {
  const editor = useEditor({
    extensions,
    content: value ?? `
<h2>
  Hi there,
</h2>
<p>
  This is a <em>basic</em> example of <strong>Tiptap</strong>.
</p>
`,
    immediatelyRender: false, // 👈 avoids SSR hydration mismatches
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
  })

  // Don’t render until editor exists (Next.js SSR-safe)
  if (!editor) return null

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
