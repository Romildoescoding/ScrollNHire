"use client";

import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

interface EarthProps {
  className?: string;
  size?: number;
}

const Earth: React.FC<EarthProps> = ({
  className,
  size = 72, // 👈 control size here
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);
  const phiRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.offsetWidth || size;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,

      width: width * 2,
      height: width * 2,

      phi: 0,
      theta: 0.25,

      // dark: 1,
      dark: 2,
      diffuse: 0,
      // diffuse: 1.2,

      mapSamples: 10000,
      // mapSamples: 5000, // 👈 optimized for small size
      mapBrightness: 20,
      mapBaseBrightness: 0.02,

      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.2, 0.5, 1],
      glowColor: [0.3, 0.6, 1],

      opacity: 1,
      offset: [0, 0],

      // markers: [
      //   { location: [28.61, 77.23], size: 0.1 },
      //   { location: [37.77, -122.41], size: 0.05 },
      // ],

      markers: [
        { location: [28.61, 77.23], size: 0.08 }, // Delhi 🇮🇳
        { location: [19.07, 72.87], size: 0.07 }, // Mumbai 🇮🇳
        { location: [37.77, -122.41], size: 0.08 }, // SF 🇺🇸
        { location: [40.71, -74.0], size: 0.07 }, // NYC 🇺🇸
        { location: [51.5, -0.12], size: 0.07 }, // London 🇬🇧
        { location: [48.85, 2.35], size: 0.06 }, // Paris 🇫🇷
        { location: [35.68, 139.69], size: 0.07 }, // Tokyo 🇯🇵
        { location: [1.35, 103.82], size: 0.06 }, // Singapore 🇸🇬
      ],

      arcs: [
        { from: [28.61, 77.23], to: [37.77, -122.41] }, // India → US
        { from: [19.07, 72.87], to: [51.5, -0.12] }, // India → UK
        { from: [37.77, -122.41], to: [35.68, 139.69] }, // US → Japan
        { from: [40.71, -74.0], to: [48.85, 2.35] }, // US → Europe
        { from: [1.35, 103.82], to: [28.61, 77.23] }, // SEA → India
      ],
      arcColor: [0.3, 0.6, 1],
      arcWidth: 1.5,
      arcHeight: 0.5,
      markerElevation: 0.02,
    });

    globeRef.current = globe;

    let raf: number;

    const animate = () => {
      phiRef.current += 0.01; // smooth rotation
      // phiRef.current += 0.002; // smooth rotation
      globe.update({
        phi: phiRef.current,
      });

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [size]);

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{
        width: size,
        height: size,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: "1",
          scale: "1.5",
        }}
      />
    </div>
  );
};

export default Earth;
