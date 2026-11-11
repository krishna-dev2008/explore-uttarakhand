import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Mountain,
  Sun,
  Sunset,
  Moon,
  RotateCcw,
  Sparkles,
  Compass,
  Home,
  Layers,
} from 'lucide-react';

export type LightingPreset = 'dawn' | 'noon' | 'dusk';
export type ViewpointPreset = 'overview' | 'koti_homestay' | 'alpine_peaks';

interface WaypointNode {
  id: ViewpointPreset;
  label: string;
  elevation: string;
  region: string;
  description: string;
  aiPrompt: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
}

const WAYPOINT_NODES: WaypointNode[] = [
  {
    id: 'overview',
    label: 'Garhwal & Kumaon Sanctuary Corridor',
    elevation: '2,200m – 4,000m ASL',
    region: 'Full Topographic Diorama',
    description:
      'Interactive 3D terrain model illustrating how low-impact Koti Banal village homestays sit below the 3,000m bugyal treeline while snow peaks feed glacial springs.',
    aiPrompt: 'What are the eco-guidelines for Munsiyari and high-altitude bugyal meadows?',
    cameraPos: [14, 10, 16],
    targetPos: [0, 1.5, 0],
  },
  {
    id: 'koti_homestay',
    label: 'Koti Banal Seismic-Resilient Homestay',
    elevation: '2,250m ASL · Sarmoli / Sari Style',
    region: 'Vernacular Timber-Stone Architecture',
    description:
      '900-year-old Himalayan earthquake-resistant architecture alternating dry-packed stone courses with deodar cedar beams, passive solar roof panels, and a rainwater courtyard.',
    aiPrompt: 'Local customs for homestay etiquette and Koti Banal architecture in Uttarakhand',
    cameraPos: [6.5, 4.2, 8.5],
    targetPos: [1.8, 1.2, 2.2],
  },
  {
    id: 'alpine_peaks',
    label: 'Panchachuli & Tungnath High Ridge',
    elevation: '3,680m – 4,000m ASL',
    region: 'Glacial Bugyal Zone (No-Camping Core)',
    description:
      'Above 3,000m, fragile alpine pastures (Bugyals) are protected under UETDB-2026-01. Trekkers ascend for dawn summit views and descend to village homestays by dusk.',
    aiPrompt: 'Current weather in Chopta circuit and Khaliya Top permit rules?',
    cameraPos: [-10, 8.5, 12],
    targetPos: [-2.5, 3.8, -3.5],
  },
];

interface Himalayan3DSceneProps {
  onAskAI: (prompt: string) => void;
}

