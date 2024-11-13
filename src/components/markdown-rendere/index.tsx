import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import style from "./index.module.scss";
import Toolbar from "./toolbar";

interface MarkdownRendererProps {
  content: string;
}
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className={style.markdown}
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          console.log("match", match);
          return match ? (
            <div className={style.codeBlock}>
              <Toolbar codeString={codeString}/>
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={oneDark}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
