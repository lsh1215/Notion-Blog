"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LightboxImageProps {
  src: string;
  alt: string;
  caption?: string;
  containerClassName?: string;
  imageClassName?: string;
}

export function LightboxImage({
  src,
  alt,
  caption,
  containerClassName = "",
  imageClassName = "",
}: LightboxImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={`group block max-w-full cursor-zoom-in rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-violet ${containerClassName}`}
        aria-label={`${alt} 크게 보기`}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        {/* Notion image URLs are served through a proxy and cannot use Next Image optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`!m-0 block max-w-full transition-opacity group-hover:opacity-90 ${imageClassName}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="확대 이미지"
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false);
            }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="확대 이미지 닫기"
              className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-6 md:top-6"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m5 5 10 10M15 5 5 15"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="flex max-h-full max-w-full cursor-default flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-h-[calc(100vh-6rem)] max-w-[calc(100vw-2rem)] object-contain md:max-w-[calc(100vw-5rem)]"
              />
              {caption && (
                <p className="max-w-3xl text-center text-sm text-white/80">
                  {caption}
                </p>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
