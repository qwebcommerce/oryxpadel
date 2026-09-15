"use client";

import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react";
import ProductCard from "@/components/storefront/ProductCard";
import type { Product } from "@/types";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const visible = products.slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    pointerId: -1,
    active: false,
    moved: false,
    startX: 0,
    startScroll: 0,
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      el.scrollLeft += event.deltaY;
      event.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (!visible.length) return null;

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, select, textarea, label")) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      pointerId: event.pointerId,
      active: true,
      moved: false,
      startX: event.clientX,
      startScroll: el.scrollLeft,
    };
    el.setPointerCapture(event.pointerId);
    el.classList.add("is-dragging");
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const el = trackRef.current;
    if (!state.active || !el || event.pointerId !== state.pointerId) return;
    const dx = event.clientX - state.startX;
    if (Math.abs(dx) > 6) state.moved = true;
    el.scrollLeft = state.startScroll - dx;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    const state = drag.current;
    if (!state.active || event.pointerId !== state.pointerId) return;
    state.active = false;
    el?.classList.remove("is-dragging");
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  }

  return (
    <section className="featured-carousel">
      <div
        ref={trackRef}
        className="featured-carousel__track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
