import React, { useState, useEffect, useRef } from "react";

/**
 * AnimatedCharacters Component
 * Features 4 expressive characters (Purple, Pink, Orange, Yellow) inspired by the interactive login animation.
 * Features:
 * - Real-time pupil tracking of mouse position
 * - Reactive states when Email is focused (all characters glance right)
 * - Reactive states when Password is focused (characters shy away / cover eyes)
 * - Peeking behavior when Show Password is toggled
 * - Natural periodic blinking
 */
const AnimatedCharacters = ({ activeField, isPasswordShown }) => {
  const containerRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse tracking logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.45;

      // When password is active and hidden, look down/shy away
      if (activeField === "password" && !isPasswordShown) {
        setPupilOffset({ x: -4, y: 6 });
        return;
      }

      // When email/name is active, look right toward the form
      if (activeField === "email" || activeField === "name") {
        setPupilOffset({ x: 7, y: 3 });
        return;
      }

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy) / 60, 1);
      const maxRadius = 6;

      setPupilOffset({
        x: Math.cos(angle) * maxRadius * dist,
        y: Math.sin(angle) * maxRadius * dist
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeField, isPasswordShown]);

  // Periodic blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  const isCoveringEyes = activeField === "password" && !isPasswordShown;
  const isPeeking = activeField === "password" && isPasswordShown;

  return (
    <div className="char-stage-wrapper" ref={containerRef}>
      <svg
        viewBox="0 0 460 400"
        className="char-stage-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>

          <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="yellowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Shadow filters for texture */}
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.08)" />
          </filter>
        </defs>

        {/* ========================================================
            1. PURPLE CHARACTER (Tall, Central Pillar)
            ======================================================== */}
        <g className={`char-purple ${isCoveringEyes ? "hiding" : ""}`}>
          {/* Body */}
          <rect
            x="130"
            y="130"
            width="125"
            height="270"
            rx="45"
            fill="url(#purpleGrad)"
            filter="url(#softGlow)"
          />

          {/* Eyes (if not covered or when peeking) */}
          {!isCoveringEyes ? (
            <g className="purple-eyes">
              {/* Left Eye */}
              <ellipse cx="170" cy="180" rx="9" ry={isBlinking ? "1" : "9"} fill="#ffffff" />
              {!isBlinking && (
                <circle
                  cx={170 + pupilOffset.x}
                  cy={180 + pupilOffset.y}
                  r="4.5"
                  fill="#1e1b4b"
                />
              )}

              {/* Right Eye */}
              <ellipse cx="205" cy="180" rx="9" ry={isBlinking ? "1" : "9"} fill="#ffffff" />
              {!isBlinking && (
                <circle
                  cx={205 + pupilOffset.x}
                  cy={180 + pupilOffset.y}
                  r="4.5"
                  fill="#1e1b4b"
                />
              )}

              {/* Cute Smile */}
              <path
                d="M 182 198 Q 188 206 194 198"
                stroke="#1e1b4b"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            /* Eyes closed shyly / hands covering / peeking */
            <g className="purple-shy-face">
              {isPeeking ? (
                <>
                  {/* Left eye peeking through paws */}
                  <ellipse cx="170" cy="180" rx="8" ry="7" fill="#ffffff" />
                  <circle cx="172" cy="181" r="3.5" fill="#1e1b4b" />
                  <path
                    d="M 197 181 Q 204 176 211 181"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Surprised / curious mouth */}
                  <ellipse cx="188" cy="198" rx="3.5" ry="4.5" fill="#4c1d95" />
                </>
              ) : (
                <>
                  <path
                    d="M 163 182 Q 170 176 177 182"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 198 182 Q 205 176 212 182"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <ellipse cx="188" cy="198" rx="4" ry="2" fill="#4c1d95" />
                </>
              )}
            </g>
          )}

          {/* Hands covering eyes when typing password */}
          {(isCoveringEyes || isPeeking) && (
            <g className="purple-paws">
              {/* Left Arm & Paw */}
              <path
                d={isPeeking ? "M 130 230 Q 138 205 150 192" : "M 130 230 Q 142 200 166 182"}
                stroke="#7c3aed"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx={isPeeking ? 150 : 166}
                cy={isPeeking ? 192 : 182}
                r="12"
                fill="#8b5cf6"
                stroke="#6d28d9"
                strokeWidth="2"
              />

              {/* Right Arm & Paw */}
              <path
                d={isPeeking ? "M 255 230 Q 244 205 226 192" : "M 255 230 Q 242 200 208 182"}
                stroke="#7c3aed"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx={isPeeking ? 226 : 208}
                cy={isPeeking ? 192 : 182}
                r="12"
                fill="#8b5cf6"
                stroke="#6d28d9"
                strokeWidth="2"
              />
            </g>
          )}
        </g>

        {/* ========================================================
            2. PINK CHARACTER (Slender, Curious Pillar)
            ======================================================== */}
        <g className={`char-pink ${isCoveringEyes ? "shy" : ""}`}>
          {/* Body */}
          <rect
            x="245"
            y="190"
            width="65"
            height="210"
            rx="32"
            fill="url(#pinkGrad)"
            filter="url(#softGlow)"
          />

          {/* Two Eyes near top */}
          <g className="pink-eyes">
            <ellipse cx="264" cy="225" rx="8" ry={isBlinking ? "1" : "8"} fill="#ffffff" />
            {!isBlinking && (
              <circle
                cx={264 + (isCoveringEyes ? -3 : pupilOffset.x)}
                cy={225 + (isCoveringEyes ? 4 : pupilOffset.y)}
                r="4"
                fill="#4c0519"
              />
            )}

            <ellipse cx="288" cy="225" rx="8" ry={isBlinking ? "1" : "8"} fill="#ffffff" />
            {!isBlinking && (
              <circle
                cx={288 + (isCoveringEyes ? -3 : pupilOffset.x)}
                cy={225 + (isCoveringEyes ? 4 : pupilOffset.y)}
                r="4"
                fill="#4c0519"
              />
            )}
          </g>
        </g>

        {/* ========================================================
            3. YELLOW CHARACTER (Right Rounded Dome with beak)
            ======================================================== */}
        <g className="char-yellow">
          {/* Body */}
          <rect
            x="300"
            y="235"
            width="80"
            height="165"
            rx="40"
            fill="url(#yellowGrad)"
            filter="url(#softGlow)"
          />

          {/* Eyes / Face */}
          <g className="yellow-face">
            {/* Eye */}
            <ellipse cx="328" cy="270" rx="4" ry={isBlinking ? "0.5" : "4"} fill="#422006" />

            {/* Horizontal Beak / Cute expression line */}
            <path
              d={isCoveringEyes ? "M 342 278 L 388 278" : "M 345 275 L 390 275"}
              stroke="#1c1917"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* ========================================================
            4. ORANGE CHARACTER (Wide, Happy Round Blob at Front)
            ======================================================== */}
        <g className="char-orange">
          {/* Body */}
          <path
            d="M 60 400 C 60 270, 180 270, 240 330 C 260 350, 260 400, 260 400 Z"
            fill="url(#orangeGrad)"
            filter="url(#softGlow)"
          />

          {/* Happy Eyes */}
          <g className="orange-face">
            {!isCoveringEyes ? (
              <>
                <circle cx="160" cy="335" r="4.5" fill="#431407" />
                <circle
                  cx={160 + pupilOffset.x * 0.5}
                  cy={335 + pupilOffset.y * 0.5}
                  r="2"
                  fill="#ffffff"
                />
              </>
            ) : (
              <path
                d="M 154 336 Q 160 330 166 336"
                stroke="#431407"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Big Smile */}
            <path
              d="M 172 344 Q 184 358 196 344"
              stroke="#431407"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedCharacters;
