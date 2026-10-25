import React, { useState, useEffect, useRef } from "react";

/**
 * AnimatedCharacters Component
 * Features 4 expressive characters (Purple, Pink, Orange, Yellow) matching the interactive reference.
 * Features:
 * - Real-time pupil tracking across all characters via Math.atan2
 * - Dynamic Yellow character with body sway & seesaw beak motion following cursor
 * - Purple character that covers eyes with paws when password focused
 * - Peeking behavior when password visibility is toggled
 * - Exciting sign-in / sign-up process animation with celebration arms, bouncing, and sparkles when isLoading is active
 * - Periodic natural blinking and organic breathing
 */
const AnimatedCharacters = ({ activeField, isPasswordShown, isLoading = false, isTyping = false }) => {
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

      // When celebrating/loading, look straight forward/upward happily
      if (isLoading) {
        setPupilOffset({ x: 0, y: -3 });
        setYellowBeakAngle(-12);
        setYellowBodyTilt(0);
        return;
      }

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
      const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth / 2)));
      const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight / 2)));

      setYellowBodyTilt(normX * 6);
      setYellowBeakAngle(normY * 18);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeField, isPasswordShown, isLoading]);

  // Periodic natural blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const isCoveringEyes = activeField === "password" && !isPasswordShown && !isLoading;
  const isPeeking = activeField === "password" && isPasswordShown && !isLoading;
  const [isLampOn, setIsLampOn] = useState(true);

  return (
    <div className={`char-stage-wrapper ${isLoading ? "is-loading-celebration" : ""} ${isLampOn ? "lamp-illuminated" : "lamp-dimmed"}`} ref={containerRef}>
      {/* Hanging 3D Conical Lamp with Tucked-in Bright Bulb (Image 5) */}
      <div
        className={`stage-lamp ${isLampOn ? "lamp-on" : "lamp-off"}`}
        onClick={() => setIsLampOn(!isLampOn)}
        title="Click to toggle lamp illumination"
      >
        <div className="lamp-wire" />
        <div className="lamp-cap-top" />
        <div className="lamp-cap-bottom" />
        <div className="lamp-shade-body" />
        <div className="lamp-rim-opening" />
        <div className="lamp-bulb" />
        <div className="lamp-bulb-glow" />
        <div className="lamp-beam" />
        <div className="lamp-ambient-glow" />
        <div className="lamp-pull-cord">
          <div className="cord-wire" />
          <div className="cord-ball" />
        </div>
      </div>

      {/* Glowing stage floor reflection */}
      <div className={`floor-glow ${isLampOn ? "floor-glow-active" : ""}`} />

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

        {/* Celebration sparkles when signing in / signing up */}
        {isLoading && (
          <g className="char-sparkles">
            <circle cx="110" cy="110" r="4" fill="#fde047" className="sparkle-dot s1" />
            <circle cx="280" cy="95" r="5" fill="#ec4899" className="sparkle-dot s2" />
            <circle cx="370" cy="140" r="4.5" fill="#60a5fa" className="sparkle-dot s3" />
            <polygon points="190,90 193,98 201,100 193,102 190,110 187,102 179,100 187,98" fill="#fbbf24" className="sparkle-star star1" />
            <polygon points="320,110 322,116 328,118 322,120 320,126 318,120 312,118 318,116" fill="#a78bfa" className="sparkle-star star2" />
          </g>
        )}

        {/* ========================================================
            1. PURPLE CHARACTER (Tall, Central Pillar)
            ======================================================== */}
        <g className={`char-purple ${isCoveringEyes ? "hiding" : ""} ${isLoading ? "celebrating" : ""}`}>
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

          {/* Eyes & Expressions */}
          {isLoading ? (
            /* Joyful celebration face */
            <g className="purple-happy-face">
              <path d="M 162 178 Q 170 170 178 178" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 197 178 Q 205 170 213 178" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 180 194 Q 188 208 196 194 Z" fill="#ffffff" />
            </g>
          ) : !isCoveringEyes ? (
            /* Normal tracking eyes */
            <g className="purple-eyes">
              {/* Left Eye */}
              <ellipse cx="170" cy="180" rx="9.5" ry={isBlinking ? "1" : "9.5"} fill="#ffffff" />
              {!isBlinking && (
                <>
                  <circle
                    cx={170 + pupilOffset.x}
                    cy={180 + pupilOffset.y}
                    r="4.8"
                    fill="#1e1b4b"
                    style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
                  />
                  <circle
                    cx={171.5 + pupilOffset.x * 0.85}
                    cy={178 + pupilOffset.y * 0.85}
                    r="1.8"
                    fill="#ffffff"
                  />
                </>
              )}

              {/* Right Eye */}
              <ellipse cx="205" cy="180" rx="9.5" ry={isBlinking ? "1" : "9.5"} fill="#ffffff" />
              {!isBlinking && (
                <>
                  <circle
                    cx={205 + pupilOffset.x}
                    cy={180 + pupilOffset.y}
                    r="4.8"
                    fill="#1e1b4b"
                    style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
                  />
                  <circle
                    cx={206.5 + pupilOffset.x * 0.85}
                    cy={178 + pupilOffset.y * 0.85}
                    r="1.8"
                    fill="#ffffff"
                  />
                </>
              )}

              {/* Cute Smile / Mouth */}
              {isTyping ? (
                <path
                  className="purple-talking-mouth"
                  d="M 180 196 Q 188 208 196 196 Z"
                  fill="#1e1b4b"
                />
              ) : (
                <path
                  d="M 182 198 Q 188 206 194 198"
                  stroke="#1e1b4b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          ) : (
            /* Eyes closed shyly / hands covering / peeking */
            <g className="purple-shy-face">
              {/* Cute Blushing Rosy Cheeks */}
              <ellipse cx="150" cy="195" rx="8" ry="4.5" fill="#f43f5e" opacity="0.65" />
              <ellipse cx="225" cy="195" rx="8" ry="4.5" fill="#f43f5e" opacity="0.65" />

              {isPeeking ? (
                <>
                  {/* Cute Blushing Rosy Cheeks (Image 2) */}
                  <ellipse cx="146" cy="195" rx="8.5" ry="5" fill="#f43f5e" opacity="0.8" />
                  <ellipse cx="228" cy="195" rx="8.5" ry="5" fill="#f43f5e" opacity="0.8" />

                  {/* Left Eye Wide Open & Looking (Image 2) */}
                  <ellipse cx="170" cy="180" rx="9.5" ry="9.5" fill="#ffffff" />
                  <circle
                    cx={170 + (pupilOffset.x || 3.5)}
                    cy={180 + (pupilOffset.y || -1)}
                    r="4.8"
                    fill="#1e1b4b"
                    style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
                  />
                  <circle
                    cx={171.8 + (pupilOffset.x || 3.5) * 0.85}
                    cy={178 + (pupilOffset.y || -1) * 0.85}
                    r="1.8"
                    fill="#ffffff"
                  />

                  {/* Right Eye Wide Open & Looking (Image 2) */}
                  <ellipse cx="205" cy="180" rx="9.5" ry="9.5" fill="#ffffff" />
                  <circle
                    cx={205 + (pupilOffset.x || 3.5)}
                    cy={180 + (pupilOffset.y || -1)}
                    r="4.8"
                    fill="#1e1b4b"
                    style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
                  />
                  <circle
                    cx={206.8 + (pupilOffset.x || 3.5) * 0.85}
                    cy={178 + (pupilOffset.y || -1) * 0.85}
                    r="1.8"
                    fill="#ffffff"
                  />

                  {/* Cute Happy Smile (Image 2) */}
                  <path
                    d="M 182 198 Q 188 207 194 198"
                    stroke="#1e1b4b"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              ) : (
                <>
                  {/* Both eyes closed shyly with curved lines (Image 1) */}
                  <path
                    d="M 163 181 Q 170 175 178 181"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 197 181 Q 204 175 212 181"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <ellipse cx="188" cy="198" rx="4" ry="2.5" fill="#4c1d95" />
                </>
              )}
            </g>
          )}

          {/* Raised arms when celebrating / loading */}
          {isLoading ? (
            <g className="purple-cheering-arms">
              {/* Left Arm Raised High */}
              <path d="M 130 220 Q 110 160 135 125" stroke="#7c3aed" strokeWidth="18" strokeLinecap="round" fill="none" />
              <circle cx="135" cy="125" r="12" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="2" />

              {/* Right Arm Raised High */}
              <path d="M 255 220 Q 275 160 250 125" stroke="#7c3aed" strokeWidth="18" strokeLinecap="round" fill="none" />
              <circle cx="250" cy="125" r="12" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="2" />
            </g>
          ) : (isCoveringEyes || isPeeking) ? (
            /* Hands covering eyes when typing password (Image 1) or holding cheeks (Image 2) */
            <g className="purple-paws">
              {/* Left Arm & Paw */}
              <path
                d={isPeeking ? "M 130 230 Q 138 212 148 198" : "M 130 230 Q 142 200 166 182"}
                stroke="#7c3aed"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx={isPeeking ? 148 : 166}
                cy={isPeeking ? 198 : 182}
                r="12"
                fill="#8b5cf6"
                stroke="#6d28d9"
                strokeWidth="2"
              />

              {/* Right Arm & Paw */}
              <path
                d={isPeeking ? "M 255 230 Q 244 212 227 198" : "M 255 230 Q 242 200 208 182"}
                stroke="#7c3aed"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <circle
                cx={isPeeking ? 227 : 208}
                cy={isPeeking ? 198 : 182}
                r="12"
                fill="#8b5cf6"
                stroke="#6d28d9"
                strokeWidth="2"
              />
            </g>
          ) : null}
        </g>

        {/* ========================================================
            2. PINK CHARACTER (Slender, Curious Pillar)
            ======================================================== */}
        <g className={`char-pink ${isCoveringEyes ? "shy" : ""} ${isLoading ? "celebrating" : ""}`}>
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
            {isLoading ? (
              <>
                <path d="M 258 225 Q 264 218 270 225" stroke="#4c0519" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 282 225 Q 288 218 294 225" stroke="#4c0519" strokeWidth="3" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <ellipse cx="264" cy="225" rx="8.5" ry={isBlinking ? "1" : "8.5"} fill="#ffffff" />
                {!isBlinking && (
                  <>
                    <circle
                      cx={264 + (isCoveringEyes ? -3 : pupilOffset.x * 0.9)}
                      cy={225 + (isCoveringEyes ? 4 : pupilOffset.y * 0.9)}
                      r="4.2"
                      fill="#4c0519"
                      style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
                    />
                    <circle
                      cx={265.5 + (isCoveringEyes ? -3 : pupilOffset.x * 0.8)}
                      cy={223.5 + (isCoveringEyes ? 4 : pupilOffset.y * 0.8)}
                      r="1.5"
                      fill="#ffffff"
                    />
                  </>
                )}

                <ellipse cx="288" cy="225" rx="8.5" ry={isBlinking ? "1" : "8.5"} fill="#ffffff" />
                {!isBlinking && (
                  <>
                    <circle
                      cx={288 + (isCoveringEyes ? -3 : pupilOffset.x * 0.9)}
                      cy={225 + (isCoveringEyes ? 4 : pupilOffset.y * 0.9)}
                      r="4.2"
                      fill="#4c0519"
                      style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
                    />
                    <circle
                      cx={289.5 + (isCoveringEyes ? -3 : pupilOffset.x * 0.8)}
                      cy={223.5 + (isCoveringEyes ? 4 : pupilOffset.y * 0.8)}
                      r="1.5"
                      fill="#ffffff"
                    />
                  </>
                )}
              </>
            )}

            {/* Pink Mouth */}
            {isLoading ? (
              <path d="M 271 237 Q 276 245 281 237 Z" fill="#ffffff" />
            ) : isCoveringEyes ? (
              <path d="M 273 239 Q 276 236 279 239" stroke="#4c0519" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            ) : isTyping ? (
              <path className="pink-talking-mouth" d="M 272 237 Q 276 244 280 237 Z" fill="#4c0519" />
            ) : (
              <path d="M 273 238 Q 276 243 279 238" stroke="#4c0519" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )}
          </g>
        </g>

        {/* ========================================================
            3. YELLOW CHARACTER (Right Rounded Dome with dynamic motion & seesaw beak)
            ======================================================== */}
        <g
          className={`char-yellow ${isLoading ? "celebrating" : ""}`}
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
              rx="4.5"
              ry={isBlinking ? "0.5" : "4.5"}
              fill="#422006"
              style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
            />
            {!isBlinking && (
              <circle
                cx={329 + pupilOffset.x * 0.6}
                cy={269 + pupilOffset.y * 0.6}
                r="1.3"
                fill="#ffffff"
              />
            )}

            {/* Dynamic Seesaw Beak / Expression line that rotates with motion and chirps when typing */}
            <g
              style={{
                transformOrigin: "345px 275px",
                transform: `rotate(${yellowBeakAngle + (isTyping ? 5 : 0)}deg)`,
                transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)"
              }}
              className={isTyping ? "yellow-beak-chattering" : ""}
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
        <g className={`char-orange ${isLoading ? "celebrating" : ""}`}>
          {/* Body */}
          <path
            d="M 60 400 C 60 270, 180 270, 240 330 C 260 350, 260 400, 260 400 Z"
            fill="url(#orangeGrad)"
            filter="url(#softGlow)"
          />

          {/* Happy Eyes & Expressive Mouth */}
          <g className="orange-face">
            {isLoading ? (
              <>
                <path d="M 152 334 Q 160 326 168 334" stroke="#431407" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M 170 342 Q 184 362 198 342 Z" fill="#431407" />
              </>
            ) : !isCoveringEyes ? (
              <>
                <ellipse cx="160" cy="335" rx="7.5" ry={isBlinking ? "1" : "7.5"} fill="#ffffff" />
                {!isBlinking && (
                  <>
                    <circle
                      cx={160 + pupilOffset.x * 0.55}
                      cy={335 + pupilOffset.y * 0.55}
                      r="4.2"
                      fill="#431407"
                      style={{ transition: "cx 0.08s ease-out, cy 0.08s ease-out" }}
                    />
                    <circle
                      cx={161 + pupilOffset.x * 0.55}
                      cy={333 + pupilOffset.y * 0.55}
                      r="1.6"
                      fill="#ffffff"
                    />
                  </>
                )}
                {isTyping ? (
                  <>
                    <path className="orange-talking-mouth" d="M 172 343 Q 184 362 196 343 Z" fill="#431407" />
                    <path d="M 178 354 Q 184 362 190 354" fill="#fb7185" />
                  </>
                ) : (
                  <path
                    d="M 172 344 Q 184 358 196 344"
                    stroke="#431407"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </>
            ) : (
              <>
                <path
                  d="M 154 336 Q 160 330 166 336"
                  stroke="#431407"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 172 344 Q 184 358 196 344"
                  stroke="#431407"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedCharacters;
