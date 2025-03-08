// v.1.6

const slider = document.getElementById("slider");
const data = JSON.parse(slider.getAttribute("data-images"));

let sliderST = ScrollTrigger.create({
  trigger: ".home-slider",
  pin: ".home-slider",
  start: "top 0%",
  end: `+=${window.innerHeight * (data.length - 1)}`, //end of the last slide
  onEnter: () => {
    // TODO: fix callbacks, bugyy content removal and the likes
    // console.log("on enter");
    if (sketch) {
      lenis.stop();
      sketch.showContent(0, 1);
      lenis.start();
    }
  },
  onLeave: () => {
    // console.log("on leave");
    if (sketch) {
      sketch.unMountListeners();
    }
  },
  onEnterBack: () => {
    // console.log("on enter back");
    if (sketch) {
      sketch.mountListeners();
    }
  },
  onLeaveBack: () => {
    // console.log("on leave back");
    if (sketch) {
      sketch.removeContent(0, -1);
      sketch.unMountListeners();
    }
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
    this.clickNext = document.getElementById("slider-next");
    this.clickPrev = document.getElementById("slider-prev");
    this.dots = document.getElementById("slider-dots-group");
    this.scrolling = false; // to remove
    this.touchStartY = 0;
    this.slider = slider;
    this.container = document
      .querySelector(".home-slider")
      .getBoundingClientRect();
    this.images = data;
    this.content = Array.from(document.querySelectorAll(".slider-content"));
    this.width = this.slider.offsetWidth;
    this.height = this.slider.offsetHeight;
    this.slider.appendChild(this.renderer.domElement);
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
    this.boundTouchStart = this.touchStart.bind(this);
    this.boundTouchMove = this.touchMove.bind(this);
    this.boundKeydown = this.keydown.bind(this);

    this.initiate(() => {
      // console.log(this.textures);
      this.setupResize();
      this.settings();
      this.addObjects();
      this.resize();
      this.click();
      this.scroll();
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

    // initialize the array with the new number of dots
    this.dotsArray = Array.from(this.dots.querySelectorAll(".slider-dot"));

    Promise.all(promises).then(() => {
      cb();
      //make the first dot active
      this.activeDot(0, true);
      this.mountListeners();
    });
  }

  activeDot(index, addOrRemove) {
    if (addOrRemove) {
      this.dotsArray[index].classList.add("cc-active");
    } else {
      this.dotsArray[index].classList.remove("cc-active");
    }
  }

  showContent(index, direction) {
    gsap
      .timeline()
      .set(this.content[index], { className: "slider-content cc-active" }, "<")
      .fromTo(
        this.content[index].children,
        {
          yPercent: 40 * direction,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.3,
          duration: 1.2,
          ease: "power4.out",
        },
        "<0.5"
      );
  }

  removeContent(index, direction) {
    gsap
      .timeline({
        onComplete: () => {
          this.content[index].classList.remove("cc-active");
        },
      })
      .to(this.content[index].children, {
        opacity: 0,
        yPercent: -40 * direction,
        duration: 0.5,
        ease: "easeOut",
      });
  }

  settings() {
    this.settings = {
      progress: 0.5,
    };
    Object.keys(this.uniforms).forEach((item) => {
      this.settings[item] = this.uniforms[item].value;
    });
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.slider.offsetWidth;
    this.height = this.slider.offsetHeight;
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

  slideTo(nextIndex) {
    if (this.isRunning) return;

    this.isRunning = true;
    let nextTexture = this.textures[nextIndex];
    this.material.uniforms.texture2.value = nextTexture;

    // update scroll position
    lenis.scrollTo(this.container.top + window.innerHeight * nextIndex, {
      duration: 1,
      lock: true,
      onComplete: () => {
        lenis.stop();
      },
    });

    // update dots
    if (this.current >= 0) this.activeDot(this.current, false);
    setTimeout(() => this.activeDot(nextIndex, true), 500); // first dot transition

    const direction = this.current < nextIndex ? 1 : -1;

    // remove content
    if (this.current >= 0) this.removeContent(this.current, direction);

    let tl = gsap.timeline({
      onComplete: () => {
        this.current = nextIndex;
        this.material.uniforms.texture1.value = nextTexture;
        this.material.uniforms.progress.value = 0;
        this.isRunning = false;
        lenis.start();
      },
    });

    tl.to(this.material.uniforms.progress, this.duration, {
      value: 1,
      ease: Power2[this.easing],
    })
      .set(
        this.content[nextIndex],
        { className: "slider-content cc-active" },
        "<"
      )
      .fromTo(
        this.content[nextIndex].children,
        {
          yPercent: 40 * direction,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.3,
          duration: 1.2,
          ease: "power4.out",
        },
        "<0.5"
      );
  }

  prev() {
    if (this.current > 0)
      this.slideTo((this.current - 1) % this.textures.length);
  }

  next() {
    if (this.current < this.textures.length - 1)
      this.slideTo((this.current + 1) % this.textures.length);
  }

  scroll() {
    lenis.on("scroll", ({ scroll }) => {
      const scrollPos = scroll - this.container.top;

      if (scrollPos <= 0) {
        if (this.current !== 0) this.slideTo(0);
      } else {
        const newIndex = Math.round(scrollPos / window.innerHeight);
        if (newIndex !== this.current && newIndex < this.images.length) {
          this.slideTo(newIndex);
        } else if (
          newIndex > this.images.length &&
          this.current !== this.images.length - 1
        )
          this.slideTo(this.images.length - 1);
      }
    });
  }

  click() {
    this.clickNext.addEventListener("click", () => {
      this.next();
    });
    this.clickPrev.addEventListener("click", () => {
      this.prev();
    });
  }

  keydown(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowDown") {
      this.next();
    } else if (e.key === "ArrowUp" || e.key === "ArrowUp") {
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

  mountListeners() {
    window.addEventListener("touchstart", this.boundTouchStart);
    window.addEventListener("touchmove", this.boundTouchMove);
    window.addEventListener("keydown", this.boundKeydown);
  }

  unMountListeners() {
    window.removeEventListener("touchstart", this.boundTouchStart);
    window.removeEventListener("touchmove", this.boundTouchMove);
    window.removeEventListener("keydown", this.boundKeydown);
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

const dots = document.querySelectorAll(".slider-dot");
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    if (sketch) sketch.slideTo(i);
  });
});
