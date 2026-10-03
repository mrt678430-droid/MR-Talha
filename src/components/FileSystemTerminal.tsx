import React, { useState } from 'react';
import { VirtualFile, AgentName } from '../types';
import { 
  FolderGit2, 
  FileText, 
  FileCode, 
  Save, 
  Download, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck,
  FolderOpen,
  Code,
  Sparkles
} from 'lucide-react';
import { playSuccessChime, playTacticalBeep } from '../utils/audio';

interface FileSystemTerminalProps {
  files: VirtualFile[];
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onSaveFile: (name: string, content: string, author?: AgentName | 'Hermes') => void;
  onDeleteFile: (name: string) => void;
  isSaving: boolean;
}

export const FileSystemTerminal: React.FC<FileSystemTerminalProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onSaveFile,
  onDeleteFile,
  isSaving,
}) => {
  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const [editorContent, setEditorContent] = useState<string>(activeFile?.content || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // Sync editor content when active file changes
  React.useEffect(() => {
    if (activeFile) {
      setEditorContent(activeFile.content);
    }
  }, [activeFile?.id, activeFile?.content]);

  const handleSave = () => {
    if (!activeFile) return;
    playSuccessChime();
    onSaveFile(activeFile.name, editorContent, activeFile.authorAgent);
    setIsEditing(false);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const finalName = newFileName.endsWith('.md') || newFileName.endsWith('.json') || newFileName.endsWith('.py')
      ? newFileName.trim()
      : `${newFileName.trim()}.md`;

    const initialContent = `# STONIC DATA REPORT: ${finalName}
**Generated**: ${new Date().toISOString()}
**Author**: Oliver & File System Sub-Agent

## Executive Summary
Enter detailed research or market data here.
`;
    onSaveFile(finalName, initialContent, 'Oliver');
    setNewFileName('');
    setShowNewModal(false);
  };

  const handleDownload = (file: VirtualFile) => {
    playTacticalBeep(900);
    const blob = new Blob([file.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="file-system-panel" className="tactical-card corner-bracket p-4 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-950/90 border border-purple-700/50 text-purple-400">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-2">
              FILE SYSTEM OPERATIONS (write_file)
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60">
                SUB-AGENT 4 (Oliver)
              </span>
            </h3>
            <p className="text-[11px] font-mono-code text-slate-400">
              Storage Directory: <code className="text-cyan-300">C:\Users\Admin\Stonic Data\</code>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playTacticalBeep(700);
            setShowNewModal(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-600/50 text-purple-300 text-xs font-mono-code transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>NEW FILE</span>
        </button>
      </div>

      {/* Main File Manager Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
        
        {/* Left: Files List */}
        <div className="bg-[#070b13] border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 mb-2 pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                STONIC DATA DIR ({files.length} FILES)
              </span>
              <span className="text-[10px] text-emerald-400">LINT: PASSED</span>
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-56">
              {files.map((file) => (
                <div
                  key={file.id}
                  id={`file-item-${file.name}`}
                  onClick={() => {
                    playTacticalBeep(650);
                    onSelectFile(file.id);
                  }}
                  className={`p-2 rounded text-xs font-mono-code border cursor-pointer transition ${
                    activeFile?.id === file.id
                      ? 'bg-purple-950/60 border-purple-500/80 text-slate-100 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {file.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{file.bytesWritten} B</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Author: <strong className="text-purple-300">{file.authorAgent}</strong></span>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> lint:{file.lint.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directory Status Footer */}
          <div className="pt-2 mt-2 border-t border-slate-800 text-[10px] font-mono-code text-slate-500 flex items-center justify-between">
            <span>DIRS_CREATED: TRUE</span>
            <span>WRITE_PIPELINE: ACTIVE</span>
          </div>
        </div>

        {/* Right: File Viewer & Live Markdown Editor */}
        <div className="md:col-span-2 bg-[#070b13] border border-slate-800/80 rounded-lg p-3 flex flex-col justify-between">
          {activeFile ? (
            <>
              {/* File Action Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-mono-code font-bold text-slate-200 truncate">
                    {activeFile.path}
                  </span>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {activeFile.extension.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownload(activeFile)}
                    className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 transition"
                    title="Export File to Disk"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono-code font-bold transition shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'SAVING...' : 'WRITE_FILE'}</span>
                  </button>
                </div>
              </div>

              {/* Code / Markdown Content Textarea */}
              <textarea
                value={editorContent}
                onChange={(e) => {
                  setEditorContent(e.target.value);
                  setIsEditing(true);
                }}
                className="w-full h-56 bg-[#04070d] border border-slate-800 rounded p-2.5 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-purple-500/80 resize-none"
                placeholder="File content..."
              />

              {/* File Meta Info */}
              <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
                <span>Bytes: <strong className="text-slate-200">{activeFile.bytesWritten}</strong></span>
                <span>Last Written: <strong className="text-slate-200">{new Date(activeFile.lastModified).toLocaleTimeString()}</strong></span>
                <span>Lint: <strong className="text-emerald-400">PASSED (0 errors)</strong></span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-xs font-mono-code text-slate-500">
              Select or create a file in Stonic Data directory.
            </div>
          )}
        </div>

      </div>

      {/* New File Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-purple-500/60 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <h4 className="font-heading font-bold text-base text-slate-100 mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" />
              CREATE FILE IN STONIC DATA
            </h4>
            <p className="text-xs font-mono-code text-slate-400 mb-3">
              Target: <code className="text-purple-300">C:\Users\Admin\Stonic Data\</code>
            </p>

            <form onSubmit={handleCreateNew}>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="e.g. Bullion_Trend_Report.md"
                autoFocus
                className="w-full bg-[#080d17] border border-slate-700 rounded px-3 py-2 text-xs font-mono-code text-slate-200 focus:outline-none focus:border-purple-400 mb-4"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs font-mono-code rounded bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!newFileName.trim()}
                  className="px-4 py-1.5 text-xs font-mono-code font-bold rounded bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
                >
                  CREATE FILE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
