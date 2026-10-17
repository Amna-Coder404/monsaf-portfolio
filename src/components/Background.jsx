import { useEffect, useRef } from "react";

const hexToRgb = (hex) => {
    let value = hex.trim().replace("#", "");

    if (value.length === 3) {
        value = value.split("").map((c) => c + c).join("");
    }

    const n = parseInt(value, 16);

    return Number.isNaN(n)
        ? [0, 113, 133]
        : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export default function Background() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let width = 0;
        let height = 0;
        let raf;
        let particles = [];
        let rgb = [0, 113, 133];

        const mouse = { x: -1000, y: -1000 };
        const LINK_DISTANCE = 125;

        const readTheme = () => {
            const root = document.documentElement;

            const color = getComputedStyle(root)
                .getPropertyValue("--blue")
                .trim();

            rgb = hexToRgb(color || "#007185");
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(
                Math.floor((width * height) / 22000),
                65
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.4 + 0.7,
            }));

            if (reduceMotion) draw();
        };

        const draw = () => {
            readTheme();

            const [r, g, b] = rgb;
            const isLight =
                document.documentElement.dataset.theme === "light";

            ctx.clearRect(0, 0, width, height);

            // Soft accent glow around the cursor
            if (mouse.x >= 0 && mouse.y >= 0) {
                const glow = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, 180
                );

                glow.addColorStop(
                    0,
                    `rgba(${r}, ${g}, ${b}, ${isLight ? 0.045 : 0.09})`
                );
                glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                ctx.fillStyle = glow;
                ctx.fillRect(0, 0, width, height);
            }

            // Floating particles and connecting lines
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!reduceMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;
                }

                // Keep particles inside the canvas
                p.x = Math.max(0, Math.min(width, p.x));
                p.y = Math.max(0, Math.min(height, p.y));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${isLight ? 0.35 : 0.7
                    })`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < LINK_DISTANCE) {
                        const opacity =
                            (1 - distance / LINK_DISTANCE) *
                            (isLight ? 0.12 : 0.22);

                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle =
                            `rgba(${r}, ${g}, ${b}, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            if (!reduceMotion) {
                raf = requestAnimationFrame(draw);
            }
        };

        const onMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const onLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        const onThemeChange = () => {
            readTheme();

            if (reduceMotion) draw();
        };

        const observer = new MutationObserver(onThemeChange);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        readTheme();
        resize();

        if (!reduceMotion) draw();

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseout", (event) => {
            if (!event.relatedTarget) onLeave();
        });

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0"
        />
    );
}