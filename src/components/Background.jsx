import { useEffect, useRef } from "react";

const hexToRgb = (hex) => {
    let h = hex.trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return Number.isNaN(n) ? [6, 182, 212] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export default function Background() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let w = 0, h = 0, raf, frame = 0;
        let particles = [];
        let rgb = [6, 182, 212];
        const mouse = { x: -9999, y: -9999 };
        const LINK = 130;
        const MOUSE_R = 160;

        const readColor = () => {
            const v = getComputedStyle(document.documentElement).getPropertyValue("--blue");
            rgb = hexToRgb(v || "#06b6d4");
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(Math.floor((w * h) / 14000), 110);
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 1.6 + 0.8,
            }));
        };

        const draw = () => {
            if (frame++ % 30 === 0) readColor();
            const [r, g, b] = rgb;
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!reduceMotion) {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;

                    // gentle push away from cursor
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const d = Math.hypot(dx, dy);
                    if (d < MOUSE_R && d > 0) {
                        const f = (MOUSE_R - d) / MOUSE_R;
                        p.x += (dx / d) * f * 2.5;
                        p.y += (dy / d) * f * 2.5;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dist = Math.hypot(p.x - q.x, p.y - q.y);
                    if (dist < LINK) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / LINK) * 0.35})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // lines from cursor to nearby particles
            for (const p of particles) {
                const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (d < MOUSE_R) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / MOUSE_R) * 0.6})`;
                    ctx.stroke();
                }
            }

            raf = requestAnimationFrame(draw);
        };

        const onMove = (e) => {
            const t = e.touches ? e.touches[0] : e;
            mouse.x = t.clientX;
            mouse.y = t.clientY;
        };
        const onLeave = () => {
            mouse.x = mouse.y = -9999;
        };

        readColor();
        resize();
        draw();

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: true });
        window.addEventListener("mouseout", onLeave);
        window.addEventListener("touchend", onLeave);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("mouseout", onLeave);
            window.removeEventListener("touchend", onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 0,
                pointerEvents: "none",
            }}
        />
    );
}