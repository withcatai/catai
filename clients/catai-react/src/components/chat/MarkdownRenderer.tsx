import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { copyToClipboard } from '../../lib/utils';

interface MarkdownRendererProps {
  content: string;
  onCopy?: (code: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onCopy,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, index: number) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedIndex(index);
      onCopy?.(code);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed my-2" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-3 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 my-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 my-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="ml-2 text-slate-700 dark:text-slate-300" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary-500 pl-4 py-2 my-2 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'text';

            if (inline) {
              return (
                <code
                  className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm text-slate-900 dark:text-white font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const codeString = String(children).replace(/\n$/, '');
            const index = Math.random();

            return (
              <div className="relative my-4 group">
                <pre className="bg-slate-900 dark:bg-slate-950 rounded-lg overflow-x-auto p-4">
                  <code
                    className={`language-${language} text-sm font-mono text-slate-100`}
                    {...props}
                  >
                    {children}
                  </code>
                </pre>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(codeString, index as any)}
                  className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Copy code"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-300" />
                  )}
                </motion.button>
              </div>
            );
          },
          a: ({ node, href, ...props }: any) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 underline"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
