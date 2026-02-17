"use client";

import { useState } from "react";
import Image from "next/image";
import ImageViewer from "./ImageViewer";

export default function AnimalGallery({ fotos }: { fotos: any[] }) {
  const validFotos = fotos.filter((f) => f.url);

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  if (validFotos.length === 0) return null;

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {validFotos.map((p, i) => (
          <figure
            key={p.id}
            onClick={() => setViewerIndex(i)}
            className="cursor-pointer rounded-xl overflow-hidden bg-neutral-100 ring-1 ring-neutral-200/60"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={p.url}
                alt={p.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </div>
          </figure>
        ))}
      </div>

      {viewerIndex !== null && (
        <ImageViewer
          images={validFotos}
          index={viewerIndex}
          setIndex={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
}
