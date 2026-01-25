"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Camera, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoGalleryProps {
  photos: string[];
  onAddPhoto?: () => void;
  editable?: boolean;
}

export default function PhotoGallery({
  photos,
  onAddPhoto,
  editable = true,
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const minPhotos = 3;
  const maxPhotos = 10;
  const canAddMore = photos.length < maxPhotos;
  const needsMorePhotos = photos.length < minPhotos;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= 0 && newIndex < photos.length) {
      setDirection(newDirection);
      setCurrentIndex(newIndex);
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Show placeholder if no photos
  if (photos.length === 0) {
    return (
      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-gray-900">
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
            <Camera className="h-8 w-8 text-gray-600" />
          </div>
          <div className="text-center">
            <p className="mb-1 font-semibold text-white">Add Your Photos</p>
            <p className="text-sm text-gray-400">
              Min {minPhotos} photos required, max {maxPhotos}
            </p>
          </div>
          {editable && (
            <button
              onClick={onAddPhoto}
              className="flex items-center gap-2 rounded-full bg-brand-cyan px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Photos
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Gallery - Max 300px height with 4:5 aspect ratio container */}
      <div className="relative mx-auto h-[300px] w-[240px] overflow-hidden rounded-2xl bg-gray-900">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${photos[currentIndex]})` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={() => paginate(-1)}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            {currentIndex < photos.length - 1 && (
              <button
                onClick={() => paginate(1)}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </>
        )}

        {/* Photo Counter */}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Edit/Add Button */}
        {editable && (
          <button
            onClick={onAddPhoto}
            className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-brand-cyan px-3 py-1.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            <Camera className="h-4 w-4" />
            {canAddMore ? "Edit" : "Edit"}
          </button>
        )}

        {/* Needs More Photos Warning */}
        {needsMorePhotos && (
          <div className="absolute bottom-12 left-2 right-2 z-10 rounded-lg bg-yellow-500/90 px-2 py-1.5 text-center text-xs font-medium text-black backdrop-blur-sm">
            Add {minPhotos - photos.length} more photo{minPhotos - photos.length > 1 ? "s" : ""}
          </div>
        )}

        {/* Dots Indicator */}
        <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Strip - Centered */}
      {photos.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full transition-all ${
                index === currentIndex
                  ? "ring-2 ring-brand-cyan ring-offset-2 ring-offset-black"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${photo})` }}
              />
            </button>
          ))}
          {canAddMore && editable && (
            <button
              onClick={onAddPhoto}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-700 text-gray-500 transition-colors hover:border-brand-cyan hover:text-brand-cyan"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
