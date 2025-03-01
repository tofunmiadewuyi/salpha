gsap.registerPlugin(ScrollTrigger);

let st = ScrollTrigger.create({
  trigger: ".main",
  pin: ".main",
  start: "top 0%",
  end: `+=${window.innerHeight * 4}`,
  markers: true,
  onEnter: () => {
    if (sketch) sketch.mountListeners();
  },
  onLeave: () => {
    if (sketch) sketch.unMountListeners();
  },
  onEnterBack: () => {
    if (sketch) sketch.mountListeners();
  },
  onLeaveBack: () => {
    if (sketch) sketch.unMountListeners();
  },
});

class Sketch {
  constructor(opts) {
    this.scene = new THREE.Scene();
    this.vertex = `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}`;
    this.fragment = opts.fragment;
    this.uniforms = opts.uniforms;
    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.duration = opts.duration || 1;
    this.debug = opts.debug || false;
    this.easing = opts.easing || "easeInOut";
    this.clicker = document.getElementById("slider-next");
    this.clicker2 = document.getElementById("slider-prev");
    this.dots = document.getElementById("slider-dots-group");
    this.dotsArray = [];
    this.scrolling = false;
    this.touchStartY = 0;
    this.container = document.getElementById("slider");
    this.mainRect = document.querySelector(".main").getBoundingClientRect();
    this.images = JSON.parse(this.container.getAttribute("data-images"));
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 2);
    this.time = 0;
    this.current = 0;
    this.textures = [];
    this.paused = true;
    // Store bound methods as instance properties
    this.boundScroll = this.scroll.bind(this);
    this.boundTouchStart = this.touchStart.bind(this);
    this.boundTouchMove = this.touchMove.bind(this);
    this.boundKeydown = this.keydown.bind(this);

    this.initiate(() => {
      // console.log(this.textures);
      this.setupResize();
      this.settings();
      this.addObjects();
      this.resize();
      this.clickEvent();
      this.clickEvent2();
      this.play();
    });
  }
  initiate(cb) {
    const promises = [];
    let that = this;
    const dot = document.querySelector(".slider-dot");
    this.images.forEach((url, i) => {
      let promise = new Promise((resolve) => {
        that.textures[i] = new THREE.TextureLoader().load(url, resolve);
      });
      promises.push(promise);
      // dots for the controls
      if (i > 0) {
        this.dots.appendChild(dot.cloneNode(true));
      }
    });

    Promise.all(promises).then(() => {
      cb();
      //make the first dot active
      this.dotsArray = Array.from(this.dots.querySelectorAll(".slider-dot"));
      this.activeDot(this.current, true);
    });
  }

  clickEvent() {
    this.clicker.addEventListener("click", () => {
      this.next();
    });
  }
  clickEvent2() {
    this.clicker2.addEventListener("click", () => {
      this.prev();
    });
  }

  activeDot(index, addOrRemove) {
    if (addOrRemove) {
      this.dotsArray[index].classList.add("cc-active");
    } else {
      this.dotsArray[index].classList.remove("cc-active");
    }
  }

  settings() {
    let that = this;
    if (this.debug) this.gui = new dat.GUI();
    this.settings = {
      progress: 0.5,
    };
    Object.keys(this.uniforms).forEach((item) => {
      this.settings[item] = this.uniforms[item].value;
      if (this.debug)
        this.gui.add(
          this.settings,
          item,
          this.uniforms[item].min,
          this.uniforms[item].max,
          0.01
        );
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  mountListeners() {
    window.addEventListener("wheel", this.boundScroll, {
      passive: false,
    });
    window.addEventListener("touchstart", this.boundTouchStart);
    window.addEventListener("touchmove", this.boundTouchMove);
    window.addEventListener("keydown", this.boundKeydown);
  }

  unMountListeners() {
    window.removeEventListener("wheel", this.boundScroll);
    window.removeEventListener("touchstart", this.boundTouchStart);
    window.removeEventListener("touchmove", this.boundTouchMove);
    window.removeEventListener("keydown", this.boundKeydown);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    // image cover
    this.imageAspect =
      this.textures[0].image.height / this.textures[0].image.width;
    let a1;
    let a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = this.height / this.width / this.imageAspect;
    }
    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;
    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));
    this.plane.scale.x = this.camera.aspect;
    this.plane.scale.y = 1;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        border: { type: "f", value: 0 },
        intensity: { type: "f", value: 0 },
        scaleX: { type: "f", value: 40 },
        scaleY: { type: "f", value: 40 },
        transition: { type: "f", value: 40 },
        swipe: { type: "f", value: 0 },
        width: { type: "f", value: 0 },
        radius: { type: "f", value: 0 },
        texture1: { type: "f", value: this.textures[0] },
        texture2: { type: "f", value: this.textures[1] },

        displacement: {
          type: "f",
          value: new THREE.TextureLoader().load(
            "https://cdn.prod.website-files.com/67bc520faaed09d1fdf8e7e0/67bedb90f57caeca52b2f38b_Salpha%20Web_Hero_2025-02-26_09.40.28.png"
          ),
        },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      vertexShader: this.vertex,
      fragmentShader: this.fragment,
    });
    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }
  stop() {
    this.paused = true;
  }
  play() {
    this.paused = false;
    this.render();
  }
  next() {
    if (this.isRunning) return;
    if (this.current === this.textures.length - 1) {
      return this.unMountListeners();
    }

    this.isRunning = true;
    let len = this.textures.length;
    const nextIndex = (this.current + 1) % len;
    let nextTexture = this.textures[nextIndex];
    this.material.uniforms.texture2.value = nextTexture;

    //update dots
    this.activeDot(this.current, false);
    setTimeout(() => this.activeDot(nextIndex, true), 500); // first dot transition

    //update scroll position
    lenis.scrollTo(this.mainRect.top + window.innerHeight * (nextIndex + 1), {
      duration: 1,
      lock: true,
    });

    let tl = new TimelineMax();
    tl.to(this.material.uniforms.progress, this.duration, {
      value: 1,
      ease: Power2[this.easing],
      onComplete: () => {
        //console.log('FINISH');

        this.current = nextIndex;
        this.material.uniforms.texture1.value = nextTexture;
        this.material.uniforms.progress.value = 0;
        this.isRunning = false;
      },
    });
  }
  prev() {
    if (this.isRunning) return;
    if (this.current === 0) return this.unMountListeners();

    this.isRunning = true;
    let len = this.textures.length;
    const prevIndex = this.current === 0 ? len - 1 : this.current - 1;
    let prevTexture = this.textures[prevIndex];
    this.material.uniforms.texture2.value = prevTexture;

    //update scroll position
    lenis.scrollTo(this.mainRect.top + window.innerHeight * prevIndex, {
      duration: 1,
      lock: true,
    });

    // update dots
    this.activeDot(this.current, false);
    setTimeout(() => this.activeDot(prevIndex, true), 500); // first dot transition

    let tl = new TimelineMax();
    tl.to(this.material.uniforms.progress, this.duration, {
      value: 1,
      ease: Power2[this.easing],
      onComplete: () => {
        //console.log('FINISH');

        this.current = prevIndex;
        this.material.uniforms.texture1.value = prevTexture;
        this.material.uniforms.progress.value = 0;
        this.isRunning = false;
      },
    });
  }
  scroll(e) {
    e.preventDefault();

    if (this.scrolling) return;

    this.scrolling = true;

    if (e.deltaY > 0) {
      this.next(); // User scrolled down
    } else {
      this.prev(); // User scrolled up
    }

    this.scrolling = false;
  }

  keydown(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      this.next();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      this.prev();
    }
  }

  touchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }

  touchMove(e) {
    const touchCurrentY = e.touches[0].clientY;
    const diff = this.touchStartY - touchCurrentY;

    // Only trigger if the swipe is significant enough
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.next(); // Swipe up (down direction)
      } else {
        this.prev(); // Swipe down (up direction)
      }
      this.touchStartY = touchCurrentY; // Reset the touch position
    }
  }

  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    Object.keys(this.uniforms).forEach((item) => {
      this.material.uniforms[item].value = this.settings[item];
    });
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

