import React, { useState, useRef } from 'react';
import { UploadCloud, X, File, Image as ImageIcon } from 'lucide-react';

export const FileUpload = ({
  label,
  accept = 'image/*',
  multiple = false,
  maxSizeMB = 5,
  onChange,
  error,
  helperText = 'PNG, JPG, PDF up to 5MB',
  className = '',
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const fileList = Array.from(files);
    const validFiles = fileList.filter((f) => f.size <= maxSizeMB * 1024 * 1024);

    const updated = multiple ? [...selectedFiles, ...validFiles] : validFiles;
    setSelectedFiles(updated);
    if (onChange) {
      onChange(multiple ? updated : updated[0] || null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index, e) => {
    e.stopPropagation();
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    if (onChange) {
      onChange(multiple ? updated : null);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 ${
          dragOver
            ? 'border-indigo-500 bg-indigo-50/50'
            : error
            ? 'border-rose-300 bg-rose-50/30'
            : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {selectedFiles.map((file, idx) => {
            const isImg = file.type?.startsWith('image/');
            const previewUrl = isImg ? URL.createObjectURL(file) : null;

            return (
              <div
                key={idx}
                className="relative group flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-8 h-8 rounded object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove(idx, e)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};

export default FileUpload;
