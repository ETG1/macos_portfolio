import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react'

const FONT_WEIGHTS = {
    subtitle: { min: 200, max: 600, default: 200 },
    title: { min: 400, max: 900, default: 400 }
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, index) => (
        <span key={`${char}-${index}`} className={className} style={{ fontVariationSettings: `'wght' ${baseWeight}` }}>
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};

const setupTextHover = (container, type) => {
    if (!container) return;
    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];
    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration, 
            ease: "power2.out", 
            fontVariationSettings: `'wght' ${weight}`,
        });
    };
    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;
        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));
            const intensity = Math.exp(-(distance ** 2) / 2000);
            animateLetter(letter, min + (max - min) * intensity);
        });
    };
    const handleMouseLeave = () =>
        letters.forEach((letter) => animateLetter(letter, base, 0.3));
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
    };
};

function Welcome() {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, "title");
        const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            subtitleCleanup();
            titleCleanup();
        };
    }, []);

    return (
        <section id='welcome'>
            <p ref={subtitleRef}>
                <span className="text-3xl font-georama">
                    {renderText("Hi, I'm Eli welcome to my", "text-3xl font-georama", 100)}
                </span>
            </p>
            <h1 ref={titleRef} className='mt-4'>
                <span className="text-6xl font-georama italic">
                    {renderText("Portfolio", "text-6xl font-georama italic", 100)}
                </span>
            </h1>
            <div className='small-screen'>
                <p>This portfolio is designed for desktop/tablet screens only</p>
            </div>
        </section>
    );
}

export default Welcome;
