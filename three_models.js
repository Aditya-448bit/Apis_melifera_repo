// Ultra-Realism PBR & Instanced 3D Anatomical Builders for Apis mellifera Atlas (Three.js r128)

window.BeeModelBuilders = (function () {
  // Helper to tag every mesh in a group with structure metadata and explosion vector
  function tagMeshGroup(group, structureId, layerId, systemKey, explodeVec) {
    group.userData.structureId = structureId;
    group.userData.layerId = layerId || 1;
    group.userData.systemKey = systemKey || 'external';
    group.userData.basePos = group.position.clone();
    group.userData.explodeVec = explodeVec
      ? new THREE.Vector3(explodeVec[0], explodeVec[1], explodeVec[2])
      : new THREE.Vector3(0, 0, 0);

    group.traverse(function (child) {
      if ((child.isMesh || child.isInstancedMesh)) {
        child.userData.structureId = structureId;
        child.userData.layerId = layerId || 1;
        child.userData.systemKey = systemKey || 'external';
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material && !child.userData.origColor) {
          child.material = child.material.clone();
          child.userData.origColor = child.material.color ? child.material.color.clone() : new THREE.Color(0xffffff);
          child.userData.origOpacity = child.material.opacity !== undefined ? child.material.opacity : 1.0;
          child.userData.origTransparent = Boolean(child.material.transparent);
          child.userData.origEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
        }
      }
    });
  }

  // ============================================================================
  // PROCEDURAL STUDIO HDRI ENVIRONMENT & PBR CHITIN MAPS (ALBEDO, NORMAL, ROUGHNESS, HEIGHT, AO)
  // ============================================================================
  function buildStudioHDRITexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    var ctx = canvas.getContext('2d');

    var skyGrad = ctx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0.0, '#1E293B');
    skyGrad.addColorStop(0.35, '#0F172A');
    skyGrad.addColorStop(0.5, '#1C1613');
    skyGrad.addColorStop(0.75, '#090D16');
    skyGrad.addColorStop(1.0, '#05070B');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Key studio softbox highlight
    var keyBox = ctx.createRadialGradient(280, 130, 10, 280, 130, 180);
    keyBox.addColorStop(0.0, 'rgba(255, 251, 235, 0.95)');
    keyBox.addColorStop(0.4, 'rgba(253, 230, 138, 0.45)');
    keyBox.addColorStop(1.0, 'rgba(253, 230, 138, 0.0)');
    ctx.fillStyle = keyBox;
    ctx.fillRect(0, 0, 1024, 512);

    // Warm golden rim strip
    var rimBox = ctx.createRadialGradient(780, 170, 10, 780, 170, 210);
    rimBox.addColorStop(0.0, 'rgba(245, 158, 11, 0.85)');
    rimBox.addColorStop(0.5, 'rgba(217, 119, 6, 0.30)');
    rimBox.addColorStop(1.0, 'rgba(217, 119, 6, 0.0)');
    ctx.fillStyle = rimBox;
    ctx.fillRect(0, 0, 1024, 512);

    // Cool scientific fill bounce
    var fillBox = ctx.createRadialGradient(512, 390, 15, 512, 390, 220);
    fillBox.addColorStop(0.0, 'rgba(56, 189, 248, 0.45)');
    fillBox.addColorStop(1.0, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = fillBox;
    ctx.fillRect(0, 0, 1024, 512);

    var tex = new THREE.CanvasTexture(canvas);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }

  function createChitinPBRMaps() {
    // 1. High-Res Micro-Scratch, Pore & Cuticular Hexagonal Sculpture Normal/Height/Roughness Map
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 1024, 1024);

    // Cuticular setal socket pits (punctures)
    for (var i = 0; i < 2400; i++) {
      var px = Math.random() * 1024;
      var py = Math.random() * 1024;
      var pr = 1.2 + Math.random() * 2.8;
      ctx.fillStyle = 'rgba(30, 30, 30, 0.45)';
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(210, 210, 210, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Microscopic chitin wear scratches
    for (var s = 0; s < 900; s++) {
      var sx = Math.random() * 1024;
      var sy = Math.random() * 1024;
      var ang = Math.random() * Math.PI * 2;
      var len = 8 + Math.random() * 36;
      ctx.strokeStyle = s % 2 === 0 ? 'rgba(235, 235, 235, 0.22)' : 'rgba(40, 40, 40, 0.28)';
      ctx.lineWidth = 0.7 + Math.random() * 1.1;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
      ctx.stroke();
    }

    var bumpTex = new THREE.CanvasTexture(canvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(3, 3);
    return bumpTex;
  }

  // Create procedural striped abdomen Albedo + AO texture
  function createBeeStripeTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    var ctx = canvas.getContext('2d');

    // Authentic Apis mellifera tergal melanin & amber-ochre banding with inter-segmental AO shadows
    var grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0.00, '#0F0905');
    grad.addColorStop(0.06, '#B45309');
    grad.addColorStop(0.15, '#D97706');
    grad.addColorStop(0.21, '#F59E0B');
    grad.addColorStop(0.25, '#120B07');
    grad.addColorStop(0.32, '#1A100A');
    grad.addColorStop(0.36, '#D97706');
    grad.addColorStop(0.45, '#F59E0B');
    grad.addColorStop(0.50, '#120B07');
    grad.addColorStop(0.58, '#190F0A');
    grad.addColorStop(0.62, '#D97706');
    grad.addColorStop(0.71, '#B45309');
    grad.addColorStop(0.76, '#110A06');
    grad.addColorStop(0.83, '#C2610C');
    grad.addColorStop(0.89, '#0E0805');
    grad.addColorStop(1.00, '#080503');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Organic pigment mottling and fine micro-setae follicles
    for (var i = 0; i < 1600; i++) {
      var x = Math.random() * 1024;
      var y = Math.random() * 1024;
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(254, 243, 199, 0.16)' : 'rgba(20, 12, 6, 0.22)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 8, y + 16);
      ctx.stroke();
    }

    var tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  // Create true hexagonal ommatidia Albedo + Bump texture (Thousands of visible ommatidia)
  function createOmmatidiaTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#180E09';
    ctx.fillRect(0, 0, 1024, 1024);

    var r = 7;
    var dx = r * 1.732;
    var dy = r * 1.5;
    var row = 0;
    for (var y = 0; y < 1024 + r; y += dy) {
      var offsetX = (row % 2 === 1) ? dx * 0.5 : 0;
      for (var x = -r; x < 1024 + r; x += dx) {
        var cx = x + offsetX;
        var cy = y;
        var cellGrad = ctx.createRadialGradient(cx - 1.5, cy - 1.5, 0.5, cx, cy, r * 0.95);
        cellGrad.addColorStop(0.0, '#6B442A');
        cellGrad.addColorStop(0.55, '#2E1B10');
        cellGrad.addColorStop(1.0, '#0B0604');
        ctx.fillStyle = cellGrad;

        ctx.beginPath();
        for (var k = 0; k < 6; k++) {
          var ang = (Math.PI / 3) * k + Math.PI / 6;
          var vx = cx + r * 0.92 * Math.cos(ang);
          var vy = cy + r * 0.92 * Math.sin(ang);
          if (k === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(10, 6, 4, 0.9)';
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
      row++;
    }

    var tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  // Create procedural wing venation + Thin-Film Iridescence/Diffraction texture
  function createWingVenationTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    var ctx = canvas.getContext('2d');

    // Thin-film interference iridescence gradient (cyan-violet-gold-emerald optical diffraction)
    var irid = ctx.createLinearGradient(0, 0, 1024, 512);
    irid.addColorStop(0.00, 'rgba(224, 242, 254, 0.24)');
    irid.addColorStop(0.25, 'rgba(192, 132, 252, 0.22)');
    irid.addColorStop(0.50, 'rgba(56, 189, 248, 0.26)');
    irid.addColorStop(0.75, 'rgba(253, 224, 71, 0.20)');
    irid.addColorStop(1.00, 'rgba(110, 231, 183, 0.24)');
    ctx.fillStyle = irid;
    ctx.fillRect(0, 0, 1024, 512);

    // Tubular chitinous veins (Costa, Subcosta, Radius, Pterostigma, Marginal, 3 Submarginal, Discoidal cells)
    ctx.strokeStyle = 'rgba(78, 35, 11, 0.95)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(20, 80);
    ctx.quadraticCurveTo(520, 36, 980, 130);
    ctx.stroke();

    // Pterostigma dark patch
    ctx.fillStyle = 'rgba(92, 40, 12, 0.85)';
    ctx.beginPath();
    ctx.ellipse(540, 66, 48, 12, 0.05, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 5;
    var veins = [
      [[20, 110], [440, 130], [920, 220]],
      [[40, 190], [400, 240], [780, 350]],
      [[280, 116], [330, 230], [280, 390]],
      [[480, 124], [510, 260], [440, 420]],
      [[660, 150], [680, 290], [610, 430]],
      [[330, 230], [510, 260], [680, 290]],
      [[510, 260], [620, 340], [780, 350]]
    ];
    veins.forEach(function (v) {
      ctx.beginPath();
      ctx.moveTo(v[0][0], v[0][1]);
      ctx.quadraticCurveTo(v[1][0], v[1][1], v[2][0], v[2][1]);
      ctx.stroke();
    });
    return new THREE.CanvasTexture(canvas);
  }

  // ============================================================================
  // SETAE (BODY HAIR) 3D INSTANCED PARTICLE SYSTEM (Individual Strands, Curl & Translucency)
  // ============================================================================
  function createCurvedHairStrandGeometry() {
    // 5-segment tapered curved 3D hair strand (80 triangles per strand)
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.012, 0.06, 0.005),
      new THREE.Vector3(0.032, 0.13, 0.015),
      new THREE.Vector3(0.065, 0.20, 0.025)
    ]);
    return new THREE.TubeGeometry(curve, 5, 0.0085, 5, false);
  }

  function populateSurfaceHairs(count, samplerFn, material, clippingPlanes) {
    var geo = createCurvedHairStrandGeometry();
    var mat = material.clone();
    mat.clippingPlanes = clippingPlanes;
    var inst = new THREE.InstancedMesh(geo, mat, count);
    var dummy = new THREE.Object3D();
    var up = new THREE.Vector3(0, 1, 0);

    for (var i = 0; i < count; i++) {
      var sample = samplerFn(i, count);
      dummy.position.copy(sample.pos);
      dummy.quaternion.setFromUnitVectors(up, sample.normal.normalize());
      // Add natural organic curl & random twist
      dummy.rotateY(Math.random() * Math.PI * 2);
      dummy.rotateZ((Math.random() - 0.5) * 0.45);
      var s = sample.scale || (0.65 + Math.random() * 0.75);
      dummy.scale.set(s, s * (0.8 + Math.random() * 0.5), s);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    return inst;
  }

  // ============================================================================
  // INDIVIDUAL 3D POLLEN GRAINS (Spherical, Spiky Echinate, Oval Tricolpate)
  // ============================================================================
  function createSpikyPollenGeometry() {
    var base = new THREE.IcosahedronGeometry(0.022, 1);
    var pos = base.attributes.position;
    var v = new THREE.Vector3();
    for (var i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      var spike = (i % 2 === 0) ? 1.38 : 0.92;
      v.multiplyScalar(spike);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    base.computeVertexNormals();
    return base;
  }

  function buildIndividualPollenSystem(clippingPlanes) {
    var pollenGroup = new THREE.Group();
    var matGoldenPollen = new THREE.MeshStandardMaterial({
      color: 0xFBBF24, emissive: 0xB45309, emissiveIntensity: 0.32,
      roughness: 0.45, metalness: 0.05, clippingPlanes: clippingPlanes
    });
    var matOrangePollen = new THREE.MeshStandardMaterial({
      color: 0xF59E0B, emissive: 0x92400E, emissiveIntensity: 0.28,
      roughness: 0.52, metalness: 0.05, clippingPlanes: clippingPlanes
    });

    // 1. Spherical grains
    var geoSphere = new THREE.IcosahedronGeometry(0.019, 1);
    // 2. Spiky echinate grains
    var geoSpiky = createSpikyPollenGeometry();
    // 3. Oval prolate grains
    var geoOval = new THREE.SphereGeometry(0.018, 10, 8);
    geoOval.scale(1.45, 0.85, 0.85);

    var instSphere = new THREE.InstancedMesh(geoSphere, matGoldenPollen, 420);
    var instSpiky = new THREE.InstancedMesh(geoSpiky, matOrangePollen, 420);
    var instOval = new THREE.InstancedMesh(geoOval, matGoldenPollen, 360);

    var dummy = new THREE.Object3D();

    function placePollenGrain(inst, idx) {
      var zone = idx % 3;
      var side = (idx % 2 === 0) ? 1 : -1;
      if (zone === 0) {
        // Attached to metathoracic Pollen Basket (Corbicula)
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        var r = 0.14 + Math.random() * 0.06;
        dummy.position.set(
          -1.19 + r * Math.sin(phi) * Math.cos(theta) * 1.1,
          -1.17 + r * Math.cos(phi) * 1.35,
          side * 1.07 + r * Math.sin(phi) * Math.sin(theta) * 0.65
        );
      } else if (zone === 1) {
        // Attached to inner basitarsal Pollen Combs & Fore/Mid Leg Pollen Brushes
        dummy.position.set(
          -1.38 + (Math.random() - 0.5) * 0.18,
          -1.46 - Math.random() * 0.30,
          side * (0.84 + (Math.random() - 0.5) * 0.10)
        );
      } else {
        // Attached to Thoracic & Facial Plumose Setae Hairs
        var ang = Math.random() * Math.PI * 2;
        dummy.position.set(
          0.35 + (Math.random() - 0.5) * 1.45,
          0.18 + Math.sin(ang) * 0.92,
          Math.cos(ang) * 0.88
        );
      }
      dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      var sc = 0.75 + Math.random() * 0.65;
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      inst.setMatrixAt(idx, dummy.matrix);
    }

    for (var i = 0; i < 420; i++) {
      placePollenGrain(instSphere, i);
      placePollenGrain(instSpiky, i);
      if (i < 360) placePollenGrain(instOval, i);
    }
    instSphere.instanceMatrix.needsUpdate = true;
    instSpiky.instanceMatrix.needsUpdate = true;
    instOval.instanceMatrix.needsUpdate = true;

    pollenGroup.add(instSphere);
    pollenGroup.add(instSpiky);
    pollenGroup.add(instOval);
    return pollenGroup;
  }

  // ============================================================================
  // 1. FULL BEE & INTERNAL ANATOMY BUILDER (Modules 1 & 2)
  // ============================================================================
  function buildFullBeeModel(clippingPlanes) {
    var root = new THREE.Group();
    var animRefs = {
      headGroup: new THREE.Group(),
      thoraxGroup: new THREE.Group(),
      abdomenGroup: new THREE.Group(),
      wings: { foreL: null, foreR: null, hindL: null, hindR: null },
      antennae: { L: null, R: null },
      eyePupils: [],
      legs: { proL: null, proR: null, mesoL: null, mesoR: null, metaL: null, metaR: null },
      pollenPellets: [],
      pollenParticlesGroup: null,
      setaeInstancedGroups: [],
      proboscisGroup: null,
      stingGroup: null,
      honeySacMesh: null,
      heartChambers: [],
      airSacs: [],
      reproCasteGroups: { worker: null, queen: null, drone: null },
      flowParticles: []
    };

    var stripeTex = createBeeStripeTexture();
    var eyeTex = createOmmatidiaTexture();
    var wingTex = createWingVenationTexture();
    var chitinBumpTex = createChitinPBRMaps();

    // Photorealistic PBR Chitin Exoskeleton Materials (Clearcoat, Micro-Scratches, Biological Roughness, SSS Sheen)
    var matCuticleDark = new THREE.MeshPhysicalMaterial({
      color: 0x1A110B,
      roughness: 0.34,
      metalness: 0.14,
      bumpMap: chitinBumpTex,
      bumpScale: 0.018,
      roughnessMap: chitinBumpTex,
      clearcoat: 0.78,
      clearcoatRoughness: 0.22,
      reflectivity: 0.85,
      clippingPlanes: clippingPlanes
    });
    var matCuticleAmber = new THREE.MeshPhysicalMaterial({
      color: 0xC2610C,
      emissive: 0x451A03,
      emissiveIntensity: 0.12,
      roughness: 0.38,
      metalness: 0.10,
      bumpMap: chitinBumpTex,
      bumpScale: 0.015,
      clearcoat: 0.65,
      clearcoatRoughness: 0.25,
      clippingPlanes: clippingPlanes
    });
    var matSetaeGold = new THREE.MeshPhysicalMaterial({
      color: 0xF59E0B,
      emissive: 0x78350F,
      emissiveIntensity: 0.18,
      roughness: 0.52,
      metalness: 0.06,
      clearcoat: 0.35,
      clippingPlanes: clippingPlanes
    });
    var matAbdomenStriped = new THREE.MeshPhysicalMaterial({
      map: stripeTex,
      bumpMap: chitinBumpTex,
      bumpScale: 0.022,
      roughnessMap: chitinBumpTex,
      roughness: 0.32,
      metalness: 0.15,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
      clippingPlanes: clippingPlanes
    });
    var matEye = new THREE.MeshPhysicalMaterial({
      color: 0x28150D,
      map: eyeTex,
      bumpMap: eyeTex,
      bumpScale: 0.028,
      roughness: 0.12,
      metalness: 0.28,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      clippingPlanes: clippingPlanes
    });
    var matWing = new THREE.MeshPhysicalMaterial({
      map: wingTex,
      bumpMap: wingTex,
      bumpScale: 0.012,
      color: 0xF0F9FF,
      transparent: true,
      opacity: 0.58,
      roughness: 0.08,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      side: THREE.DoubleSide,
      clippingPlanes: clippingPlanes
    });

    // ---------------- HEAD CAPSULE & CEPHALIC STRUCTURES ----------------
    var headGroup = animRefs.headGroup;
    headGroup.position.set(1.85, 0.15, 0);
    root.add(headGroup);

    // High-density Head Cranium (clypeus + frons)
    var clypeusGroup = new THREE.Group();
    var headGeo = new THREE.SphereGeometry(0.68, 64, 48);
    headGeo.scale(0.82, 1.05, 0.92);
    var headMesh = new THREE.Mesh(headGeo, matCuticleDark);
    clypeusGroup.add(headMesh);

    var clypGeo = new THREE.SphereGeometry(0.36, 48, 36);
    clypGeo.scale(0.65, 0.95, 0.85);
    var clypMesh = new THREE.Mesh(clypGeo, matCuticleAmber);
    clypMesh.position.set(0.38, -0.05, 0);
    clypeusGroup.add(clypMesh);
    tagMeshGroup(clypeusGroup, 'clypeus', 2, 'exoskeleton', [1.1, 0.1, 0]);
    headGroup.add(clypeusGroup);

    // Facial 3D Setae (Body Hair Particle System on Vertex, Frons & Genae)
    var facialHairs = populateSurfaceHairs(950, function () {
      var u = Math.random() * Math.PI * 2;
      var v = Math.acos(2 * Math.random() - 1);
      var nx = Math.sin(v) * Math.cos(u);
      var ny = Math.cos(v);
      var nz = Math.sin(v) * Math.sin(u);
      // Avoid compound eye lateral zones
      if (Math.abs(nz) > 0.65 && ny > -0.2 && ny < 0.5) nz *= 0.35;
      var pos = new THREE.Vector3(nx * 0.54, ny * 0.68, nz * 0.58);
      return { pos: pos, normal: pos.clone(), scale: 0.55 + Math.random() * 0.45 };
    }, matSetaeGold, clippingPlanes);
    var facialHairGrp = new THREE.Group();
    facialHairGrp.add(facialHairs);
    tagMeshGroup(facialHairGrp, 'clypeus', 1, 'external', [1.1, 0.1, 0]);
    headGroup.add(facialHairGrp);
    animRefs.setaeInstancedGroups.push(facialHairs);

    // Labrum
    var labrumGroup = new THREE.Group();
    var labrumMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 0.44, 8, 8, 8), matCuticleAmber);
    labrumMesh.position.set(0.45, -0.38, 0);
    labrumGroup.add(labrumMesh);
    tagMeshGroup(labrumGroup, 'labrum', 2, 'exoskeleton', [1.2, -0.25, 0]);
    headGroup.add(labrumGroup);

    // Ocelli (3 simple eyes on vertex with corneal lens transmission)
    var ocelliGroup = new THREE.Group();
    var ocellusMat = new THREE.MeshPhysicalMaterial({
      color: 0xFBBF24, emissive: 0x92400E, emissiveIntensity: 0.4,
      roughness: 0.05, metalness: 0.1, clearcoat: 1.0, clippingPlanes: clippingPlanes
    });
    [[0.12, 0.68, 0], [0.02, 0.72, 0.16], [0.02, 0.72, -0.16]].forEach(function (p) {
      var oc = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 24), ocellusMat);
      oc.position.set(p[0], p[1], p[2]);
      ocelliGroup.add(oc);
    });
    tagMeshGroup(ocelliGroup, 'ocelli', 1, 'nervous', [0.8, 0.9, 0]);
    headGroup.add(ocelliGroup);

    // Compound Eyes (Thousands of Visible Hexagonal Ommatidia + Micro-Corneal Lenses + Eye Tracking)
    var eyesGroup = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var eyeGeo = new THREE.SphereGeometry(0.42, 64, 48);
      eyeGeo.scale(0.68, 1.25, 0.72);
      var eyeMesh = new THREE.Mesh(eyeGeo, matEye);
      eyeMesh.position.set(0.05, 0.18, side * 0.52);
      eyeMesh.rotation.x = side * 0.18;
      eyesGroup.add(eyeMesh);

      // Instanced 3D Hexagonal Micro-Ommatidia Lens Array across outer corneal surface
      var ommatidGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.008, 6);
      var ommatidInst = new THREE.InstancedMesh(ommatidGeo, matEye, 480);
      var oDummy = new THREE.Object3D();
      var oUp = new THREE.Vector3(0, 1, 0);
      for (var oi = 0; oi < 480; oi++) {
        var phi = (oi / 480) * Math.PI * 0.85 + 0.2;
        var theta = ((oi * 137.5) % 360) * (Math.PI / 180);
        var ox = 0.05 + Math.sin(phi) * Math.cos(theta) * 0.28;
        var oy = 0.18 + Math.cos(phi) * 0.51;
        var oz = side * (0.52 + Math.abs(Math.sin(phi) * Math.sin(theta)) * 0.30);
        oDummy.position.set(ox, oy, oz);
        var norm = new THREE.Vector3(ox - 0.05, oy - 0.18, oz - side * 0.52).normalize();
        oDummy.quaternion.setFromUnitVectors(oUp, norm);
        oDummy.updateMatrix();
        ommatidInst.setMatrixAt(oi, oDummy.matrix);
      }
      ommatidInst.instanceMatrix.needsUpdate = true;
      eyesGroup.add(ommatidInst);

      // Pseudopupil gaze tracker dot
      var pupilMat = new THREE.MeshBasicMaterial({ color: 0xFDE68A });
      var pupil = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 16), pupilMat);
      pupil.position.set(0.28, 0.22, side * 0.74);
      eyesGroup.add(pupil);
      animRefs.eyePupils.push({ mesh: pupil, basePos: pupil.position.clone(), side: side });
    });
    tagMeshGroup(eyesGroup, 'compound_eye', 1, 'external', [0.7, 0.3, 0.9]);
    headGroup.add(eyesGroup);

    // Geniculate Antennae (Scape, Pedicel, 10-segmented Flagellum)
    var antWrapper = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var antPivot = new THREE.Group();
      antPivot.position.set(0.48, 0.12, side * 0.22);

      var scapeGeo = new THREE.CylinderGeometry(0.042, 0.05, 0.52, 20);
      scapeGeo.translate(0, 0.26, 0);
      var scape = new THREE.Mesh(scapeGeo, matCuticleDark);
      scape.rotation.z = -0.65;
      scape.rotation.x = side * 0.35;
      antPivot.add(scape);

      var flagGroup = new THREE.Group();
      flagGroup.position.set(0.32, 0.36, side * 0.16);
      for (var seg = 0; seg < 10; seg++) {
        var segMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.036, 0.038, 0.09, 18),
          seg % 2 === 0 ? matCuticleDark : matCuticleAmber
        );
        segMesh.position.set(seg * 0.068, -seg * 0.035, side * seg * 0.025);
        segMesh.rotation.z = -1.1;
        flagGroup.add(segMesh);
      }
      antPivot.add(flagGroup);
      antWrapper.add(antPivot);
      if (side === 1) animRefs.antennae.L = antPivot;
      else animRefs.antennae.R = antPivot;
    });
    tagMeshGroup(antWrapper, 'antenna', 1, 'nervous', [1.3, 0.4, 0.6]);
    headGroup.add(antWrapper);

    // Mouthparts (Mandibles + Extendable Proboscis on Whole Bee)
    var mouthGroup = new THREE.Group();
    mouthGroup.position.set(0.32, -0.52, 0);
    [-1, 1].forEach(function (side) {
      var mand = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.38, 20), matCuticleDark);
      mand.position.set(0.12, -0.08, side * 0.18);
      mand.rotation.z = 0.35;
      mand.rotation.x = -side * 0.28;
      mouthGroup.add(mand);

      var galea = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.65, 18), matCuticleAmber);
      galea.position.set(0.05, -0.35, side * 0.08);
      galea.rotation.z = 0.25;
      mouthGroup.add(galea);
    });
    var glossa = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.02, 0.85, 20),
      new THREE.MeshStandardMaterial({ color: 0xF43F5E, roughness: 0.35, clippingPlanes: clippingPlanes })
    );
    glossa.position.set(0.08, -0.48, 0);
    glossa.rotation.z = 0.22;
    mouthGroup.add(glossa);
    animRefs.proboscisGroup = mouthGroup;
    tagMeshGroup(mouthGroup, 'mouthparts', 1, 'external', [1.3, -0.9, 0]);
    headGroup.add(mouthGroup);

    // ---------------- THORAX & 3D PLUMOSE SETAE HAIR PARTICLE SYSTEM ----------------
    var thoraxGroup = animRefs.thoraxGroup;
    thoraxGroup.position.set(0.35, 0.18, 0);
    root.add(thoraxGroup);

    // Exoskeleton Thoracic Box (Layer 2 — Prothorax, Mesoscutum, Scutellum, Metanotum, Propodeum)
    var thoraxExo = new THREE.Group();
    var thGeo = new THREE.SphereGeometry(0.98, 72, 56);
    thGeo.scale(1.18, 0.96, 0.92);
    var thMesh = new THREE.Mesh(thGeo, matCuticleDark);
    thoraxExo.add(thMesh);
    tagMeshGroup(thoraxExo, 'clypeus', 2, 'exoskeleton', [0, 0.6, 0]);
    thoraxGroup.add(thoraxExo);

    // 3D Thoracic Setae (Body Hair Particle System — 2,600 Individual Curved Strands!)
    var setaeGroup = new THREE.Group();
    var thoraxHairs = populateSurfaceHairs(2600, function () {
      var u = Math.random() * Math.PI * 2;
      var v = Math.acos(2 * Math.random() - 1);
      var nx = Math.sin(v) * Math.cos(u);
      var ny = Math.cos(v);
      var nz = Math.sin(v) * Math.sin(u);
      var pos = new THREE.Vector3(nx * 1.14, ny * 0.94, nz * 0.90);
      return { pos: pos, normal: new THREE.Vector3(nx, ny + 0.25, nz), scale: 0.85 + Math.random() * 0.65 };
    }, matSetaeGold, clippingPlanes);
    setaeGroup.add(thoraxHairs);
    animRefs.setaeInstancedGroups.push(thoraxHairs);
    tagMeshGroup(setaeGroup, 'wings_hooked', 1, 'external', [0, 0.8, 0]);
    thoraxGroup.add(setaeGroup);

    // Forewings & Hindwings Hooked Together with 20 Microscopic Hamuli (Layer 1)
    var wingsGroup = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var fwPivot = new THREE.Group();
      fwPivot.position.set(0.05, 0.78, side * 0.62);

      var fwShape = new THREE.Shape();
      fwShape.moveTo(0, 0);
      fwShape.quadraticCurveTo(-1.2, 0.55, -2.85, 0.42);
      fwShape.quadraticCurveTo(-3.1, 0.15, -2.55, -0.35);
      fwShape.quadraticCurveTo(-1.1, -0.42, 0, 0);

      var fwGeo = new THREE.ShapeGeometry(fwShape, 24);
      fwGeo.rotateX(Math.PI / 2);
      var fwMesh = new THREE.Mesh(fwGeo, matWing);
      fwMesh.rotation.y = side * 0.25;
      fwMesh.rotation.x = side * 0.15;
      fwPivot.add(fwMesh);

      var hwPivot = new THREE.Group();
      hwPivot.position.set(-0.28, 0.74, side * 0.58);

      var hwShape = new THREE.Shape();
      hwShape.moveTo(0, 0);
      hwShape.quadraticCurveTo(-0.85, 0.35, -1.95, 0.25);
      hwShape.quadraticCurveTo(-2.1, 0.02, -1.65, -0.32);
      hwShape.quadraticCurveTo(-0.75, -0.30, 0, 0);

      var hwGeo = new THREE.ShapeGeometry(hwShape, 20);
      hwGeo.rotateX(Math.PI / 2);
      var hwMesh = new THREE.Mesh(hwGeo, matWing);
      hwMesh.rotation.y = side * 0.34;
      hwMesh.rotation.x = side * 0.12;
      hwPivot.add(hwMesh);

      // 20 Microscopic Curved Chitinous Hamuli Hooks along Costal Margin
      for (var h = 0; h < 20; h++) {
        var hook = new THREE.Mesh(
          new THREE.TorusGeometry(0.028, 0.007, 8, 12, Math.PI * 1.35),
          matSetaeGold
        );
        hook.position.set(-0.45 - h * 0.062, 0.025, side * (0.18 + h * 0.016));
        hwPivot.add(hook);
      }

      wingsGroup.add(fwPivot);
      wingsGroup.add(hwPivot);
      if (side === 1) {
        animRefs.wings.foreL = fwPivot;
        animRefs.wings.hindL = hwPivot;
      } else {
        animRefs.wings.foreR = fwPivot;
        animRefs.wings.hindR = hwPivot;
      }
    });
    tagMeshGroup(wingsGroup, 'wings_hooked', 1, 'external', [-0.3, 1.4, 1.6]);
    thoraxGroup.add(wingsGroup);

    // ---------------- THREE PAIRS OF SPECIALIZED LEGS + 3D SCOPA BRUSH HAIRS ----------------
    // 1. Prothoracic Legs (with Eye Brush, Velum/Fibula, Antenna Comb, Pollen Brush)
    [-1, 1].forEach(function (side) {
      var proLeg = new THREE.Group();
      proLeg.position.set(1.15, -0.45, side * 0.55);

      var femur = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.55, 20), matCuticleDark);
      femur.position.set(0.15, -0.22, side * 0.18);
      femur.rotation.z = 0.45;
      femur.rotation.x = side * 0.35;
      proLeg.add(femur);

      var eyeBrushGroup = new THREE.Group();
      var tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.52, 20), matCuticleAmber);
      tibia.position.set(0.22, -0.62, side * 0.32);
      tibia.rotation.z = 0.15;
      eyeBrushGroup.add(tibia);
      tagMeshGroup(eyeBrushGroup, 'eye_brush', 1, 'external', [0.9, -0.8, side * 1.1]);
      proLeg.add(eyeBrushGroup);

      var velumGroup = new THREE.Group();
      var velum = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 14), matSetaeGold);
      velum.position.set(0.26, -0.86, side * 0.35);
      velum.rotation.z = -0.6;
      velumGroup.add(velum);
      tagMeshGroup(velumGroup, 'velum_or_fibula', 1, 'external', [0.95, -1.05, side * 1.15]);
      proLeg.add(velumGroup);

      var cleanerGroup = new THREE.Group();
      var notch = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 10, 20, Math.PI), matSetaeGold);
      notch.position.set(0.28, -0.92, side * 0.36);
      cleanerGroup.add(notch);
      tagMeshGroup(cleanerGroup, 'antenna_cleaner_in_use', 1, 'external', [1.0, -0.9, side * 1.2]);
      proLeg.add(cleanerGroup);

      var combGroup = new THREE.Group();
      var comb = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.25, 16), matCuticleAmber);
      comb.position.set(0.24, -1.02, side * 0.38);
      combGroup.add(comb);
      tagMeshGroup(combGroup, 'antenna_comb', 1, 'external', [0.9, -1.3, side * 1.25]);
      proLeg.add(combGroup);

      var pb1Group = new THREE.Group();
      var pb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.035, 0.32, 16), matSetaeGold);
      pb1.position.set(0.20, -1.25, side * 0.42);
      pb1Group.add(pb1);
      tagMeshGroup(pb1Group, 'pollen_brush_1', 1, 'external', [0.9, -1.5, side * 1.3]);
      proLeg.add(pb1Group);

      root.add(proLeg);
      if (side === 1) animRefs.legs.proL = proLeg;
      else animRefs.legs.proR = proLeg;
    });

    // 2. Mesothoracic Legs (with Spur and Pollen Brush II)
    [-1, 1].forEach(function (side) {
      var mesoLeg = new THREE.Group();
      mesoLeg.position.set(0.32, -0.52, side * 0.68);

      var femur = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.62, 20), matCuticleDark);
      femur.position.set(-0.05, -0.26, side * 0.22);
      femur.rotation.x = side * 0.42;
      mesoLeg.add(femur);

      var tibia = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.58, 20), matCuticleAmber);
      tibia.position.set(-0.10, -0.68, side * 0.38);
      mesoLeg.add(tibia);

      var spurGroup = new THREE.Group();
      var spurMesh = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.24, 14), matSetaeGold);
      spurMesh.position.set(-0.08, -0.94, side * 0.42);
      spurMesh.rotation.z = 0.5;
      spurGroup.add(spurMesh);
      tagMeshGroup(spurGroup, 'spur', 1, 'external', [0.2, -1.2, side * 1.4]);
      mesoLeg.add(spurGroup);

      var pb2Group = new THREE.Group();
      var pb2Mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.45, 16), matSetaeGold);
      pb2Mesh.position.set(-0.14, -1.16, side * 0.45);
      pb2Group.add(pb2Mesh);
      tagMeshGroup(pb2Group, 'pollen_brush_2', 1, 'external', [0.2, -1.5, side * 1.45]);
      mesoLeg.add(pb2Group);

      root.add(mesoLeg);
      if (side === 1) animRefs.legs.mesoL = mesoLeg;
      else animRefs.legs.mesoR = mesoLeg;
    });

    // 3. Metathoracic Legs (All 10 Exact Hindleg Reference Structures + 3D Corbicular Fringe Setae)
    [-1, 1].forEach(function (side) {
      var metaLeg = new THREE.Group();
      metaLeg.position.set(-0.45, -0.42, side * 0.55);

      var coxaGroup = new THREE.Group();
      var coxaMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), matCuticleDark);
      coxaGroup.add(coxaMesh);
      tagMeshGroup(coxaGroup, 'coxa', 2, 'exoskeleton', [-0.3, -0.5, side * 0.8]);
      metaLeg.add(coxaGroup);

      var trochGroup = new THREE.Group();
      var trochMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 18), matCuticleAmber);
      trochMesh.position.set(-0.16, -0.18, side * 0.12);
      trochMesh.rotation.z = -0.55;
      trochGroup.add(trochMesh);
      tagMeshGroup(trochGroup, 'trochanter', 2, 'exoskeleton', [-0.45, -0.7, side * 0.95]);
      metaLeg.add(trochGroup);

      var femurGroup = new THREE.Group();
      var femurMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.65, 22), matCuticleDark);
      femurMesh.position.set(-0.42, -0.40, side * 0.28);
      femurMesh.rotation.z = -0.55;
      femurMesh.rotation.x = side * 0.28;
      femurGroup.add(femurMesh);
      tagMeshGroup(femurGroup, 'femur', 2, 'exoskeleton', [-0.7, -0.9, side * 1.15]);
      metaLeg.add(femurGroup);

      var tibiaGroup = new THREE.Group();
      var tibiaGeo = new THREE.ConeGeometry(0.20, 0.72, 28);
      tibiaGeo.scale(0.85, 1.0, 0.55);
      var tibiaMesh = new THREE.Mesh(tibiaGeo, matCuticleDark);
      tibiaMesh.position.set(-0.72, -0.72, side * 0.42);
      tibiaMesh.rotation.z = 0.35;
      tibiaGroup.add(tibiaMesh);
      tagMeshGroup(tibiaGroup, 'tibia', 2, 'exoskeleton', [-1.0, -1.2, side * 1.35]);
      metaLeg.add(tibiaGroup);

      // Pollen Basket (Corbicula) + 3D Retaining Fringe Hairs + Golden Pollen Load
      var basketGroup = new THREE.Group();
      var pelletGeo = new THREE.SphereGeometry(0.16, 28, 24);
      pelletGeo.scale(1.1, 1.35, 0.65);
      var pelletMat = new THREE.MeshStandardMaterial({
        color: 0xFBBF24, emissive: 0xD97706, emissiveIntensity: 0.28, roughness: 0.55, clippingPlanes: clippingPlanes
      });
      var pelletMesh = new THREE.Mesh(pelletGeo, pelletMat);
      pelletMesh.position.set(-0.74, -0.75, side * 0.52);
      basketGroup.add(pelletMesh);

      // Curved Corbicular Fringe Setae Hairs
      var corbHairs = populateSurfaceHairs(220, function (idx, total) {
        var ang = (idx / total) * Math.PI * 2;
        var pos = new THREE.Vector3(
          -0.74 + Math.cos(ang) * 0.16,
          -0.75 + Math.sin(ang) * 0.22,
          side * 0.50
        );
        return { pos: pos, normal: new THREE.Vector3(0, 0, side), scale: 0.5 };
      }, matSetaeGold, clippingPlanes);
      basketGroup.add(corbHairs);
      animRefs.setaeInstancedGroups.push(corbHairs);

      animRefs.pollenPellets.push(pelletMesh);
      tagMeshGroup(basketGroup, 'pollen_basket', 1, 'external', [-1.1, -1.25, side * 1.5]);
      metaLeg.add(basketGroup);

      // Pecten & Auricle (Pollen Packer / Press)
      var packerGroup = new THREE.Group();
      var packerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.16), matSetaeGold);
      packerMesh.position.set(-0.85, -0.98, side * 0.45);
      packerGroup.add(packerMesh);
      tagMeshGroup(packerGroup, 'pecten_and_auricle', 1, 'external', [-1.2, -1.45, side * 1.45]);
      metaLeg.add(packerGroup);

      // Metatarsus (Basitarsus)
      var metaTarsusGroup = new THREE.Group();
      var mtMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.11), matCuticleAmber);
      mtMesh.position.set(-0.95, -1.16, side * 0.46);
      mtMesh.rotation.z = -0.25;
      metaTarsusGroup.add(mtMesh);
      tagMeshGroup(metaTarsusGroup, 'metatarsus', 2, 'exoskeleton', [-1.35, -1.65, side * 1.5]);
      metaLeg.add(metaTarsusGroup);

      // Pollen Combs (Inner View) — 9 transverse bristle rows on inner basitarsus
      var combsGroup = new THREE.Group();
      for (var r = 0; r < 9; r++) {
        var rowBar = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.016, 0.045), matSetaeGold);
        rowBar.position.set(-0.93, -1.00 - r * 0.036, side * 0.38);
        combsGroup.add(rowBar);
      }
      tagMeshGroup(combsGroup, 'pollen_combs_inner', 1, 'external', [-1.35, -1.7, side * 1.2]);
      metaLeg.add(combsGroup);

      // Tarsus (Tarsomeres II–IV)
      var tarsusGroup = new THREE.Group();
      var tarsMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.28, 16), matCuticleDark);
      tarsMesh.position.set(-1.06, -1.42, side * 0.48);
      tarsMesh.rotation.z = -0.32;
      tarsusGroup.add(tarsMesh);
      tagMeshGroup(tarsusGroup, 'tarsus', 2, 'exoskeleton', [-1.5, -1.9, side * 1.55]);
      metaLeg.add(tarsusGroup);

      // Microscopic Pulvillus (Arolium) & Bifid Claws (Ungues)
      var clawGroup = new THREE.Group();
      var arolium = new THREE.Mesh(new THREE.SphereGeometry(0.058, 18, 18), matSetaeGold);
      arolium.scale.set(1.2, 0.7, 1.1);
      arolium.position.set(-1.15, -1.56, side * 0.50);
      clawGroup.add(arolium);
      [-1, 1].forEach(function (cSide) {
        var outerClaw = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.16, 12), matCuticleDark);
        outerClaw.position.set(-1.19, -1.60, side * 0.50 + cSide * 0.045);
        outerClaw.rotation.z = -0.82;
        clawGroup.add(outerClaw);
        var innerTooth = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.10, 10), matCuticleAmber);
        innerTooth.position.set(-1.17, -1.58, side * 0.50 + cSide * 0.032);
        innerTooth.rotation.z = -0.65;
        clawGroup.add(innerTooth);
      });
      tagMeshGroup(clawGroup, 'pulvillus_and_claws', 1, 'external', [-1.65, -2.1, side * 1.6]);
      metaLeg.add(clawGroup);

      root.add(metaLeg);
      if (side === 1) animRefs.legs.metaL = metaLeg;
      else animRefs.legs.metaR = metaLeg;
    });

    // Individual 3D Pollen Grains attached to Body Hairs, Pollen Basket & Combs
    var pollenParticles = buildIndividualPollenSystem(clippingPlanes);
    tagMeshGroup(pollenParticles, 'pollen_basket', 1, 'external', [-0.5, -0.5, 0.5]);
    root.add(pollenParticles);
    animRefs.pollenParticlesGroup = pollenParticles;

    // ---------------- ABDOMEN (GASTER), 3D ABDOMINAL HAIRS & EXTERNAL STRUCTURES ----------------
    var abdomenGroup = animRefs.abdomenGroup;
    abdomenGroup.position.set(-2.05, 0.02, 0);
    root.add(abdomenGroup);

    // Narrow Petiole
    var petiole = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 0.42, 24), matCuticleDark);
    petiole.rotation.z = Math.PI / 2;
    petiole.position.set(1.15, 0.06, 0);
    abdomenGroup.add(petiole);

    // High-Density Segmented Exoskeletal Gaster Shell (Layer 2)
    var abdShellGroup = new THREE.Group();
    var abdGeo = new THREE.SphereGeometry(1.12, 84, 64);
    abdGeo.rotateZ(Math.PI / 2);
    abdGeo.scale(1.38, 0.88, 0.94);
    var abdMesh = new THREE.Mesh(abdGeo, matAbdomenStriped);
    abdShellGroup.add(abdMesh);
    tagMeshGroup(abdShellGroup, 'wax_plates', 2, 'exoskeleton', [-1.5, 0.6, 0]);
    abdomenGroup.add(abdShellGroup);

    // 3D Abdominal Setae Bands (1,800 Individual Curved Golden Hairs along Tergites)
    var abdHairGroup = new THREE.Group();
    var abdHairs = populateSurfaceHairs(1800, function () {
      var u = Math.random() * Math.PI * 2;
      var v = Math.acos(2 * Math.random() - 1);
      var nx = Math.sin(v) * Math.cos(u);
      var ny = Math.cos(v);
      var nz = Math.sin(v) * Math.sin(u);
      var pos = new THREE.Vector3(nx * 1.52, ny * 0.96, nz * 1.03);
      return { pos: pos, normal: new THREE.Vector3(nx - 0.35, ny, nz), scale: 0.62 + Math.random() * 0.45 };
    }, matSetaeGold, clippingPlanes);
    abdHairGroup.add(abdHairs);
    animRefs.setaeInstancedGroups.push(abdHairs);
    tagMeshGroup(abdHairGroup, 'spiracles', 1, 'external', [-1.5, 0.6, 0]);
    abdomenGroup.add(abdHairGroup);

    // Spiracles (10 Bilateral Pairs of Respiratory Stigmata — Layer 4)
    var spiraclesGroup = new THREE.Group();
    var spiracleMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8, emissive: 0x0284C7, emissiveIntensity: 0.55, roughness: 0.2, clippingPlanes: clippingPlanes
    });
    [-0.75, -0.35, 0.05, 0.45, 0.82].forEach(function (xOff) {
      [-1, 1].forEach(function (side) {
        var zPos = side * (0.98 - Math.abs(xOff) * 0.25);
        var sp = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.02, 12, 20), spiracleMat);
        sp.position.set(xOff, 0.05, zPos);
        sp.rotation.y = Math.PI / 2;
        spiraclesGroup.add(sp);
      });
    });
    tagMeshGroup(spiraclesGroup, 'spiracles', 4, 'tracheal', [-1.8, 0.1, 1.35]);
    abdomenGroup.add(spiraclesGroup);

    // Ventral Wax Plates / Scales on Sternites IV–VII (Layer 8)
    var waxGroup = new THREE.Group();
    var waxMat = new THREE.MeshPhysicalMaterial({
      color: 0xFEF3C7, emissive: 0xF59E0B, emissiveIntensity: 0.18,
      transparent: true, opacity: 0.86, roughness: 0.12, clearcoat: 0.9, clippingPlanes: clippingPlanes
    });
    [-0.55, -0.22, 0.12, 0.45].forEach(function (xOff) {
      [-1, 1].forEach(function (side) {
        var plate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.32), waxMat);
        plate.position.set(xOff, -0.68, side * 0.26);
        plate.rotation.x = side * 0.25;
        waxGroup.add(plate);
      });
    });
    tagMeshGroup(waxGroup, 'wax_plates', 8, 'reproductive', [-2.0, -0.95, 0.5]);
    tagMeshGroup(waxGroup, 'wax_gland', 8, 'reproductive', [-2.0, -0.95, 0.5]);
    abdomenGroup.add(waxGroup);

    // Apical Sting (Aculeus — Layer 8)
    var stingExtGroup = new THREE.Group();
    var stingCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.07, 0.68, 20),
      new THREE.MeshStandardMaterial({ color: 0xEF4444, emissive: 0x991B1B, emissiveIntensity: 0.4, roughness: 0.22, clippingPlanes: clippingPlanes })
    );
    stingCone.rotation.z = Math.PI / 2;
    stingCone.position.set(-1.58, -0.10, 0);
    stingExtGroup.add(stingCone);
    animRefs.stingGroup = stingExtGroup;
    tagMeshGroup(stingExtGroup, 'sting_ext', 8, 'reproductive', [-2.6, -0.2, 0]);
    abdomenGroup.add(stingExtGroup);

    // ============================================================================
    // INTERNAL VISCERAL ORGAN SYSTEMS (Layers 3, 4, 5, 6, 7, 8 — Module 2)
    // ============================================================================
    var internalRoot = new THREE.Group();
    root.add(internalRoot);

    // 1. Flight Musculature (Layer 3 — Indirect Dorsoventral & Longitudinal)
    var musclesGroup = new THREE.Group();
    var muscleMat = new THREE.MeshPhysicalMaterial({
      color: 0xEF4444, emissive: 0x7F1D1D, emissiveIntensity: 0.28, roughness: 0.38, clearcoat: 0.4, clippingPlanes: clippingPlanes
    });
    for (var m = 0; m < 4; m++) {
      var dlBundle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.35, 20), muscleMat);
      dlBundle.rotation.z = Math.PI / 2;
      dlBundle.position.set(0.35, 0.32 + (m % 2) * 0.22, (m < 2 ? 1 : -1) * 0.22);
      musclesGroup.add(dlBundle);
    }
    [-1, 1].forEach(function (side) {
      [-0.15, 0.25, 0.62].forEach(function (xOff) {
        var dvCol = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.05, 18), muscleMat);
        dvCol.position.set(xOff, 0.18, side * 0.45);
        musclesGroup.add(dvCol);
      });
    });
    tagMeshGroup(musclesGroup, 'muscles', 3, 'muscular', [0.2, 0.85, 0.65]);
    internalRoot.add(musclesGroup);

    // 2. Tracheal System, Air Sacs, Tracheae & Tracheoles (Layer 4)
    var airSacGroup = new THREE.Group();
    var airSacMat = new THREE.MeshPhysicalMaterial({
      color: 0x38BDF8, emissive: 0x0284C7, emissiveIntensity: 0.28,
      transparent: true, opacity: 0.66, roughness: 0.15, clearcoat: 0.8, clippingPlanes: clippingPlanes
    });
    [-1, 1].forEach(function (side) {
      var abdSac = new THREE.Mesh(new THREE.SphereGeometry(0.38, 28, 24), airSacMat);
      abdSac.scale.set(1.65, 0.72, 0.68);
      abdSac.position.set(-1.55, 0.22, side * 0.48);
      airSacGroup.add(abdSac);
      animRefs.airSacs.push(abdSac);

      var thSac = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 20), airSacMat);
      thSac.scale.set(1.4, 0.7, 0.6);
      thSac.position.set(0.45, 0.12, side * 0.52);
      airSacGroup.add(thSac);
      animRefs.airSacs.push(thSac);
    });
    tagMeshGroup(airSacGroup, 'air_sac', 4, 'tracheal', [-1.2, 0.65, 0.85]);
    internalRoot.add(airSacGroup);

    // Branching Tracheae & Microscopic Tracheoles Network
    var tracheolesGroup = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 4.1, 14), airSacMat);
      trunk.rotation.z = Math.PI / 2;
      trunk.position.set(-0.6, 0.20, side * 0.46);
      tracheolesGroup.add(trunk);
      for (var tb = 0; tb < 10; tb++) {
        var branch = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.004, 0.58, 8), airSacMat);
        branch.position.set(-2.2 + tb * 0.35, 0.22 + (tb % 2) * 0.12, side * 0.42);
        branch.rotation.set(side * 0.5, tb * 0.3, 0.4);
        tracheolesGroup.add(branch);
      }
    });
    tagMeshGroup(tracheolesGroup, 'tracheae_tracheoles', 4, 'tracheal', [-0.5, 0.55, 0.85]);
    internalRoot.add(tracheolesGroup);

    // 3. Digestive & Excretory Tract (Layer 5 — Pharynx, Oesophagus, Crop/Honey Sac, Proventriculus, Midgut, Hindgut, Rectum)
    var digestMat = new THREE.MeshPhysicalMaterial({
      color: 0x10B981, emissive: 0x065F46, emissiveIntensity: 0.28, roughness: 0.32, clearcoat: 0.6, clippingPlanes: clippingPlanes
    });
    var honeyMat = new THREE.MeshPhysicalMaterial({
      color: 0xFBBF24, emissive: 0xD97706, emissiveIntensity: 0.35,
      transparent: true, opacity: 0.80, roughness: 0.12, clearcoat: 0.9, clippingPlanes: clippingPlanes
    });

    var pharynxGroup = new THREE.Group();
    var pharMesh = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), digestMat);
    pharMesh.scale.set(1.4, 0.85, 0.85);
    pharMesh.position.set(1.92, 0.05, 0);
    pharynxGroup.add(pharMesh);
    tagMeshGroup(pharynxGroup, 'pharynx', 5, 'digestive', [1.2, 0.0, 0]);
    internalRoot.add(pharynxGroup);

    var oesGroup = new THREE.Group();
    var oesMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 2.75, 18), digestMat);
    oesMesh.rotation.z = Math.PI / 2;
    oesMesh.position.set(0.45, 0.05, 0);
    oesGroup.add(oesMesh);
    tagMeshGroup(oesGroup, 'oesophagus', 5, 'digestive', [0.3, 0.1, 0]);
    internalRoot.add(oesGroup);

    var honeySacGroup = new THREE.Group();
    var hsMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 28), honeyMat);
    hsMesh.scale.set(1.35, 0.92, 0.92);
    hsMesh.position.set(-1.32, 0.08, 0);
    honeySacGroup.add(hsMesh);
    animRefs.honeySacMesh = hsMesh;
    tagMeshGroup(honeySacGroup, 'honey_sac', 5, 'digestive', [-1.1, 0.15, 0]);
    internalRoot.add(honeySacGroup);

    var stopperGroup = new THREE.Group();
    var stopMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 20), matSetaeGold);
    stopMesh.rotation.z = Math.PI / 2;
    stopMesh.position.set(-1.74, 0.04, 0);
    stopperGroup.add(stopMesh);
    tagMeshGroup(stopperGroup, 'honey_stopper', 5, 'digestive', [-1.5, 0.08, 0]);
    internalRoot.add(stopperGroup);

    var stomachGroup = new THREE.Group();
    for (var sRing = 0; sRing < 8; sRing++) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.075, 16, 28), digestMat);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(-1.90 - sRing * 0.10, -0.04 - Math.sin(sRing * 0.5) * 0.08, 0);
      stomachGroup.add(ring);
    }
    tagMeshGroup(stomachGroup, 'stomach', 5, 'digestive', [-2.1, -0.1, 0]);
    internalRoot.add(stomachGroup);

    var malpGroup = new THREE.Group();
    var malpMat = new THREE.MeshStandardMaterial({
      color: 0x84CC16, emissive: 0x3F6212, emissiveIntensity: 0.3, roughness: 0.4, clippingPlanes: clippingPlanes
    });
    for (var mt = 0; mt < 18; mt++) {
      var ang = (mt / 18) * Math.PI * 2;
      var tub = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.018, 10, 22, Math.PI * 1.2), malpMat);
      tub.position.set(-2.58, -0.08 + Math.sin(ang) * 0.14, Math.cos(ang) * 0.18);
      tub.rotation.set(ang, mt * 0.4, 0.5);
      malpGroup.add(tub);
    }
    tagMeshGroup(malpGroup, 'malpighian_tubules', 5, 'digestive', [-2.5, -0.25, 0.55]);
    internalRoot.add(malpGroup);

    var intestGroup = new THREE.Group();
    var intestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.48, 18), digestMat);
    intestMesh.rotation.z = Math.PI / 2;
    intestMesh.position.set(-2.78, -0.12, 0);
    intestGroup.add(intestMesh);
    tagMeshGroup(intestGroup, 'intestine', 5, 'digestive', [-2.7, -0.35, 0]);
    internalRoot.add(intestGroup);

    var rectumGroup = new THREE.Group();
    var rectMesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 24), digestMat);
    rectMesh.scale.set(1.35, 0.85, 0.85);
    rectMesh.position.set(-3.16, 0.04, 0);
    rectumGroup.add(rectMesh);
    tagMeshGroup(rectumGroup, 'rectum', 5, 'digestive', [-3.2, 0.08, 0]);
    internalRoot.add(rectumGroup);

    var rectalGlandGroup = new THREE.Group();
    for (var rg = 0; rg < 6; rg++) {
      var rgAng = (rg / 6) * Math.PI * 2;
      var pad = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.045, 0.045), matSetaeGold);
      pad.position.set(-3.08, 0.04 + Math.sin(rgAng) * 0.21, Math.cos(rgAng) * 0.21);
      rectalGlandGroup.add(pad);
    }
    tagMeshGroup(rectalGlandGroup, 'rectal_gland', 5, 'digestive', [-3.0, 0.25, 0.35]);
    internalRoot.add(rectalGlandGroup);

    // 4. Nervous System (Layer 6 — Brain, Thoracic Ganglia, Ventral Nerve Cord)
    var neuralMat = new THREE.MeshPhysicalMaterial({
      color: 0xA855F7, emissive: 0x6B21A8, emissiveIntensity: 0.52, roughness: 0.22, clearcoat: 0.7, clippingPlanes: clippingPlanes
    });

    var brainGroup = new THREE.Group();
    var brainCore = new THREE.Mesh(new THREE.SphereGeometry(0.22, 28, 24), neuralMat);
    brainCore.scale.set(0.85, 1.1, 1.65);
    brainCore.position.set(1.92, 0.34, 0);
    brainGroup.add(brainCore);
    tagMeshGroup(brainGroup, 'brain', 6, 'nervous', [1.1, 0.6, 0]);
    internalRoot.add(brainGroup);

    var thGangliaGroup = new THREE.Group();
    [[0.75, -0.36, 0, 0.14], [0.15, -0.38, 0, 0.20]].forEach(function (g) {
      var gm = new THREE.Mesh(new THREE.SphereGeometry(g[3], 20, 20), neuralMat);
      gm.scale.set(1.3, 0.8, 0.9);
      gm.position.set(g[0], g[1], g[2]);
      thGangliaGroup.add(gm);
    });
    tagMeshGroup(thGangliaGroup, 'thoracic_ganglia', 6, 'nervous', [0.2, -0.75, 0]);
    internalRoot.add(thGangliaGroup);

    var vncGroup = new THREE.Group();
    var cordMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 4.6, 16), neuralMat);
    cordMesh.rotation.z = Math.PI / 2;
    cordMesh.position.set(-0.65, -0.42, 0);
    vncGroup.add(cordMesh);
    [-1.2, -1.65, -2.1, -2.55, -2.95].forEach(function (gx) {
      var ag = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), neuralMat);
      ag.position.set(gx, -0.42, 0);
      vncGroup.add(ag);
    });
    tagMeshGroup(vncGroup, 'ventral_nerve_cord', 6, 'nervous', [-1.7, -0.8, 0]);
    internalRoot.add(vncGroup);

    // 5. Circulatory System (Layer 7 — Dorsal Heart, Ostia, Anterior Blood Vessel, Haemocoel)
    var circMat = new THREE.MeshPhysicalMaterial({
      color: 0xF43F5E, emissive: 0x9F1239, emissiveIntensity: 0.45, roughness: 0.24, clearcoat: 0.7, clippingPlanes: clippingPlanes
    });

    var heartGroup = new THREE.Group();
    [-1.45, -1.82, -2.18, -2.54, -2.88].forEach(function (hx) {
      var ch = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 18), circMat);
      ch.scale.set(1.75, 0.85, 0.85);
      ch.position.set(hx, 0.62, 0);
      heartGroup.add(ch);
      animRefs.heartChambers.push(ch);
    });
    tagMeshGroup(heartGroup, 'heart', 7, 'circulatory', [-2.1, 1.0, 0]);
    internalRoot.add(heartGroup);

    var ostiaGroup = new THREE.Group();
    [-1.55, -1.92, -2.28, -2.64].forEach(function (ox) {
      var ost = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.022, 10, 20), matSetaeGold);
      ost.rotation.y = Math.PI / 2;
      ost.position.set(ox, 0.62, 0);
      ostiaGroup.add(ost);
    });
    tagMeshGroup(ostiaGroup, 'ostia', 7, 'circulatory', [-1.8, 1.05, 0]);
    internalRoot.add(ostiaGroup);

    var aortaGroup = new THREE.Group();
    var aortaMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.055, 3.1, 18), circMat);
    aortaMesh.rotation.z = Math.PI / 2;
    aortaMesh.position.set(0.28, 0.36, 0);
    aortaGroup.add(aortaMesh);
    tagMeshGroup(aortaGroup, 'anterior_blood_vessel', 7, 'circulatory', [0.4, 0.55, 0]);
    internalRoot.add(aortaGroup);

    var haemocoelGroup = new THREE.Group();
    var sinusMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.52, 2.2, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0xFDA4AF, transparent: true, opacity: 0.25, roughness: 0.2, clippingPlanes: clippingPlanes
      })
    );
    sinusMesh.rotation.z = Math.PI / 2;
    sinusMesh.position.set(-2.15, -0.18, 0);
    haemocoelGroup.add(sinusMesh);
    tagMeshGroup(haemocoelGroup, 'haemocoel', 7, 'circulatory', [-2.0, -0.35, 0.75]);
    internalRoot.add(haemocoelGroup);

    // 6. Glandular & Caste-Specific Reproductive Systems (Layer 8)
    var glandMat = new THREE.MeshPhysicalMaterial({
      color: 0xEC4899, emissive: 0x831843, emissiveIntensity: 0.32, roughness: 0.3, clearcoat: 0.6, clippingPlanes: clippingPlanes
    });

    var pharGlandGroup = new THREE.Group();
    [-1, 1].forEach(function (side) {
      for (var ac = 0; ac < 5; ac++) {
        var acinus = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), glandMat);
        acinus.position.set(1.78 + (ac % 2) * 0.08, 0.48 + ac * 0.05, side * 0.24);
        pharGlandGroup.add(acinus);
      }
    });
    tagMeshGroup(pharGlandGroup, 'pharyngeal_gland', 8, 'reproductive', [1.0, 0.85, 0.4]);
    internalRoot.add(pharGlandGroup);

    var salivGroup = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var sLobe = new THREE.Mesh(new THREE.SphereGeometry(0.12, 18, 18), glandMat);
      sLobe.scale.set(1.5, 0.8, 0.8);
      sLobe.position.set(1.12, -0.22, side * 0.22);
      salivGroup.add(sLobe);
    });
    tagMeshGroup(salivGroup, 'salivary_gland', 8, 'reproductive', [0.5, -0.45, 0.45]);
    internalRoot.add(salivGroup);

    // Caste-Specific Reproductive Organs Wrapper (Worker vestigial ovarioles / Queen hypertrophied ovaries / Drone testes & endophallus)
    var reproWrapper = new THREE.Group();
    var workerRepro = new THREE.Group();
    var queenRepro = new THREE.Group();
    var droneRepro = new THREE.Group();

    // Worker: slender vestigial ovarioles
    [-1, 1].forEach(function (side) {
      var wOv = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.75, 12), glandMat);
      wOv.rotation.z = Math.PI / 2;
      wOv.position.set(-2.35, 0.28, side * 0.22);
      workerRepro.add(wOv);
    });
    // Queen: massive paired ovaries (150-180 ovarioles) + spherical spermatheca
    [-1, 1].forEach(function (side) {
      for (var q = 0; q < 5; q++) {
        var qLobe = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 18), glandMat);
        qLobe.scale.set(2.2, 0.75, 0.65);
        qLobe.position.set(-2.15 - q * 0.12, 0.22 + q * 0.05, side * (0.24 + q * 0.03));
        queenRepro.add(qLobe);
      }
    });
    var spermatheca = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 18), matSetaeGold);
    spermatheca.position.set(-2.95, 0.18, 0);
    queenRepro.add(spermatheca);
    queenRepro.visible = false;

    // Drone: paired testes + mucus glands + eversible endophallus
    [-1, 1].forEach(function (side) {
      var testis = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), glandMat);
      testis.scale.set(1.6, 0.9, 0.9);
      testis.position.set(-2.15, 0.30, side * 0.28);
      droneRepro.add(testis);
      var mucus = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.75, 16), matSetaeGold);
      mucus.rotation.z = Math.PI / 2;
      mucus.position.set(-2.65, 0.15, side * 0.20);
      droneRepro.add(mucus);
    });
    var endophallus = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.10, 0.85, 18), glandMat);
    endophallus.rotation.z = Math.PI / 2;
    endophallus.position.set(-3.15, -0.05, 0);
    droneRepro.add(endophallus);
    droneRepro.visible = false;

    reproWrapper.add(workerRepro);
    reproWrapper.add(queenRepro);
    reproWrapper.add(droneRepro);
    animRefs.reproCasteGroups.worker = workerRepro;
    animRefs.reproCasteGroups.queen = queenRepro;
    animRefs.reproCasteGroups.drone = droneRepro;
    tagMeshGroup(reproWrapper, 'reproductive_system_caste', 8, 'reproductive', [-2.4, 0.75, 0.55]);
    internalRoot.add(reproWrapper);

    var intStingGroup = new THREE.Group();
    var vSac = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 18), glandMat);
    vSac.scale.set(1.4, 0.85, 0.85);
    vSac.position.set(-3.32, -0.08, 0);
    intStingGroup.add(vSac);
    tagMeshGroup(intStingGroup, 'sting', 8, 'reproductive', [-3.9, -0.25, 0]);
    internalRoot.add(intStingGroup);

    // 7. Animated Physiological Flow Particles (Haemolymph, Nectar, Neural)
    var flowGroup = new THREE.Group();
    var flowDefs = [
      { color: 0xFB7185, y: 0.56, xStart: -2.9, xEnd: 1.8, dir: 1, sys: 'circulatory', layer: 7 },
      { color: 0xFBBF24, y: 0.05, xStart: 2.0, xEnd: -2.9, dir: -1, sys: 'digestive', layer: 5 },
      { color: 0xC084FC, y: -0.42, xStart: 1.9, xEnd: -3.0, dir: -1, sys: 'nervous', layer: 6 }
    ];
    flowDefs.forEach(function (fd) {
      var pMat = new THREE.MeshBasicMaterial({ color: fd.color });
      for (var i = 0; i < 18; i++) {
        var dot = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), pMat);
        var t = i / 18;
        dot.position.set(fd.xStart + (fd.xEnd - fd.xStart) * t, fd.y, (Math.random() - 0.5) * 0.08);
        dot.userData.layerId = fd.layer;
        dot.userData.systemKey = fd.sys;
        flowGroup.add(dot);
        animRefs.flowParticles.push({
          mesh: dot, t: t, xStart: fd.xStart, xEnd: fd.xEnd, yBase: fd.y, speed: 0.25 + Math.random() * 0.1
        });
      }
    });
    root.add(flowGroup);

    return { root: root, animRefs: animRefs };
  }

  // ============================================================================
  // 2. HIGH-MAGNIFICATION MOUTHPARTS MODULE BUILDER (Module 3 — All 15 Structures)
  // ============================================================================
  function buildMouthpartsModel(clippingPlanes) {
    var root = new THREE.Group();
    var animRefs = {
      mandibleL: null, mandibleR: null,
      proboscisComplex: new THREE.Group(),
      glossaShaft: null,
      labellumTip: null,
      nectarDrops: []
    };

    var chitinBumpTex = createChitinPBRMaps();
    var matScleriteDark = new THREE.MeshPhysicalMaterial({
      color: 0x2E1A0E, roughness: 0.28, metalness: 0.18, bumpMap: chitinBumpTex, bumpScale: 0.015,
      clearcoat: 0.82, clearcoatRoughness: 0.18, clippingPlanes: clippingPlanes
    });
    var matAmberBlade = new THREE.MeshPhysicalMaterial({
      color: 0xF59E0B, transparent: true, opacity: 0.88, roughness: 0.16, metalness: 0.1,
      clearcoat: 0.9, clippingPlanes: clippingPlanes
    });
    var matGlossa = new THREE.MeshPhysicalMaterial({
      color: 0xE11D48, emissive: 0x881337, emissiveIntensity: 0.25, roughness: 0.35, clearcoat: 0.6, clippingPlanes: clippingPlanes
    });
    var matGoldSetae = new THREE.MeshPhysicalMaterial({
      color: 0xFBBF24, roughness: 0.35, metalness: 0.15, clearcoat: 0.5, clippingPlanes: clippingPlanes
    });

    // 1. Labrum
    var labrumGrp = new THREE.Group();
    var labrumMesh = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.38, 0.45, 8, 8, 8), matScleriteDark);
    labrumMesh.position.set(0, 2.35, 0.38);
    labrumGrp.add(labrumMesh);
    tagMeshGroup(labrumGrp, 'mp_labrum', 1, 'exoskeleton', [0, 0.9, 0.7]);
    root.add(labrumGrp);

    // 2. Paired Mandibles
    var mandGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var mPivot = new THREE.Group();
      mPivot.position.set(side * 1.05, 2.05, 0.38);
      var mGeo = new THREE.ConeGeometry(0.32, 1.25, 24);
      mGeo.scale(0.85, 1.0, 0.55);
      var mMesh = new THREE.Mesh(mGeo, matScleriteDark);
      mMesh.position.set(-side * 0.18, -0.45, 0);
      mMesh.rotation.z = side * 0.35;
      mPivot.add(mMesh);
      mandGrp.add(mPivot);
      if (side === 1) animRefs.mandibleL = mPivot;
      else animRefs.mandibleR = mPivot;
    });
    tagMeshGroup(mandGrp, 'mp_mandible', 1, 'external', [1.3, 0.6, 0.65]);
    root.add(mandGrp);

    var prob = animRefs.proboscisComplex;
    root.add(prob);

    // 3. Cardo
    var cardoGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.05, 18), matScleriteDark);
      rod.position.set(side * 0.82, 1.55, -0.25);
      rod.rotation.z = -side * 0.25;
      cardoGrp.add(rod);
    });
    tagMeshGroup(cardoGrp, 'mp_cardo', 1, 'exoskeleton', [1.1, 0.7, -0.5]);
    prob.add(cardoGrp);

    // 4. Submentum
    var submentGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var vArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.85, 16), matGoldSetae);
      vArm.position.set(side * 0.35, 1.38, -0.30);
      vArm.rotation.z = side * 0.75;
      submentGrp.add(vArm);
    });
    tagMeshGroup(submentGrp, 'mp_submentum', 1, 'exoskeleton', [0, 0.65, -0.75]);
    prob.add(submentGrp);

    // 5. Mentum
    var mentGrp = new THREE.Group();
    var mentMesh = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.62, 20), matScleriteDark);
    mentMesh.rotation.x = Math.PI;
    mentMesh.position.set(0, 1.02, -0.22);
    mentGrp.add(mentMesh);
    tagMeshGroup(mentGrp, 'mp_mentum', 1, 'exoskeleton', [0, 0.35, -0.65]);
    prob.add(mentGrp);

    // 6. Stipes
    var stipesGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var stGeo = new THREE.CylinderGeometry(0.22, 0.16, 1.45, 24);
      stGeo.scale(0.85, 1.0, 1.2);
      var st = new THREE.Mesh(stGeo, matScleriteDark);
      st.position.set(side * 0.76, 0.52, -0.05);
      stipesGrp.add(st);
    });
    tagMeshGroup(stipesGrp, 'mp_stipes', 1, 'exoskeleton', [1.15, 0.1, -0.2]);
    prob.add(stipesGrp);

    // 7. Prementum
    var prementGrp = new THREE.Group();
    var pmGeo = new THREE.CylinderGeometry(0.34, 0.24, 1.55, 24);
    pmGeo.scale(1.0, 1.0, 0.75);
    var pm = new THREE.Mesh(pmGeo, matScleriteDark);
    pm.position.set(0, 0.32, -0.12);
    prementGrp.add(pm);
    tagMeshGroup(prementGrp, 'mp_prementum', 1, 'exoskeleton', [0, 0, -0.55]);
    prob.add(prementGrp);

    // 8. Lacinia
    var lacGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var lac = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), matGoldSetae);
      lac.scale.set(0.8, 1.4, 0.8);
      lac.position.set(side * 0.48, 0.12, 0.18);
      lacGrp.add(lac);
    });
    tagMeshGroup(lacGrp, 'mp_lacinia', 1, 'external', [0.85, 0.05, 0.45]);
    prob.add(lacGrp);

    // 9. Maxillary Palp
    var maxPalpGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var mp = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.36, 16), matGoldSetae);
      mp.position.set(side * 0.94, -0.08, 0.15);
      mp.rotation.z = -side * 0.35;
      maxPalpGrp.add(mp);
    });
    tagMeshGroup(maxPalpGrp, 'mp_maxillary_palp', 1, 'nervous', [1.45, -0.05, 0.35]);
    prob.add(maxPalpGrp);

    // 10. Palpifer
    var palpiferGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var pf = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.10, 0.35, 16), matScleriteDark);
      pf.position.set(side * 0.36, -0.38, -0.10);
      palpiferGrp.add(pf);
    });
    tagMeshGroup(palpiferGrp, 'mp_palpifer', 1, 'exoskeleton', [0.65, -0.3, -0.35]);
    prob.add(palpiferGrp);

    // 11. Paraglossa
    var paraGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var pg = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 16), matGoldSetae);
      pg.rotation.x = Math.PI;
      pg.position.set(side * 0.22, -0.62, 0.06);
      paraGrp.add(pg);
    });
    tagMeshGroup(paraGrp, 'mp_paraglossa', 1, 'external', [0.48, -0.5, 0.25]);
    prob.add(paraGrp);

    // 12. Galea
    var galeaGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var galGeo = new THREE.ConeGeometry(0.24, 2.25, 24);
      galGeo.scale(0.65, 1.0, 1.15);
      var gal = new THREE.Mesh(galGeo, matAmberBlade);
      gal.rotation.x = Math.PI;
      gal.position.set(side * 0.45, -1.18, 0.18);
      gal.rotation.z = -side * 0.12;
      galeaGrp.add(gal);
    });
    tagMeshGroup(galeaGrp, 'mp_galea', 1, 'external', [1.15, -0.8, 0.55]);
    prob.add(galeaGrp);

    // 13. Labial Palp
    var labPalpGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var lp = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.06, 1.95, 20), matAmberBlade);
      lp.position.set(side * 0.36, -1.35, -0.18);
      lp.rotation.z = -side * 0.06;
      labPalpGrp.add(lp);
    });
    tagMeshGroup(labPalpGrp, 'mp_labial_palp', 1, 'external', [0.85, -1.0, -0.45]);
    prob.add(labPalpGrp);

    // 14. Glossae / Ligula
    var glossaGrp = new THREE.Group();
    var glossaCore = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.08, 2.35, 28), matGlossa);
    glossaCore.position.set(0, -1.45, 0);
    glossaGrp.add(glossaCore);
    for (var w = 0; w < 16; w++) {
      var whorl = new THREE.Mesh(new THREE.TorusGeometry(0.14 - w * 0.003, 0.022, 10, 24), matGoldSetae);
      whorl.rotation.x = Math.PI / 2;
      whorl.position.set(0, -0.45 - w * 0.13, 0);
      glossaGrp.add(whorl);
    }
    animRefs.glossaShaft = glossaGrp;
    tagMeshGroup(glossaGrp, 'mp_glossae', 1, 'external', [0, -1.2, 0]);
    prob.add(glossaGrp);

    // 15. Labellum / Flabellum
    var labellumGrp = new THREE.Group();
    var spoon = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 18), matGoldSetae);
    spoon.scale.set(1.2, 0.45, 1.2);
    spoon.position.set(0, -2.62, 0);
    labellumGrp.add(spoon);
    animRefs.labellumTip = labellumGrp;
    tagMeshGroup(labellumGrp, 'mp_labellum', 1, 'external', [0, -2.0, 0]);
    prob.add(labellumGrp);

    var dropMat = new THREE.MeshBasicMaterial({ color: 0xFDE047 });
    for (var d = 0; d < 12; d++) {
      var drop = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), dropMat);
      drop.position.set(0, -2.5 + d * 0.30, 0.08);
      prob.add(drop);
      animRefs.nectarDrops.push({ mesh: drop, t: d / 12 });
    }

    return { root: root, animRefs: animRefs };
  }

  // ============================================================================
  // 3. STING APPARATUS MECHANISTIC MODULE BUILDER (Module 4 — All 9 Structures)
  // ============================================================================
  function buildStingModel(clippingPlanes) {
    var root = new THREE.Group();
    var animRefs = {
      poisonSacMesh: null,
      platesGroup: null,
      lancetL: null,
      lancetR: null,
      barbsL: null,
      barbsR: null,
      venomDrops: []
    };

    var chitinBumpTex = createChitinPBRMaps();
    var matChitin = new THREE.MeshPhysicalMaterial({
      color: 0x3E2723, roughness: 0.25, metalness: 0.28, bumpMap: chitinBumpTex, bumpScale: 0.015,
      clearcoat: 0.85, clippingPlanes: clippingPlanes
    });
    var matLancetSteel = new THREE.MeshPhysicalMaterial({
      color: 0xD97706, emissive: 0x78350F, emissiveIntensity: 0.25, roughness: 0.16, metalness: 0.48,
      clearcoat: 0.9, clippingPlanes: clippingPlanes
    });
    var matVenomSac = new THREE.MeshPhysicalMaterial({
      color: 0x10B981, emissive: 0x047857, emissiveIntensity: 0.35,
      transparent: true, opacity: 0.82, roughness: 0.14, clearcoat: 0.95, clippingPlanes: clippingPlanes
    });
    var matGland = new THREE.MeshPhysicalMaterial({
      color: 0x38BDF8, emissive: 0x0369A1, emissiveIntensity: 0.3, roughness: 0.28, clearcoat: 0.7, clippingPlanes: clippingPlanes
    });

    // 1. Acid Glands
    var acidGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      for (var c = 0; c < 6; c++) {
        var coil = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.045, 14, 28), matGland);
        coil.position.set(1.55 + c * 0.14, 1.15 + Math.sin(c) * 0.18, side * (0.28 + c * 0.05));
        coil.rotation.set(c * 0.5, side * 0.4, 0.3);
        acidGrp.add(coil);
      }
    });
    tagMeshGroup(acidGrp, 'st_acid_glands', 8, 'reproductive', [1.2, 1.1, 0.65]);
    root.add(acidGrp);

    // 2. Poison Sac
    var sacGrp = new THREE.Group();
    var sacGeo = new THREE.SphereGeometry(0.62, 36, 32);
    sacGeo.scale(1.55, 0.92, 0.92);
    var sacMesh = new THREE.Mesh(sacGeo, matVenomSac);
    sacMesh.position.set(1.25, 0.72, 0);
    sacGrp.add(sacMesh);
    animRefs.poisonSacMesh = sacMesh;
    tagMeshGroup(sacGrp, 'st_poison_sac', 8, 'reproductive', [0.8, 0.65, 0]);
    root.add(sacGrp);

    // 3. Alkaline Gland
    var alkGrp = new THREE.Group();
    var alkMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.12, 1.15, 20),
      new THREE.MeshPhysicalMaterial({ color: 0xA855F7, emissive: 0x581C87, emissiveIntensity: 0.3, roughness: 0.28, clearcoat: 0.7, clippingPlanes: clippingPlanes })
    );
    alkMesh.rotation.z = 1.15;
    alkMesh.position.set(0.95, -0.45, 0.28);
    alkGrp.add(alkMesh);
    tagMeshGroup(alkGrp, 'st_alkaline_gland', 8, 'reproductive', [0.7, -0.65, 0.55]);
    root.add(alkGrp);

    // 4. Basal Arm
    var armGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var arm = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.06, 16, 32, Math.PI * 0.85), matChitin);
      arm.position.set(0.45, 0.28, side * 0.28);
      arm.rotation.z = Math.PI * 0.55;
      armGrp.add(arm);
    });
    tagMeshGroup(armGrp, 'st_basal_arm', 2, 'exoskeleton', [0.4, 0.35, 0.65]);
    root.add(armGrp);

    // 5. Plates to Move Barbs
    var platesGrp = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var quadPlate = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.48, 0.08), matLancetSteel);
      quadPlate.position.set(0.52, 0.72, side * 0.48);
      platesGrp.add(quadPlate);

      var oblPlate = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.26, 0.08), matChitin);
      oblPlate.position.set(0.18, 0.38, side * 0.42);
      platesGrp.add(oblPlate);

      var triPlate = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.45, 3), matLancetSteel);
      triPlate.rotation.z = Math.PI / 2;
      triPlate.position.set(0.68, 0.32, side * 0.46);
      platesGrp.add(triPlate);
    });
    animRefs.platesGroup = platesGrp;
    tagMeshGroup(platesGrp, 'st_plates', 2, 'exoskeleton', [0.35, 0.85, 0.95]);
    root.add(platesGrp);

    // 6. Palpus of Sting
    var palpusGrp = new THREE.Group();
    var palpMat = new THREE.MeshPhysicalMaterial({
      color: 0xF59E0B, roughness: 0.38, clearcoat: 0.6, clippingPlanes: clippingPlanes
    });
    [-1, 1].forEach(function (side) {
      var palp = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.07, 1.45, 18), palpMat);
      palp.rotation.z = Math.PI / 2;
      palp.position.set(-0.85, 0.18, side * 0.38);
      palpusGrp.add(palp);
    });
    tagMeshGroup(palpusGrp, 'st_palpus', 6, 'nervous', [-0.6, 0.3, 0.85]);
    root.add(palpusGrp);

    // 7. Sheath to Hold Lancets
    var sheathGrp = new THREE.Group();
    var bulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 28, 24), matChitin);
    bulb.scale.set(1.8, 0.9, 0.9);
    bulb.position.set(-0.05, 0.08, 0);
    sheathGrp.add(bulb);

    var styletShaft = new THREE.Mesh(new THREE.ConeGeometry(0.16, 2.65, 24), matChitin);
    styletShaft.rotation.z = Math.PI / 2;
    styletShaft.position.set(-1.25, 0.08, 0);
    sheathGrp.add(styletShaft);
    tagMeshGroup(sheathGrp, 'st_sheath', 2, 'exoskeleton', [-0.3, 0.25, 0]);
    root.add(sheathGrp);

    // 8. Reciprocating Twin Lancets
    var lancetsWrapper = new THREE.Group();
    [-1, 1].forEach(function (side) {
      var lRod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.075, 2.75, 20), matLancetSteel);
      lRod.rotation.z = Math.PI / 2;
      lRod.position.set(-1.25, -0.06, side * 0.11);
      lancetsWrapper.add(lRod);
      if (side === 1) animRefs.lancetL = lRod;
      else animRefs.lancetR = lRod;
    });
    tagMeshGroup(lancetsWrapper, 'st_lancet', 2, 'exoskeleton', [-1.1, -0.25, 0.35]);
    root.add(lancetsWrapper);

    // 9. Recurved Apical Barbs (10 backward-pointing sawtooth barbs per lancet)
    var barbsWrapper = new THREE.Group();
    var barbMat = new THREE.MeshPhysicalMaterial({
      color: 0xEF4444, emissive: 0x991B1B, emissiveIntensity: 0.4, roughness: 0.18, clearcoat: 0.85, clippingPlanes: clippingPlanes
    });
    [-1, 1].forEach(function (side) {
      var sideBarbs = new THREE.Group();
      for (var b = 0; b < 10; b++) {
        var tooth = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.14, 12), barbMat);
        tooth.position.set(-1.68 - b * 0.095, -0.10, side * (0.14 + b * 0.004));
        tooth.rotation.z = -Math.PI * 0.65;
        tooth.rotation.x = side * 0.4;
        sideBarbs.add(tooth);
      }
      barbsWrapper.add(sideBarbs);
      if (side === 1) animRefs.barbsL = sideBarbs;
      else animRefs.barbsR = sideBarbs;
    });
    tagMeshGroup(barbsWrapper, 'st_barbs', 1, 'external', [-2.1, -0.35, 0.45]);
    root.add(barbsWrapper);

    var vDropMat = new THREE.MeshBasicMaterial({ color: 0x34D399 });
    for (var vd = 0; vd < 10; vd++) {
      var vDrop = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), vDropMat);
      vDrop.position.set(0.8 - vd * 0.35, 0.0, 0);
      root.add(vDrop);
      animRefs.venomDrops.push({ mesh: vDrop, t: vd / 10 });
    }

    return { root: root, animRefs: animRefs };
  }

  return {
    buildStudioHDRITexture: buildStudioHDRITexture,
    buildFullBeeModel: buildFullBeeModel,
    buildMouthpartsModel: buildMouthpartsModel,
    buildStingModel: buildStingModel
  };
})();