export const Himalayan3DScene: React.FC<Himalayan3DSceneProps> = ({ onAskAI }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lighting, setLighting] = useState<LightingPreset>('dawn');
  const [activeNodeId, setActiveNodeId] = useState<ViewpointPreset>('overview');

  // Refs to mutate Three.js scene cleanly from React controls
  const sceneTriggerRef = useRef<{
    setLightingMode?: (mode: LightingPreset) => void;
    flyToPreset?: (preset: ViewpointPreset) => void;
    resetView?: () => void;
  }>({});

  const activeNode = WAYPOINT_NODES.find(n => n.id === activeNodeId) || WAYPOINT_NODES[0];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Renderer & Software WebGL Detection
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Microsoft Basic Render/i.test(
      String(rendererStr)
    );

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Scene, Fog & IBL Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x132a23);
    scene.fog = new THREE.FogExp2(0x132a23, 0.022);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 3. Camera & OrbitControls
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 200);
    camera.position.set(14, 10, 16);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 32;
    controls.target.set(0, 1.5, 0);

    // 4. Lighting Setup (Key + Hemisphere + Warm Homestay Hearth PointLight)
    const hemiLight = new THREE.HemisphereLight(0xfde68a, 0x143328, 0.75);
    hemiLight.position.set(0, 25, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    sunLight.position.set(14, 18, 10);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.set(1024, 1024);
      sunLight.shadow.camera.near = 1;
      sunLight.shadow.camera.far = 45;
      const d = 14;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);

    const hearthLight = new THREE.PointLight(0xf59e0b, 1.8, 9, 1.8);
    hearthLight.position.set(1.8, 1.5, 2.8);
    scene.add(hearthLight);

    // 5. Composite Model 1: Terraced Himalayan Valley Base & River Gorge
    const terrainGroup = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1b3b2b,
      roughness: 0.88,
      metalness: 0.05,
    });
    const terraceMat = new THREE.MeshStandardMaterial({
      color: 0x274e37,
      roughness: 0.82,
      metalness: 0.05,
    });
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.18,
      metalness: 0.35,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
    });

    const plinthGeo = new THREE.CylinderGeometry(11.5, 12.2, 1.4, isSoftwareGl ? 24 : 48);
    const plinthMesh = new THREE.Mesh(plinthGeo, baseMat);
    plinthMesh.position.y = -0.7;
    plinthMesh.receiveShadow = true;
    terrainGroup.add(plinthMesh);

    // Agricultural step terraces
    for (let i = 0; i < 3; i++) {
      const tGeo = new THREE.BoxGeometry(9 - i * 1.4, 0.35, 7 - i * 1.1);
      const tMesh = new THREE.Mesh(tGeo, terraceMat);
      tMesh.position.set(1.2, i * 0.32, 1.5 - i * 0.4);
      tMesh.receiveShadow = true;
      tMesh.castShadow = true;
      terrainGroup.add(tMesh);
    }

    // Glacial stream ribbon
    const streamGeo = new THREE.BoxGeometry(1.6, 0.08, 16);
    const streamMesh = new THREE.Mesh(streamGeo, riverMat);
    streamMesh.position.set(-3.2, 0.05, 0.5);
    streamMesh.rotation.y = 0.22;
    terrainGroup.add(streamMesh);

    scene.add(terrainGroup);

    // 6. Composite Model 2: Faceted Panchachuli & Nanda Devi Snow Peaks (Multi-ridge)
    const peaksGroup = new THREE.Group();
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.75,
      metalness: 0.12,
      flatShading: true,
    });
    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.08,
      flatShading: true,
    });

    const peakSpecs: Array<{ x: number; z: number; r: number; h: number }> = [
      { x: -3.5, z: -4.2, r: 3.6, h: 7.4 }, // Nanda Devi Main Spire
      { x: 0.6, z: -4.8, r: 3.1, h: 6.2 }, // Panchachuli II
      { x: 4.2, z: -3.6, r: 2.7, h: 5.1 }, // Tungnath Ridge
      { x: -6.8, z: -2.5, r: 2.6, h: 4.8 }, // Western Bugyal Shoulder
    ];

    peakSpecs.forEach(p => {
      const singlePeak = new THREE.Group();
      const lowerGeo = new THREE.ConeGeometry(p.r, p.h, 7);
      const lowerMesh = new THREE.Mesh(lowerGeo, rockMat);
      lowerMesh.position.y = p.h / 2;
      lowerMesh.castShadow = true;
      lowerMesh.receiveShadow = true;
      singlePeak.add(lowerMesh);

      // Snow cap upper cone
      const capH = p.h * 0.46;
      const capR = p.r * 0.47;
      const capGeo = new THREE.ConeGeometry(capR, capH, 7);
      const capMesh = new THREE.Mesh(capGeo, snowMat);
      capMesh.position.y = p.h - capH / 2 + 0.04;
      capMesh.castShadow = true;
      singlePeak.add(capMesh);

      singlePeak.position.set(p.x, 0, p.z);
      singlePeak.rotation.y = (p.x + p.z) * 0.4;
      peaksGroup.add(singlePeak);
    });
    scene.add(peaksGroup);

    // 7. Composite Model 3: Authentic Koti Banal Stone & Deodar Timber Homestay (10 sub-parts)
    const kotiHomestay = new THREE.Group();
    const stoneWallMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.85,
      metalness: 0.05,
    });
    const deodarWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5c3a21,
      roughness: 0.65,
      metalness: 0.08,
    });
    const slateRoofMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.55,
      metalness: 0.2,
    });
    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.6,
      roughness: 0.2,
    });
    const solarPanelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.8,
    });

    // Plinth courtyard
    const courtyard = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.2, 2.8), stoneWallMat);
    courtyard.position.y = 0.1;
    courtyard.receiveShadow = true;
    kotiHomestay.add(courtyard);

    // Ground floor stone wall
    const groundFloor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 1.9), stoneWallMat);
    groundFloor.position.y = 0.65;
    groundFloor.castShadow = true;
    groundFloor.receiveShadow = true;
    kotiHomestay.add(groundFloor);

    // Seismic Deodar Timber Band 1
    const timberBand1 = new THREE.Mesh(new THREE.BoxGeometry(2.52, 0.16, 2.02), deodarWoodMat);
    timberBand1.position.y = 1.15;
    kotiHomestay.add(timberBand1);

    // Upper floor stone & wood
    const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.9), stoneWallMat);
    upperFloor.position.y = 1.65;
    upperFloor.castShadow = true;
    kotiHomestay.add(upperFloor);

    // cantilevered wooden veranda (Chajja)
    const veranda = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.14, 0.55), deodarWoodMat);
    veranda.position.set(0, 1.25, 1.1);
    veranda.castShadow = true;
    kotiHomestay.add(veranda);

    // Glowing Pahadi windows
    [-0.6, 0.6].forEach(wx => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.08), windowGlowMat);
      win.position.set(wx, 1.68, 0.94);
      kotiHomestay.add(win);
    });

    // Pitched Himalayan Pathal Slate Roof
    const roofGeo = new THREE.ConeGeometry(2.15, 1.1, 4);
    const roofMesh = new THREE.Mesh(roofGeo, slateRoofMat);
    roofMesh.position.y = 2.6;
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.scale.set(1.15, 1, 0.92);
    roofMesh.castShadow = true;
    kotiHomestay.add(roofMesh);

    // Solar Microgrid Panel on South Slope
    const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.65), solarPanelMat);
    solarPanel.position.set(0, 2.55, 0.55);
    solarPanel.rotation.x = 0.52;
    kotiHomestay.add(solarPanel);

    kotiHomestay.position.set(1.8, 0.8, 2.2);
    kotiHomestay.rotation.y = -0.35;
    scene.add(kotiHomestay);

    // 8. Composite Model 4: Deodar Cedar Forest Cluster
    const forestGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const pineNeedleMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.75,
      flatShading: true,
    });

    const treePositions: Array<[number, number, number, number]> = [
      [4.5, 0.3, 1.2, 1.1],
      [5.2, 0.2, -0.4, 0.95],
      [3.6, 0.5, 3.8, 0.85],
      [-1.4, 0.5, 3.2, 1.0],
      [-4.8, 0.1, 2.8, 1.15],
      [-5.6, 0.1, 0.6, 0.9],
      [6.2, 0.1, 2.5, 1.05],
      [-1.2, 0.6, -0.8, 0.9],
    ];

    treePositions.forEach(([tx, ty, tz, scale]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.8, 6), trunkMat);
      trunk.position.y = 0.4;
      tree.add(trunk);

      for (let tier = 0; tier < 3; tier++) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(0.68 - tier * 0.15, 0.95, 7),
          pineNeedleMat
        );
        cone.position.y = 0.85 + tier * 0.52;
        cone.castShadow = true;
        tree.add(cone);
      }
      tree.position.set(tx, ty, tz);
      tree.scale.setScalar(scale);
      forestGroup.add(tree);
    });
    scene.add(forestGroup);

    // 9. Interactive Glowing Waypoint Beacons
    const beaconsGroup = new THREE.Group();
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    const beaconCoords: Array<[number, number, number]> = [
      [1.8, 3.6, 2.2], // Koti Homestay Beacon
      [-3.5, 7.8, -4.2], // Alpine Peak Beacon
      [0, 2.2, 0], // Valley Center
    ];

    beaconCoords.forEach(([bx, by, bz]) => {
      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), beaconMat);
      orb.position.set(bx, by, bz);
      beaconsGroup.add(orb);
    });
    scene.add(beaconsGroup);

    // Camera Flight Interpolation State
    const desiredCamPos = new THREE.Vector3(14, 10, 16);
    const desiredTarget = new THREE.Vector3(0, 1.5, 0);

    const renderScene = () => {
      controls.update();
      renderer.render(scene, camera);
    };

    let flyFramesRemaining = 0;
    let rafId = 0;

    const stepFly = () => {
      if (flyFramesRemaining <= 0) return;
      flyFramesRemaining--;
      camera.position.lerp(desiredCamPos, 0.16);
      controls.target.lerp(desiredTarget, 0.16);
      renderScene();
      if (
        flyFramesRemaining > 0 &&
        (camera.position.distanceTo(desiredCamPos) > 0.05 ||
          controls.target.distanceTo(desiredTarget) > 0.05)
      ) {
        rafId = requestAnimationFrame(stepFly);
      }
    };

    const startCameraFlight = () => {
      cancelAnimationFrame(rafId);
      flyFramesRemaining = 36;
      stepFly();
    };

    sceneTriggerRef.current.setLightingMode = (mode: LightingPreset) => {
      if (mode === 'dawn') {
        scene.background = new THREE.Color(0x132a23);
        scene.fog = new THREE.FogExp2(0x132a23, 0.022);
        sunLight.color.setHex(0xffedd5);
        sunLight.intensity = 2.2;
        sunLight.position.set(14, 18, 10);
        hemiLight.intensity = 0.75;
        hearthLight.intensity = 1.8;
      } else if (mode === 'noon') {
        scene.background = new THREE.Color(0x1e3a4c);
        scene.fog = new THREE.FogExp2(0x1e3a4c, 0.016);
        sunLight.color.setHex(0xffffff);
        sunLight.intensity = 2.8;
        sunLight.position.set(4, 26, 8);
        hemiLight.intensity = 1.05;
        hearthLight.intensity = 0.6;
      } else {
        scene.background = new THREE.Color(0x09131c);
        scene.fog = new THREE.FogExp2(0x09131c, 0.028);
        sunLight.color.setHex(0x818cf8);
        sunLight.intensity = 0.75;
        sunLight.position.set(-12, 14, -8);
        hemiLight.intensity = 0.35;
        hearthLight.intensity = 3.2;
      }
      renderScene();
    };

    sceneTriggerRef.current.flyToPreset = (presetId: ViewpointPreset) => {
      const found = WAYPOINT_NODES.find(n => n.id === presetId) || WAYPOINT_NODES[0];
      desiredCamPos.set(...found.cameraPos);
      desiredTarget.set(...found.targetPos);
      startCameraFlight();
    };

    sceneTriggerRef.current.resetView = () => {
      desiredCamPos.set(14, 10, 16);
      desiredTarget.set(0, 1.5, 0);
      startCameraFlight();
    };

    // Deterministic test & inspection hooks
    (window as unknown as Record<string, unknown>).render_game_to_text = () =>
      JSON.stringify({
        scene: 'Himalayan3DSanctuary',
        camera: camera.position.toArray().map(n => Number(n.toFixed(2))),
        target: controls.target.toArray().map(n => Number(n.toFixed(2))),
      });

    controls.addEventListener('change', () => {
      renderer.render(scene, camera);
    });

    // Initial render
    renderScene();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderScene();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      controls.dispose();
      envMap.dispose();
      renderer.dispose();
    };
  }, []);

  const handleSelectLighting = (mode: LightingPreset) => {
    setLighting(mode);
    sceneTriggerRef.current.setLightingMode?.(mode);
  };

  const handleSelectNode = (nodeId: ViewpointPreset) => {
    setActiveNodeId(nodeId);
    sceneTriggerRef.current.flyToPreset?.(nodeId);
  };

  return (
    <section
      id="himalayan-3d"
      aria-labelledby="himalayan-3d-heading"
      className="py-14 sm:py-20 bg-[#0F241C] text-stone-100 border-b border-emerald-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-medium text-amber-300 tracking-wide mb-1.5 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Interactive 3D Spatial Twin · Three.js WebGL Sanctuary</span>
            </div>
            <h2
              id="himalayan-3d-heading"
              className="font-serif-display text-3xl sm:text-4xl font-semibold text-white"
            >
              3D Himalayan Topography & Koti Banal Architecture
            </h2>
          </div>

          {/* Lighting Atmosphere Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-emerald-950/90 p-1.5 rounded-xl border border-emerald-800/70 self-start">
            <button
              type="button"
              onClick={() => handleSelectLighting('dawn')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                lighting === 'dawn'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
              <span>Alpenglow Dawn</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectLighting('noon')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                lighting === 'noon'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Alpine Noon</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectLighting('dusk')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                lighting === 'dusk'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Starlit Hearth</span>
            </button>
          </div>
        </div>

        {/* 3D Viewport + Side Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive 3D WebGL Canvas */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-emerald-800/70 bg-[#132a23] min-h-[380px] sm:min-h-[460px] flex flex-col">
            <div
              ref={containerRef}
              className="w-full h-full flex-1 min-h-[380px] sm:min-h-[460px] cursor-grab active:cursor-grabbing"
              aria-label="Interactive 3D Himalayan Koti Banal Homestay and Alpine Peak Scene"
            />

            {/* Floating Camera Control Dock inside 3D Viewport */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="bg-slate-950/75 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2 text-xs text-stone-200 pointer-events-auto">
                Drag to orbit 360° · Scroll to zoom · Select node on right to fly camera
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveNodeId('overview');
                  sceneTriggerRef.current.resetView?.();
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/15 text-xs font-semibold text-white flex items-center gap-1.5 pointer-events-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                <span>Reset 3D Camera</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Spatial Waypoint Selector & Architectural Telemetry */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-emerald-950/60 border border-emerald-800/70 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Select 3D Elevation Zone
              </div>

              <div className="space-y-2">
                {WAYPOINT_NODES.map(node => {
                  const isSelected = node.id === activeNodeId;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => handleSelectNode(node.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-900/90 border-amber-400/80 shadow-sm'
                          : 'bg-emerald-950/50 border-emerald-800/60 hover:bg-emerald-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-amber-300 font-mono-tabular mb-0.5">
                        <span>{node.elevation}</span>
                        {node.id === 'koti_homestay' ? (
                          <Home className="w-3.5 h-3.5" />
                        ) : node.id === 'alpine_peaks' ? (
                          <Mountain className="w-3.5 h-3.5" />
                        ) : (
                          <Compass className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="font-serif-display text-base font-semibold text-white">
                        {node.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Node Detail Box */}
            <div className="p-4 rounded-xl bg-slate-950/55 border border-emerald-800/60 space-y-3">
              <div className="text-xs text-emerald-300 font-medium">{activeNode.region}</div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {activeNode.description}
              </p>
              <button
                type="button"
                onClick={() => onAskAI(activeNode.aiPrompt)}
                className="w-full min-h-[44px] px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Yatri About This Zone</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
