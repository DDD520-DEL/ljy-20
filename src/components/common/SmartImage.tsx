import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
  objectFit?: 'cover' | 'contain' | 'fill';
  showFallbackOnError?: boolean;
  fallbackTitle?: string;
  fallbackDescription?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ASPECT_RATIO_MAP = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
};

const OBJECT_FIT_MAP = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
};

export const SmartImage = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'video',
  objectFit = 'cover',
  showFallbackOnError = true,
  fallbackTitle,
  fallbackDescription = '图片加载失败',
  onLoad,
  onError,
}: SmartImageProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const hasLoadedRef = useRef(false);

  const handleLoad = () => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    setStatus('loaded');
    onLoad?.();
  };

  const handleError = () => {
    setStatus('error');
    onError?.();
  };

  const handleRetry = () => {
    setStatus('loading');
    setRetryCount((prev) => prev + 1);
    hasLoadedRef.current = false;
    if (imgRef.current) {
      imgRef.current.src = src + (src.includes('?') ? '&' : '?') + `retry=${retryCount + 1}`;
    }
  };

  useEffect(() => {
    setStatus('loading');
    hasLoadedRef.current = false;
    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        handleLoad();
      }
    }
  }, [src]);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-100',
        ASPECT_RATIO_MAP[aspectRatio],
        className
      )}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-primary-500 animate-spin" />
            <span className="text-xs text-slate-400">加载中...</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200/50 to-slate-100 animate-pulse" />
        </div>
      )}

      {status === 'error' && showFallbackOnError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-200/80 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                {fallbackTitle || alt}
              </p>
              <p className="text-xs text-slate-400 mt-1">{fallbackDescription}</p>
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              重新加载
            </button>
          </div>
        </div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full transition-opacity duration-500',
          OBJECT_FIT_MAP[objectFit],
          status === 'loaded' ? 'opacity-100' : 'opacity-0',
          imgClassName
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};