// planetary 4v
let sketch = new Sketch({
  debug: false,
  duration: 1.5,
  uniforms: {
    intensity: { value: 0.3, type: "f", min: 0, max: 3 },
  },
  fragment: `
  uniform float time;
uniform float progress;
uniform float intensity;
uniform float width;
uniform float scaleX;
uniform float scaleY;
uniform float transition;
uniform float radius;
uniform float swipe;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D displacement;
uniform vec4 resolution;
varying vec2 vUv;

mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

const float PI = 3.1415;
const float angle1 = PI * 0.25;
const float angle2 = -PI * 0.75;
const float zoomFactor = 1.5; // Zoom factor for the second image

// Easing functions
float easeInOutQuad(float t) {
    return t < 0.5 ? 2.0 * t * t : 1.0 - pow(-2.0 * t + 2.0, 2.0) / 2.0;
}

float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
}

float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

float easeOutQuart(float t) {
    return 1.0 - pow(1.0 - t, 4.0);
}

float easeOutElastic(float t) {
    const float c4 = (2.0 * PI) / 3.0;
    return t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : pow(2.0, -10.0 * t) * sin((t * 10.0 - 0.75) * c4) + 1.0;
}

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec4 disp = texture2D(displacement, newUV);
    vec2 dispVec = vec2(disp.r, disp.g);

    // First image transition with only vertical displacement
    vec2 verticalDispVec1 = vec2(0.0, dispVec.y); // Remove horizontal displacement
    vec2 distortedPosition1 = newUV + getRotM(angle1) * verticalDispVec1 * intensity * progress;
    vec4 t1 = texture2D(texture1, distortedPosition1);

    // For the second image, apply zoom that decreases as progress increases
    // Apply easing to the progress - change the function name to use different easing
    float easedProgress = easeOutCubic(progress); // Try different easing functions here
    float currentZoom = 1.0 + (zoomFactor - 1.0) * (1.0 - easedProgress);
    vec2 zoomedUV = (newUV - vec2(0.5)) / currentZoom + vec2(0.5);

    // Apply the distortion to the zoomed UV coordinates, but only in the y-direction
    vec2 verticalDispVec = vec2(0.0, dispVec.y); // Remove horizontal displacement
    vec2 distortedPosition2 = zoomedUV + getRotM(angle2) * verticalDispVec * intensity * (1.0 - progress);
    vec4 t2 = texture2D(texture2, distortedPosition2);

    gl_FragColor = mix(t1, t2, progress);
}
  `,
});
