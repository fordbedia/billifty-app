"use client";

import "@/styles/tiptap.scss";
import React, { useRef, useState, useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [StarterKit];

function MenuBar({ editor }) {
  if (!editor) return null;

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
        };
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
      };
    },
  });

  if (!editorState) return null;

  const buttonGroups = [
    {
      label: "Text",
      items: [
        {
          label: "B",
          title: "Bold",
          onClick: () => editor.chain().focus().toggleBold().run(),
          disabled: !editorState.canBold,
          active: editorState.isBold,
          className: "font-bold",
        },
        {
          label: "I",
          title: "Italic",
          onClick: () => editor.chain().focus().toggleItalic().run(),
          disabled: !editorState.canItalic,
          active: editorState.isItalic,
          className: "italic",
        },
        {
          label: "S",
          title: "Strike",
          onClick: () => editor.chain().focus().toggleStrike().run(),
          disabled: !editorState.canStrike,
          active: editorState.isStrike,
          className: "line-through",
        },
        {
          label: "<>",
          title: "Inline code",
          onClick: () => editor.chain().focus().toggleCode().run(),
          disabled: !editorState.canCode,
          active: editorState.isCode,
        },
      ],
    },
    {
      label: "Style",
      items: [
        {
          label: "P",
          title: "Paragraph",
          onClick: () => editor.chain().focus().setParagraph().run(),
          active: editorState.isParagraph,
        },
        {
          label: "H1",
          title: "Heading 1",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          active: editorState.isHeading1,
        },
        {
          label: "H2",
          title: "Heading 2",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          active: editorState.isHeading2,
        },
        {
          label: "H3",
          title: "Heading 3",
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          active: editorState.isHeading3,
        },
      ],
    },
    {
      label: "Blocks",
      items: [
        {
          label: "Bullets",
          title: "Bullet list",
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          active: editorState.isBulletList,
          wide: true,
        },
        {
          label: "Numbers",
          title: "Numbered list",
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          active: editorState.isOrderedList,
          wide: true,
        },
        {
          label: "Quote",
          title: "Blockquote",
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          active: editorState.isBlockquote,
          wide: true,
        },
        {
          label: "Code",
          title: "Code block",
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          active: editorState.isCodeBlock,
          wide: true,
        },
      ],
    },
    {
      label: "Insert",
      items: [
        {
          label: "Rule",
          title: "Horizontal rule",
          onClick: () => editor.chain().focus().setHorizontalRule().run(),
          wide: true,
        },
        {
          label: "Break",
          title: "Hard break",
          onClick: () => editor.chain().focus().setHardBreak().run(),
          wide: true,
        },
      ],
    },
    {
      label: "History",
      items: [
        {
          label: "Undo",
          title: "Undo",
          onClick: () => editor.chain().focus().undo().run(),
          disabled: !editorState.canUndo,
          wide: true,
        },
        {
          label: "Redo",
          title: "Redo",
          onClick: () => editor.chain().focus().redo().run(),
          disabled: !editorState.canRedo,
          wide: true,
        },
      ],
    },
  ];

  return (
    <div className="tiptap-toolbar" aria-label="Message editor toolbar">
      {buttonGroups.map((group) => (
        <div className="tiptap-toolbar-group" key={group.label}>
          <span className="tiptap-toolbar-label">{group.label}</span>
          <div className="tiptap-button-group">
            {group.items.map((item) => (
              <button
                key={item.title}
                type="button"
                title={item.title}
                aria-label={item.title}
                aria-pressed={item.active || false}
                onClick={item.onClick}
                disabled={item.disabled}
                className={[
                  item.active ? "is-active" : "",
                  item.wide ? "is-wide" : "",
                  item.className || "",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="tiptap-toolbar-group tiptap-toolbar-group-clean">
        <span className="tiptap-toolbar-label">Reset</span>
        <div className="tiptap-button-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            disabled={!editorState.canClearMarks}
            className="is-wide"
          >
            Clear marks
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().run()}
            className="is-wide"
          >
            Clear blocks
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * TipTap
 *
 * - `initialValue`: HTML string used ONLY at mount time.
 * - `onCommit(html)`: called when the editor loses focus (blur) so you can
 *   sync the final value to context / API.
 */
export default function TipTap({ initialValue, onCommit }) {
  // Keep a local copy of the content while typing
  const [localValue, setLocalValue] = useState(initialValue || "");

  // Freeze initial content for TipTap so it doesn’t re-init on re-renders
  const initialContentRef = useRef(
    initialValue ||
      `
      <p>Hi {{client.name}},</p>
      <p>Please find attached invoice {{invoice.number}}. Let me know if you have any questions.</p>
      <p>Thank you,<br/>{{businessProfile.contact_name}}</p>
    `
  );

  const lastHtmlRef = useRef(initialContentRef.current);

  const editor = useEditor(
    {
      extensions,
      content: initialContentRef.current,
      immediatelyRender: false, // avoid SSR hydration mismatch
      onUpdate({ editor }) {
        const html = editor.getHTML();
        lastHtmlRef.current = html;
        // update local only, not context
        setLocalValue(html);
      },
    },
    [] // create the editor once
  );

  // When the prop initialValue changes (e.g. you reset the form), update editor once
  useEffect(() => {
    if (editor && initialValue && initialValue !== lastHtmlRef.current) {
      editor.commands.setContent(initialValue);
      lastHtmlRef.current = initialValue;
      setLocalValue(initialValue);
    }
  }, [initialValue, editor]);

  if (!editor) return null;

  const handleBlur = () => {
    // Commit to parent/context only when user leaves the editor
    onCommit?.(lastHtmlRef.current);
  };

  return (
    <div className="tiptap-root">
      <div className="tiptap-header">
        <div>
          <p className="tiptap-eyebrow">Client message</p>
          <h3>Email body</h3>
        </div>
        <span>Sent with invoice</span>
      </div>
      <MenuBar editor={editor} />
      <div className="tiptap-editor-shell">
        <EditorContent editor={editor} onBlur={handleBlur} />
      </div>
      <div className="tiptap-footer">
        <span>Use invoice variables like {"{{client.name}}"} and {"{{invoice.number}}"}.</span>
        <span>Changes save when you leave the editor.</span>
      </div>
    </div>
  );
}
