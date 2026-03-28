/**
 * Gesso Canvas Renderer - Sprint 2
 * Renders a Gesso AST to an HTML5 Canvas.
 */

import React, { useEffect, useRef, useState } from "react";
import { GessoDocument, Primitive, Layer, ControlLane } from "./ast";
import { resolveValue } from "./resolver";

interface GessoCanvasProps {
  ast: GessoDocument;
  onPrimitiveMove?: (layerId: string, primitiveIndex: number, newX: number, newY: number) => void;
}

export const GessoCanvas: React.FC<GessoCanvasProps> = ({ ast, onPrimitiveMove }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selected, setSelected] = useState<{ layerId: string; index: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Resolve Format and Background
    const format = (resolveValue(ast.meta.format, ast.definitions) as string) || "800x600";
    const [width, height] = format.split("x").map((s) => parseInt(s.replace("px", "")));
    
    canvas.width = width || 800;
    canvas.height = height || 600;

    const background = (resolveValue(ast.meta.background, ast.definitions) as string) || "#ffffff";

    // 2. Clear Canvas
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Render Layers
    for (const layer of ast.layers) {
      for (let i = 0; i < layer.primitives.length; i++) {
        const primitive = layer.primitives[i];
        drawPrimitive(ctx, primitive, layer, ast);
        
        // Draw selection highlight
        if (selected && selected.layerId === layer.id && selected.index === i) {
          drawSelectionHighlight(ctx, primitive, ast);
        }
      }
    }
  }, [ast, selected]);

  const drawSelectionHighlight = (ctx: CanvasRenderingContext2D, p: Primitive, doc: GessoDocument) => {
    const attrs = resolveAttributes(p.attributes, doc);
    const pos = attrs.pos || [0, 0];
    
    ctx.save();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    if (p.type === "rect") {
      const size = attrs.size || [100, 100];
      ctx.rect(pos[0] - 2, pos[1] - 2, size[0] + 4, size[1] + 4);
    } else if (p.type === "circle") {
      const radius = attrs.radius || 50;
      ctx.arc(pos[0], pos[1], radius + 2, 0, Math.PI * 2);
    } else if (p.type === "path") {
      // Simple bounding box for path
      const points = attrs.points;
      if (Array.isArray(points)) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        points.forEach(seg => {
          if (seg.length === 8) {
            minX = Math.min(minX, seg[0], seg[6]);
            minY = Math.min(minY, seg[1], seg[7]);
            maxX = Math.max(maxX, seg[0], seg[6]);
            maxY = Math.max(maxY, seg[1], seg[7]);
          } else if (seg.length === 2) {
            minX = Math.min(minX, seg[0]);
            minY = Math.min(minY, seg[1]);
            maxX = Math.max(maxX, seg[0]);
            maxY = Math.max(maxY, seg[1]);
          }
        });
        ctx.rect(minX - 2, minY - 2, (maxX - minX) + 4, (maxY - minY) + 4);
      }
    }
    ctx.stroke();
    ctx.restore();
  };

  const getPrimitiveAt = (x: number, y: number) => {
    // Iterate backwards to pick the top-most element
    for (let l = ast.layers.length - 1; l >= 0; l--) {
      const layer = ast.layers[l];
      for (let i = layer.primitives.length - 1; i >= 0; i--) {
        const p = layer.primitives[i];
        const attrs = resolveAttributes(p.attributes, ast);
        const pos = attrs.pos || [0, 0];

        if (p.type === "rect") {
          const size = attrs.size || [100, 100];
          if (x >= pos[0] && x <= pos[0] + size[0] && y >= pos[1] && y <= pos[1] + size[1]) {
            return { layerId: layer.id, index: i, pos };
          }
        } else if (p.type === "circle") {
          const radius = attrs.radius || 50;
          const dist = Math.sqrt((x - pos[0]) ** 2 + (y - pos[1]) ** 2);
          if (dist <= radius) {
            return { layerId: layer.id, index: i, pos };
          }
        } else if (p.type === "path") {
          // Simplified hit test for path (bounding box)
          const points = attrs.points;
          if (Array.isArray(points)) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            points.forEach(seg => {
              if (seg.length === 8) {
                minX = Math.min(minX, seg[0], seg[6]);
                minY = Math.min(minY, seg[1], seg[7]);
                maxX = Math.max(maxX, seg[0], seg[6]);
                maxY = Math.max(maxY, seg[1], seg[7]);
              } else if (seg.length === 2) {
                minX = Math.min(minX, seg[0]);
                minY = Math.min(minY, seg[1]);
                maxX = Math.max(maxX, seg[0]);
                maxY = Math.max(maxY, seg[1]);
              }
            });
            if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
              return { layerId: layer.id, index: i, pos: [minX, minY] };
            }
          }
        }
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hit = getPrimitiveAt(x, y);
    if (hit) {
      setSelected({ layerId: hit.layerId, index: hit.index });
      setIsDragging(true);
      setDragOffset({ x: x - hit.pos[0], y: y - hit.pos[1] });
    } else {
      setSelected(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selected || !onPrimitiveMove) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newX = Math.round(x - dragOffset.x);
    const newY = Math.round(y - dragOffset.y);
    
    onPrimitiveMove(selected.layerId, selected.index, newX, newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const drawPrimitive = (
    ctx: CanvasRenderingContext2D,
    primitive: Primitive,
    layer: Layer,
    doc: GessoDocument
  ) => {
    const attrs = resolveAttributes(primitive.attributes, doc);
    
    ctx.save();

    // Global attributes
    if (attrs.opacity !== undefined) {
      ctx.globalAlpha = attrs.opacity;
    }

    const pos = attrs.pos || [0, 0];
    const fill = attrs.fill;
    const stroke = attrs.stroke;
    const strokeWidth = attrs.stroke_width || 1;

    // Find brush definition if any
    const brushId = attrs.brush;
    const brushDef = brushId ? doc.definitions.find(d => d.id === (brushId.name || brushId)) : null;
    const brushAttrs = brushDef ? resolveAttributes(brushDef.attributes, doc) : {};

    // Apply Brush Profile
    if (brushAttrs.type === "round") {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    } else if (brushAttrs.type === "flat") {
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
    }

    // Check for control lanes
    const strokeWidthControl = layer.controls?.find(c => c.property === "stroke_width");

    if (primitive.type === "path") {
      if (strokeWidthControl) {
        drawVariablePath(ctx, primitive, attrs, strokeWidthControl, brushAttrs, doc);
      } else {
        drawStandardPath(ctx, primitive, attrs, brushAttrs);
      }
    } else {
      // Standard shapes
      ctx.beginPath();
      if (primitive.type === "rect") {
        const size = attrs.size || [100, 100];
        ctx.rect(pos[0], pos[1], size[0], size[1]);
      } else if (primitive.type === "circle") {
        const radius = attrs.radius || 50;
        ctx.arc(pos[0], pos[1], radius, 0, Math.PI * 2);
      }

      if (fill && fill !== "none") {
        ctx.fillStyle = typeof fill === "string" ? fill : (fill.color || "#000");
        ctx.fill();
      }

      if (stroke && stroke !== "none") {
        ctx.strokeStyle = typeof stroke === "string" ? stroke : (stroke.color || "#000");
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
    }

    ctx.restore();
  };

  const drawStandardPath = (ctx: CanvasRenderingContext2D, primitive: Primitive, attrs: any, brushAttrs: any) => {
    const points = attrs.points;
    const stroke = attrs.stroke;
    const strokeWidth = attrs.stroke_width || 1;
    const fill = attrs.fill;

    ctx.beginPath();
    if (Array.isArray(points)) {
      for (let i = 0; i < points.length; i++) {
        const segment = points[i];
        if (segment.length === 8) {
          if (i === 0) ctx.moveTo(segment[0], segment[1]);
          ctx.bezierCurveTo(segment[2], segment[3], segment[4], segment[5], segment[6], segment[7]);
        } else if (segment.length === 2) {
          if (i === 0) ctx.moveTo(segment[0], segment[1]);
          else ctx.lineTo(segment[0], segment[1]);
        }
      }
    }

    if (fill && fill !== "none") {
      ctx.fillStyle = typeof fill === "string" ? fill : (fill.color || "#000");
      ctx.fill();
    }

    if (stroke && stroke !== "none") {
      const color = typeof stroke === "string" ? stroke : (stroke.color || "#000");
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      
      if (brushAttrs.texture === "bristle") {
        drawBristleStroke(ctx, () => ctx.stroke());
      } else {
        ctx.stroke();
      }
    }
  };

  const drawVariablePath = (
    ctx: CanvasRenderingContext2D,
    primitive: Primitive,
    attrs: any,
    control: ControlLane,
    brushAttrs: any,
    doc: GessoDocument
  ) => {
    const points = attrs.points;
    const stroke = attrs.stroke;
    const strokeColor = typeof stroke === "string" ? stroke : (stroke?.color || "#000");
    const controlValues = control.values.map(v => resolveValue(v, doc.definitions) as number);

    if (!Array.isArray(points)) return;

    // For simplicity in Sprint 3, we segment each bezier curve into 20 steps
    const steps = 20;
    
    for (let i = 0; i < points.length; i++) {
      const segment = points[i];
      if (segment.length !== 8) continue;

      const [x0, y0, cx1, cy1, cx2, cy2, x1, y1] = segment;

      for (let j = 0; j < steps; j++) {
        const t1 = j / steps;
        const t2 = (j + 1) / steps;

        // Interpolate stroke width
        const width = interpolate(controlValues, t1);

        const p1 = getBezierPoint(t1, x0, y0, cx1, cy1, cx2, cy2, x1, y1);
        const p2 = getBezierPoint(t2, x0, y0, cx1, cy1, cx2, cy2, x1, y1);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = width;

        if (brushAttrs.texture === "bristle") {
          drawBristleStroke(ctx, () => ctx.stroke());
        } else {
          ctx.stroke();
        }
      }
    }
  };

  const drawBristleStroke = (ctx: CanvasRenderingContext2D, strokeFn: () => void) => {
    const originalWidth = ctx.lineWidth;
    const bristleCount = 3;
    const offset = originalWidth / 4;

    for (let i = 0; i < bristleCount; i++) {
      ctx.save();
      ctx.lineWidth = originalWidth / 2.5;
      ctx.translate((i - 1) * offset, (i - 1) * offset);
      ctx.globalAlpha *= 0.6;
      strokeFn();
      ctx.restore();
    }
  };

  const interpolate = (values: number[], t: number): number => {
    if (values.length === 1) return values[0];
    const idx = t * (values.length - 1);
    const i = Math.floor(idx);
    const f = idx - i;
    if (i >= values.length - 1) return values[values.length - 1];
    return values[i] * (1 - f) + values[i + 1] * f;
  };

  const getBezierPoint = (t: number, x0: number, y0: number, cx1: number, cy1: number, cx2: number, cy2: number, x1: number, y1: number) => {
    const invT = 1 - t;
    return {
      x: invT ** 3 * x0 + 3 * invT ** 2 * t * cx1 + 3 * invT * t ** 2 * cx2 + t ** 3 * x1,
      y: invT ** 3 * y0 + 3 * invT ** 2 * t * cy1 + 3 * invT * t ** 2 * cy2 + t ** 3 * y1
    };
  };

  const resolveAttributes = (
    attributes: Record<string, any>,
    doc: GessoDocument
  ) => {
    const resolved: Record<string, any> = {};
    for (const [key, value] of Object.entries(attributes)) {
      resolved[key] = resolveValue(value, doc.definitions);
    }
    return resolved;
  };

  return (
    <div className="relative border border-zinc-300 shadow-2xl bg-white overflow-hidden rounded-sm">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="max-w-full h-auto block mx-auto cursor-crosshair"
        style={{ aspectRatio: "auto" }}
      />
    </div>
  );
};
