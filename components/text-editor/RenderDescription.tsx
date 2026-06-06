"use client";
import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

export const RenderDescription = ({
  json,
}: {
  json?: JSONContent | string | null;
}) => {
  const output = useMemo(() => {
    if (!json) {
      return "";
    }

    let parsedJson;

    // Parse JSON if it's a string
    try {
      parsedJson = typeof json === "string" ? JSON.parse(json) : json;
    } catch (parseError) {
      return "";
    }

    // Generate HTML from the parsed object
    try {
      return generateHTML(parsedJson, [
        StarterKit,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right", "justify"],
          defaultAlignment: "left",
        }),
      ]);
    } catch (error) {
      return "";
    }
  }, [json]);

  if (!output) {
    return null;
  }

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
};

export const extractTiptapText = (jsonString: string | any): string => {
  if (!jsonString) return "";

  try {
    // Parse the JSON string
    let jsonContent;
    if (typeof jsonString === "string") {
      jsonContent = JSON.parse(jsonString);
    } else {
      jsonContent = jsonString;
    }

    // Recursive function to extract text from Tiptap JSON
    const extractTextFromNode = (node: any): string => {
      if (!node) return "";

      // If it's a text node, return the text
      if (node.type === "text") {
        return node.text || "";
      }

      // If it has content (array of child nodes), process each child
      if (node.content && Array.isArray(node.content)) {
        return node.content
          .map((child: any) => extractTextFromNode(child))
          .join(" ");
      }

      return "";
    };

    const fullText = extractTextFromNode(jsonContent);

    // Clean up extra whitespace
    return fullText.replace(/\s+/g, " ").trim();
  } catch (error) {
    return "";
  }
};
