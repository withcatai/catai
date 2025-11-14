import React from 'react';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { HistoryItem } from '../../types';
import { formatTime, copyToClipboard } from '../../lib/utils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectPrompt: (prompt: string) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectPrompt,
  onClearHistory,
}) => {
  const handleResend = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

  const handleCopy = async (prompt: string) => {
    await copyToClipboard(prompt);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prompt History">
      {history.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">No history yet.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 dark:text-white line-clamp-2">
                  {item.prompt}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatTime(item.timestamp)}
                </p>
              </div>

              <div className="flex gap-2 ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(item.prompt)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                  title="Copy prompt"
                >
                  <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => handleResend(item.prompt)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                  title="Resend prompt"
                >
                  <RotateCcw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={onClearHistory}
            variant="danger"
            size="sm"
            className="w-full gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </Button>
        </div>
      )}
    </Modal>
  );
};
