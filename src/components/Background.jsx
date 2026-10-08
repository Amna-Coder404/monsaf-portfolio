import { useEffect, useRef } from "react"

const hexToRgb = (hex) => {
    let h = hex.trim().replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return Number.isNaN(n) ? [6, 182, 212] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function Background() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let w = 0, h = 0, raf, frame = 0;
        let particles = [];
        let bubbles = [];
        let sparks = [];
        let box = null;
        let rgb;
        const mouse = { x: -9999, y: -9999 };
        const LINK = 130;
        const MOUSE_R = 160;

        // ---------- SETTINGS ----------

        const SCROLL_SPEED = 0.15;   // bubbles + dots on scroll (lower = slower)
        const BOX_SCROLL_SPEED = 0.3; // box movement on scroll
        const BOX_SPIN_SPEED = 0.002; // box rotation on scroll

        let scrollY = window.scrollY;
        let smoothScroll = scrollY;
        let lastSmooth = scrollY;
        let scrollDelta = 0;

        const readColor = () => {
            const v = getComputedStyle(document.documentElement).getPropertyValue("--blue");
            rgb = hexToRgb(v || "#06b6d4");
        };

        // ---------- BUBBLES ----------
        const makeBubble = (fromBottom = false) => {
            const r = Math.random() * 28 + 8; // 8 - 36px
            return {
                x: Math.random() * w,
                y: fromBottom ? h + r + Math.random() * 80 : Math.random() * h,
                r,
                speed: (Math.random() * 0.5 + 0.25) * (1 - r / 90),
                phase: Math.random() * Math.PI * 2,
                wobble: Math.random() * 0.8 + 0.3,
                wobbleSpeed: Math.random() * 0.02 + 0.008,
                alpha: Math.random() * 0.4 + 0.5,
            };
        };

        const popBubble = (b) => {
            const n = Math.round(b.r / 2) + 6;
            for (let i = 0; i < n; i++) {
                const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
                const s = Math.random() * 2.2 + 0.8;
                sparks.push({
                    x: b.x + Math.cos(a) * b.r,
                    y: b.y + Math.sin(a) * b.r,
                    vx: Math.cos(a) * s,
                    vy: Math.sin(a) * s,
                    life: 1,
                    r: Math.random() * 1.8 + 0.6,
                });
            }
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

            // original count + exactly EXTRA_BUBBLES
            // only 3 or 4 bubbles in total (3 on phones, 4 on bigger screens)
            const bubbleCount = w < 640 ? 3 : 4;
            bubbles = Array.from({ length: bubbleCount }, () => makeBubble(false));

            // one glass box
            const size = w < 640 ? 46 : 70;
            box = {
                x: w * (w < 640 ? 0.75 : 0.8),
                y: h * 0.55,
                size,
                angle: 0.4,
            };
        };

        const drawBubble = (b, r, g, bl) => {
            const { x, y, r: rad, alpha } = b;

            const grad = ctx.createRadialGradient(
                x - rad * 0.35, y - rad * 0.35, rad * 0.1,
                x, y, rad
            );
            grad.addColorStop(0, `rgba(255,255,255,${0.22 * alpha})`);
            grad.addColorStop(0.45, `rgba(${r},${g},${bl},${0.06 * alpha})`);
            grad.addColorStop(1, `rgba(${r},${g},${bl},${0.22 * alpha})`);

            ctx.beginPath();
            ctx.arc(x, y, rad, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.lineWidth = 1;
            ctx.strokeStyle = `rgba(${r},${g},${bl},${0.45 * alpha})`;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, rad * 0.72, Math.PI * 1.15, Math.PI * 1.45);
            ctx.strokeStyle = `rgba(255,255,255,${0.55 * alpha})`;
            ctx.lineWidth = Math.max(1, rad * 0.07);
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.lineCap = "butt";
        };

        // rounded square path (works in every browser)
        const roundedRect = (x, y, s, rad) => {
            const hs = s / 2;
            ctx.beginPath();
            ctx.moveTo(x - hs + rad, y - hs);
            ctx.arcTo(x + hs, y - hs, x + hs, y + hs, rad);
            ctx.arcTo(x + hs, y + hs, x - hs, y + hs, rad);
            ctx.arcTo(x - hs, y + hs, x - hs, y - hs, rad);
            ctx.arcTo(x - hs, y - hs, x + hs, y - hs, rad);
            ctx.closePath();
        };

        const drawBox = (r, g, b) => {
            if (!box) return;
            ctx.save();
            ctx.translate(box.x, box.y);
            ctx.rotate(box.angle);

            const s = box.size;
            const grad = ctx.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
            grad.addColorStop(0, `rgba(255,255,255,0.14)`);
            grad.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0.2)`);

            roundedRect(0, 0, s, s * 0.18);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
            ctx.stroke();

            // shine line on the top-left edge
            ctx.beginPath();
            ctx.moveTo(-s / 2 + s * 0.18, -s / 2 + s * 0.12);
            ctx.lineTo(s / 2 - s * 0.3, -s / 2 + s * 0.12);
            ctx.strokeStyle = `rgba(255,255,255,0.45)`;
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.lineCap = "butt";

            ctx.restore();
        };

        const draw = () => {
            frame++;
            if (frame % 30 === 0) readColor();
            const [r, g, b] = rgb;
            ctx.clearRect(0, 0, w, h);

            // Smooth the scroll so movement is soft, never jumpy
            smoothScroll += (scrollY - smoothScroll) * 0.06;
            scrollDelta = reduceMotion ? 0 : smoothScroll - lastSmooth;
            lastSmooth = smoothScroll;

            // Cursor ambient glow
            if (mouse.x !== -9999 && mouse.y !== -9999) {
                const gradient = ctx.createRadialGradient(
                    mouse.x, mouse.y, 0,
                    mouse.x, mouse.y, MOUSE_R
                );
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
            }

            // Box: moves and rotates with scroll, plus a tiny idle drift
            if (box) {
                if (!reduceMotion) {
                    box.y -= scrollDelta * BOX_SCROLL_SPEED;
                    box.angle += scrollDelta * BOX_SPIN_SPEED + 0.0008;
                    box.x += Math.sin(frame * 0.004) * 0.15;

                    if (box.y < -box.size) box.y = h + box.size;
                    if (box.y > h + box.size) box.y = -box.size;
                }
                drawBox(r, g, b);
            }

            // Bubbles
            for (const bub of bubbles) {
                if (!reduceMotion) {
                    bub.y -= bub.speed;
                    bub.x += Math.sin(frame * bub.wobbleSpeed + bub.phase) * bub.wobble;

                    // slow scroll parallax: bigger bubbles move a bit more
                    bub.y -= scrollDelta * (bub.r / 36) * SCROLL_SPEED;

                    const dx = bub.x - mouse.x;
                    const dy = bub.y - mouse.y;
                    const d = Math.hypot(dx, dy);
                    if (d < MOUSE_R + bub.r && d > 0) {
                        const f = (MOUSE_R + bub.r - d) / (MOUSE_R + bub.r);
                        bub.x += (dx / d) * f * 2;
                        bub.y += (dy / d) * f * 2;
                    }

                    if (bub.y < -bub.r * 2) Object.assign(bub, makeBubble(true));
                    if (bub.y > h + 150) bub.y = -bub.r * 2;
                    if (bub.x < -bub.r) bub.x = w + bub.r;
                    if (bub.x > w + bub.r) bub.x = -bub.r;
                }
                drawBubble(bub, r, g, b);
            }

            // Pop sparks
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.x += s.vx;
                s.y += s.vy;
                s.vx *= 0.96;
                s.vy *= 0.96;
                s.life -= 0.025;
                if (s.life <= 0) {
                    sparks.splice(i, 1);
                    continue;
                }
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${s.life * 0.9})`;
                ctx.fill();
            }

            // Particle network
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (!reduceMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    p.y = (((p.y - scrollDelta * p.r * 0.04) % h) + h) % h;

                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;

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

            // Lines from cursor to nearby particles
            for (const p of particles) {
                const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (d < MOUSE_R) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / MOUSE_R) * 0.6})`;
                    ctx.lineWidth = 1;
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
        const onScroll = () => {
            scrollY = window.scrollY;
        };

        // click / tap a bubble to pop it
        const onPointerDown = (e) => {
            for (let i = bubbles.length - 1; i >= 0; i--) {
                const b = bubbles[i];
                if (Math.hypot(e.clientX - b.x, e.clientY - b.y) <= b.r + 4) {
                    popBubble(b);
                    bubbles[i] = makeBubble(true);
                    break;
                }
            }
        };

        readColor();
        resize();
        draw();

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchmove", onMove, { passive: true });
        window.addEventListener("mouseout", onLeave);
        window.addEventListener("touchend", onLeave);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointerdown", onPointerDown);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("mouseout", onLeave);
            window.removeEventListener("touchend", onLeave);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("pointerdown", onPointerDown);
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