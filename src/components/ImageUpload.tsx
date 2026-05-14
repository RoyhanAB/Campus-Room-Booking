'use client';

import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (fileName: string) => void;
  folder?: string;
}

export default function ImageUpload({ 
  currentImage, 
  onImageChange,
  folder = 'Foto'
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    currentImage ? `https://bcyodwqyplkbmsawuqrd.supabase.co/storage/v1/object/public/${folder}/${currentImage}` : null
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Upload via API route (server-side, bypasses RLS)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal upload gambar');
      }

      // Set preview
      setPreview(result.publicUrl);
      
      // Notify parent component
      onImageChange(result.fileName);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
        id="image-upload"
      />

      {preview ? (
        <div className={styles.previewContainer}>
          <div className={styles.imageWrapper}>
            <Image
              src={preview}
              alt="Preview"
              fill
              className={styles.previewImage}
              sizes="300px"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeButton}
            disabled={uploading}
          >
            <X size={18} />
            Hapus
          </button>
        </div>
      ) : (
        <label htmlFor="image-upload" className={styles.uploadArea}>
          <div className={styles.uploadIcon}>
            {uploading ? (
              <Loader2 size={28} className={styles.spinner} />
            ) : (
              <ImageIcon size={28} />
            )}
          </div>
          <div className={styles.uploadText}>
            <p className={styles.uploadTitle}>
              {uploading ? 'Mengupload...' : 'Klik untuk upload foto'}
            </p>
            <p className={styles.uploadSubtitle}>
              PNG, JPG, JPEG (Max 5MB)
            </p>
          </div>
        </label>
      )}

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
}
