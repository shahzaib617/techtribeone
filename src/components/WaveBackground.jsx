// src/components/WaveAnimation.jsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import './WaveBackground.css';
const WaveAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 2500;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Geometry Setup
    const SEPARATION = 70, AMOUNTX = 150, AMOUNTY = 100;
    let particles = AMOUNTX * AMOUNTY;
    let positions = new Float32Array(particles * 3);
    let scales = new Float32Array(particles);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
positions[i + 1] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // y (was 0)
positions[i + 2] = 0; // z (was iy * SEPARATION - (AMOUNTY * SEPARATION) / 2)
scales[j] = 1;
        i += 3;
        j++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
        attribute float scale;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          if (length(gl_PointCoord - vec2(0.9)) > 0.9) discard;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const particlesSystem = new THREE.Points(geometry, material);
    scene.add(particlesSystem);

    let count = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      const positions = particlesSystem.geometry.attributes.position.array;
      const scales = particlesSystem.geometry.attributes.scale.array;

      let i = 0, j = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          
          positions[i + 2] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;

          scales[j] =
            (Math.sin((ix + count) * 0.3) + 1) * 8 +
            (Math.sin((iy + count) * 0.5) + 1) * 8;

          i += 6;
          j++;
        }
      }

      particlesSystem.geometry.attributes.position.needsUpdate = true;
      particlesSystem.geometry.attributes.scale.needsUpdate = true;

      renderer.render(scene, camera);

      count += 0.1;
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on Unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="wave-background"/>;
};

export default WaveAnimation;
