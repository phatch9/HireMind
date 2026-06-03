import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ResumeDropzoneProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
}

export default function ResumeDropzone({ onFileSelect, selectedFile }: ResumeDropzoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    return (
        <div 
            {...getRootProps()} 
            className={`resume-dropzone glass ${isDragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
        >
            <input {...getInputProps()} />
            <div className="dropzone-content">
                {selectedFile ? (
                    <>
                        <div className="file-icon">📄</div>
                        <p className="file-name">{selectedFile.name}</p>
                        <p className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        <button className="btn btn-ghost btn-sm mt-sm" onClick={(e) => {
                            e.stopPropagation();
                            onFileSelect(null as any);
                        }}>
                            Change File
                        </button>
                    </>
                ) : (
                    <>
                        <div className="upload-icon">📤</div>
                        <p>{isDragActive ? "Drop your resume here" : "Drag & drop your resume, or click to browse"}</p>
                        <p className="text-secondary text-sm">PDF files only (max 10MB)</p>
                    </>
                )}
            </div>

            <style>{`
                .resume-dropzone {
                    border: 2px dashed var(--glass-border);
                    border-radius: var(--radius-xl);
                    padding: var(--spacing-2xl);
                    text-align: center;
                    cursor: pointer;
                    transition: all var(--transition-base);
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .resume-dropzone:hover, .resume-dropzone.active {
                    border-color: var(--accent-primary);
                    background: rgba(255, 255, 255, 0.05);
                }

                .resume-dropzone.has-file {
                    border-style: solid;
                    border-color: var(--accent-success);
                }

                .dropzone-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-sm);
                }

                .upload-icon, .file-icon {
                    font-size: 3rem;
                    margin-bottom: var(--spacing-sm);
                }

                .file-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .mt-sm { margin-top: var(--spacing-sm); }
            `}</style>
        </div>
    );
}
