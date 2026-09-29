// script.js
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('scroll-track');
    const canvas = document.getElementById('web-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        buildSpiderWeb();
    });

    // Procedural Spider Web Math Structure
    let radialRays = [];
    let spiralRings = [];

    function buildSpiderWeb() {
        const centerX = width / 2;
        const centerY = height / 2;
        const numRays = 16;
        const numRings = 10;
        const maxRadius = Math.max(width, height) * 0.7;

        radialRays = [];
        for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays) * Math.PI * 2;
            radialRays.push({
                x: centerX + Math.cos(angle) * maxRadius,
                y: centerY + Math.sin(angle) * maxRadius,
                angle
            });
        }

        spiralRings = [];
        for (let r = 1; r <= numRings; r++) {
            const ringRadius = (r / numRings) * maxRadius;
            const points = [];
            for (let i = 0; i < numRays; i++) {
                const angle = (i / numRays) * Math.PI * 2;
                points.push({
                    x: centerX + Math.cos(angle) * ringRadius,
                    y: centerY + Math.sin(angle) * ringRadius
                });
            }
            spiralRings.push(points);
        }
    }
    buildSpiderWeb();

    // Scroll Progress Logic
    window.addEventListener('scroll', () => {
        if (!track || !ctx) return;

        const rect = track.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / totalHeight));

        // Render Spider Web Frame
        ctx.clearRect(0, 0, width, height);

        if (progress > 0.1) {
            const centerX = width / 2;
            const centerY = height / 2;

            // Color transition: Red -> Blue
            let lineAlpha = Math.min(1, (progress - 0.1) * 3);
            let r = progress < 0.5 ? 255 : Math.floor(255 * (1 - (progress - 0.5) * 3));
            let g = progress < 0.5 ? 42 : Math.floor(240 * ((progress - 0.5) * 2));
            let b = progress < 0.5 ? 95 : 255;

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineAlpha * 0.7})`;
            ctx.lineWidth = 1.5;

            // Draw Rays
            const rayProgress = Math.min(1, (progress - 0.1) / 0.3);
            radialRays.forEach(ray => {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    centerX + (ray.x - centerX) * rayProgress,
                    centerY + (ray.y - centerY) * rayProgress
                );
                ctx.stroke();
            });

            // Draw Rings
            const ringProgress = Math.min(1, (progress - 0.25) / 0.4);
            const visibleRings = Math.floor(spiralRings.length * ringProgress);

            for (let r = 0; r < visibleRings; r++) {
                const points = spiralRings[r];
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let p = 1; p < points.length; p++) {
                    ctx.lineTo(points[p].x, points[p].y);
                }
                ctx.closePath();
                ctx.stroke();

                // Draw Node Points
                if (progress > 0.5) {
                    points.forEach(pt => {
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = '#00f0ff';
                        ctx.fill();
                    });
                }
            }
        }

        // Toggle Text States
        const step1 = document.getElementById('text-step-1');
        const step2 = document.getElementById('text-step-2');
        const step3 = document.getElementById('text-step-3');
        const step4 = document.getElementById('text-step-4');

        if (progress < 0.2) {
            step1.style.opacity = '1'; step1.style.transform = 'scale(1)';
            step2.style.opacity = '0'; step2.style.transform = 'translateY(20px)';
            step3.style.opacity = '0';
            step4.style.opacity = '0';
        } else if (progress >= 0.2 && progress < 0.5) {
            step1.style.opacity = '0'; step1.style.transform = 'scale(0.9)';
            step2.style.opacity = '1'; step2.style.transform = 'translateY(0)';
            step3.style.opacity = '0'; step3.style.transform = 'translateY(20px)';
            step4.style.opacity = '0';
        } else if (progress >= 0.5 && progress < 0.8) {
            step1.style.opacity = '0';
            step2.style.opacity = '0'; step2.style.transform = 'translateY(-20px)';
            step3.style.opacity = '1'; step3.style.transform = 'translateY(0)';
            step4.style.opacity = '0'; step4.style.transform = 'translateY(20px)';
        } else {
            step1.style.opacity = '0';
            step2.style.opacity = '0';
            step3.style.opacity = '0'; step3.style.transform = 'translateY(-20px)';
            step4.style.opacity = '1'; step4.style.transform = 'translateY(0)';
        }
    });
});
                    