import { useState, useRef, useEffect } from 'react';

export const useImageZoom = () => {
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);
    const imageRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!imageRef.current || !isZoomed) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    const handleZoomToggle = () => {
        setIsZoomed(!isZoomed);
        setShowZoom(!isZoomed);
    };

    return {
        isZoomed,
        zoomPosition,
        showZoom,
        imageRef,
        handleMouseMove,
        handleZoomToggle,
        setShowZoom
    };
};