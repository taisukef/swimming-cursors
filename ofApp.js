import {
  ofSetWindowTitle, ofBackground, ofSetLineWidth, ofSeedRandom, ofRandom, ofRunApp, ofMap,
  ofTranslate, ofGetWindowSize, ofNoise, ofGetFrameNum, ofGetFramePerSecond,
  ofColor, ofSetColor, ofFill, ofNoFill, ofBeginShape, ofVertex, ofEndShape,
  cos, sin, atan2, PI,
} from "https://code4fukui.github.io/ofjs/ofMain.js";
import * as glm from "https://code4fukui.github.io/ofjs/glm.js";

const fillColorLeader = ofColor(200, 0, 0);
const strokeColorLeader = ofColor(255, 255, 255);
const fillColor = ofColor(0, 0, 0);
const strokeColor = ofColor(255, 255, 255);

export class ofApp {
  setup() {
    //ofSetFrameRate(25);
    ofSetWindowTitle("swimming cursors");

    //ofBackground(39);
    ofBackground(0);
    ofSetLineWidth(2);

    this.seed = Math.floor(Math.random() * 100000);
  }
  update() {
    ofSeedRandom(this.seed);
  }
  draw() {
    const size = ofGetWindowSize();
    ofTranslate(size.getMul(0.5));
    const w2 = size.x / 2;
    const h2 = size.y / 2;
    const wh2 = Math.min(w2, h2);

    const base_noise_seed = glm.vec3(ofRandom(1000), ofRandom(1000), ofRandom(1000));

    const narrows = 250;
    const speed = 80 / 360 * wh2;
    const fps = ofGetFramePerSecond();
    const tick = 0.01 / (fps > 100 ? 4 : 2);
    const tick2 = tick * 0.8;
    const minsize = 10 / 360 * wh2;
    const maxsize = 20 / 360 * wh2;
    for (let k = 0; k < narrows; k++) {

      //const param = glm.vec3(2, 0, 0);
      const noise_seed = glm.vec3(ofRandom(1000), ofRandom(1000), ofRandom(1000));
      if (ofGetFrameNum() < 3) {
        console.log(ofGetFrameNum(), k, noise_seed)
      }
      
      const base_location = glm.vec2(
        ofMap(ofNoise(base_noise_seed.x, (k + ofGetFrameNum()) * tick), 0, 1, -w2, w2),
        ofMap(ofNoise(base_noise_seed.y, (k + ofGetFrameNum()) * tick), 0, 1, -h2, h2));

      const location = glm.vec2(
        ofMap(ofNoise(noise_seed.x, (k + ofGetFrameNum()) * tick2), 0, 1, -speed, speed),
        ofMap(ofNoise(noise_seed.y, (k + ofGetFrameNum()) * tick2), 0, 1, -speed, speed));

      const next_base_location = glm.vec2(
        ofMap(ofNoise(base_noise_seed.x, (k + ofGetFrameNum() + 1) * tick), 0, 1, -w2, w2),
        ofMap(ofNoise(base_noise_seed.y, (k + ofGetFrameNum() + 1) * tick), 0, 1, -h2, h2));

      const next = glm.vec2(
        ofMap(ofNoise(noise_seed.x, (k + ofGetFrameNum() + 1) * tick2), 0, 1, -speed, speed),
        ofMap(ofNoise(noise_seed.y, (k + ofGetFrameNum() + 1) * tick2), 0, 1, -speed, speed));

      location.add(base_location);
      next.add(next_base_location);
      if (k == narrows - 1) {
        this.draw_arrow(location, next, ofMap(k, 0, narrows, minsize, maxsize), fillColorLeader, strokeColorLeader);
      } else {
        this.draw_arrow(location, next, ofMap(k, 0, narrows, minsize, maxsize), fillColor, strokeColor);
      }
    }

    /*
    int start = 250 + 383 + 40;
    if (ofGetFrameNum() > start) {

      ostringstream os;
      os << setw(4) << setfill('0') << ofGetFrameNum() - start;
      ofImage image;
      image.grabScreen(0, 0, ofGetWidth(), ofGetHeight());
      image.saveImage("image/cap/img_" + os.str() + ".jpg");
      if (ofGetFrameNum() - start >= 25 * 20) {

        std::exit(1);
      }
    }
    */
  }

  //--------------------------------------------------------------
  draw_arrow(/*glm.vec2*/ location, /*glm.vec2*/ next_location, /*float*/ size, /*ofColor*/ fill_color, /*ofColor*/ no_fill_color) {

    const angle = atan2(next_location.y - location.y, next_location.x - location.x);

    ofSetColor(fill_color);
    ofFill();
    ofBeginShape();
    ofVertex(glm.vec2(size * 0.8 * cos(angle), size * 0.8 * sin(angle)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle + PI * 0.5), size * 0.5 * sin(angle + PI * 0.5)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle - PI * 0.5), size * 0.5 * sin(angle - PI * 0.5)).add(location));
    ofEndShape(true);

    ofBeginShape();
    ofVertex(glm.vec2(size * 0.5 * cos(angle + PI * 0.5), size * 0.5 * sin(angle + PI * 0.5)).mul(0.25).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle + PI * 0.5), size * 0.5 * sin(angle + PI * 0.5)).mul(0.25).sub(glm.vec2(size * cos(angle), size * sin(angle)).mul(0.5)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle - PI * 0.5), size * 0.5 * sin(angle - PI * 0.5)).mul(0.25).sub(glm.vec2(size * cos(angle), size * sin(angle)).mul(0.5)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle - PI * 0.5), size * 0.5 * sin(angle - PI * 0.5)).mul(0.25).add(location));
    ofEndShape(true);

    ofSetColor(no_fill_color);
    ofNoFill();
    ofBeginShape();
    ofVertex(glm.vec2(size * 0.5 * cos(angle + PI * 0.5), size * 0.5 * sin(angle + PI * 0.5)).mul(0.25).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle + PI * 0.5), size * 0.5 * sin(angle + PI * 0.5)).add(location));
    ofVertex(glm.vec2(size * 0.8 * cos(angle), size * 0.8 * sin(angle)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle - PI * 0.5), size * 0.5 * sin(angle - PI * 0.5)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle - PI * 0.5), size * 0.5 * sin(angle - PI * 0.5)).mul(0.25).add(location));
    ofEndShape();

    ofBeginShape();
    ofVertex(glm.vec2(size * 0.5 * cos(angle + PI * 0.5), size * 0.5 * sin(angle + PI * 0.5)).mul(0.25).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle + PI * 0.5), size * 0.5 * sin(angle + PI * 0.5)).mul(0.25).sub(glm.vec2(size * cos(angle), size * sin(angle)).mul(0.5)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle - PI * 0.5), size * 0.5 * sin(angle - PI * 0.5)).mul(0.25).sub(glm.vec2(size * cos(angle), size * sin(angle)).mul(0.5)).add(location));
    ofVertex(glm.vec2(size * 0.5 * cos(angle - PI * 0.5), size * 0.5 * sin(angle - PI * 0.5)).mul(0.25).add(location));
    ofEndShape();
  }
};

//ofSetupOpenGL(720, 720, OF_WINDOW);
ofRunApp(new ofApp());
