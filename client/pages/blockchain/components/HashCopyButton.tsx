import { useCopyToClipboard } from "react-use";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface HashCopyButtonProps {
  hash?: string;
}

export function HashCopyButton({ hash }: HashCopyButtonProps) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (hash) {
      copyToClipboard(hash);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-sm font-mono text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1 group"
      title={hash}
    >
      {isCopied ? (
        <>
          <Check className="w-3 h-3" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="hidden group-hover:inline">
            {hash?.slice(0, 8)}...{hash?.slice(-4)}
          </span>
          <span className="group-hover:hidden">
            {hash?.slice(0, 8)}...{hash?.slice(-4)}
          </span>
        </>
      )}
    </button>
  );
}
