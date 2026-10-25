import React, { useState, useEffect, useRef } from "react";

/**
 * AnimatedCharacters Component
 * Features 4 expressive characters (Purple, Pink, Orange, Yellow) faithfully matching the YouTube reference video.
 * Features:
 * - Real-time pupil tracking across all characters via Math.atan2
 * - Yellow character with dynamic body sway & beak seesaw rotation following cursor
 * - Purple character that lifts arms and covers eyes when typing password
 * - Peeking behavior when password visibility is toggled
 * - Natural periodic blinking
 * - Idle breathing and organic physics
 */
const AnimatedCharacters = ({ activeField, isPasswordShown }) => {
  const containerRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [yellowBeakAngle, setYellowBeakAngle] = useState(0);
  const [yellowBodyTilt, setYellowBodyTilt] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Real-time mouse tracking logic for eyes & yellow character motion
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.5;

      // 1. Password state: eyes shy away / yellow dips beak
      if (activeField === "password" && !isPasswordShown) {
        setPupilOffset({ x: -4, y: 6 });
        setYellowBeakAngle(14); // beak tilts downward shyly
        setYellowBodyTilt(3);
        return;
      }

      // 2. Email / Name state: all glance towards form
      if (activeField === "email" || activeField === "name") {
        setPupilOffset({ x: 7, y: 3 });
        setYellowBeakAngle(-6); // beak tilts up toward input
        setYellowBodyTilt(-2);
        return;
      }

      // 3. Normal mouse tracking
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const dist = Math.min(Math.hypot(dx, dy) / 60, 1);
      const maxRadius = 6.5;

      setPupilOffset({
        x: Math.cos(angle) * maxRadius * dist,
        y: Math.sin(angle) * maxRadius * dist
      });

      // Yellow character motion: tilts and beak rotates like seesaw
      // Normalized X (-1 to 1) and Y (-1 to 1)
      const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth / 2)));
      const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight / 2)));

      setYellowBodyTilt(normX * 6); // body sways up to 6 degrees
      setYellowBeakAngle(normY * 18); // beak rotates up to 18 degrees with vertical mouse motion
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeField, isPasswordShown]);

  // Periodic natural blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);
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
                  style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
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
                  style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
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
                  {/* Left eye peeking through parted paws */}
                  <ellipse cx="170" cy="180" rx="8" ry="7" fill="#ffffff" />
                  <circle cx="172" cy="181" r="3.5" fill="#1e1b4b" />
                  <path
                    d="M 197 181 Q 204 176 211 181"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Curious mouth */}
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
                cx={264 + (isCoveringEyes ? -3 : pupilOffset.x * 0.9)}
                cy={225 + (isCoveringEyes ? 4 : pupilOffset.y * 0.9)}
                r="4"
                fill="#4c0519"
                style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
              />
            )}

            <ellipse cx="288" cy="225" rx="8" ry={isBlinking ? "1" : "8"} fill="#ffffff" />
            {!isBlinking && (
              <circle
                cx={288 + (isCoveringEyes ? -3 : pupilOffset.x * 0.9)}
                cy={225 + (isCoveringEyes ? 4 : pupilOffset.y * 0.9)}
                r="4"
                fill="#4c0519"
                style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
              />
            )}
          </g>
        </g>

        {/* ========================================================
            3. YELLOW CHARACTER (Right Rounded Dome with dynamic motion & seesaw beak)
            ======================================================== */}
        <g
          className="char-yellow"
          style={{
            transformOrigin: "340px 400px",
            transform: `rotate(${yellowBodyTilt}deg)`,
            transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)"
          }}
        >
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

          {/* Face */}
          <g className="yellow-face">
            {/* Eye that tracks cursor */}
            <ellipse
              cx={328 + pupilOffset.x * 0.6}
              cy={270 + pupilOffset.y * 0.6}
              rx="4"
              ry={isBlinking ? "0.5" : "4"}
              fill="#422006"
              style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
            />

            {/* Dynamic Seesaw Beak / Expression line that rotates with motion */}
            <g
              style={{
                transformOrigin: "345px 275px",
                transform: `rotate(${yellowBeakAngle}deg)`,
                transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)"
              }}
            >
              <line
                x1="345"
                y1="275"
                x2="390"
                y2="275"
                stroke="#1c1917"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>
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
                  style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
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
