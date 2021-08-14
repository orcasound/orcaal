!function(e){var t={};function n(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(s,i,function(t){return e[t]}.bind(null,i));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/orcaal/",n(n.s=3)}([,function(e,t,n){},,function(e,t,n){"use strict";n.r(t);n(1),n.p;const s=function(e,t,n,s){const i=document.getElementById("loadingSound");var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="arraybuffer",r.onload=function(){i.style.display="none",e.decodeAudioData(r.response,(function(e){n(e)}),(function(e){console.error(e)}))},s&&(r.onprogress=function(e){var t=e.loaded/e.total;s(t)}),r.send(),i.style.display="block"};window.isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),window.isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,window.isAndroid=/Android/.test(navigator.userAgent)&&!window.MSStream,window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)};var i=class{constructor(){window.AudioContext=window.AudioContext||window.webkitAudioContext;var e=new AudioContext,t=e.createAnalyser();t.fftSize=window.isMobile?1024:2048,t.smoothingTimeConstant=0;var n=e.createGain(),i=e.createBiquadFilter();i.Q.value=10,i.type="bandpass";var r=e.createGain();r.gain.value=1,n.connect(t),t.connect(r),r.connect(e.destination),this.context=e,this.mix=n,this.filterGain=r,this.analyser=t,this.buffer=null,s(this.context,"empty.mp3",function(e){var t=this.createSource_(e,!0);t.loop=!0,t.start(0)}.bind(this))}loadSrc(e){if(this.filterGain.gain.value=1,this.input)return this.input.disconnect(),void(this.input=null);s(this.context,e,function(e){this.buffer=e}.bind(this))}play(){this.source=this.createSource_(this.buffer,!0),this.source.start(0),this.loop||(this.playTimer=setTimeout(function(){this.stop()}.bind(this),2e3*this.buffer.duration))}live(){if("suspended"===this.context.state&&this.context.resume(),window.isIOS)window.parent.postMessage("error2","*"),console.log("cant use mic on ios");else{if(this.input)return this.input.disconnect(),void(this.input=null);var e=this;navigator.mediaDevices.getUserMedia({audio:!0}).then((function(t){e.onStream_(t)})).catch((function(){e.onStreamError_()})),this.filterGain.gain.value=0}}onStream_(e){var t=this.context.createMediaStreamSource(e);t.connect(this.mix),this.input=t,this.stream=e}onStreamError_(){}setLoop(e){this.loop=e}createSource_(e,t){var n=this.context.createBufferSource();return n.buffer=e,n.loop=t,n.connect(this.mix),n}setMicrophoneInput(){}stop(){if(this.source&&(this.source.stop(0),this.source=null,clearTimeout(this.playTimer),this.playTimer=null),this.input)return this.input.disconnect(),void(this.input=null)}getAnalyserNode(){return this.analyser}setBandpassFrequency(e){null==e?(console.log("Removing bandpass filter"),this.mix.disconnect(),this.mix.connect(this.analyser)):(this.bandpass.frequency.value=e,this.mix.disconnect(),this.mix.connect(this.bandpass),this.filterGain.connect(this.analyser))}playTone(e){this.osc||(this.osc=this.context.createOscillator(),this.osc.connect(this.mix),this.osc.type="sine",this.osc.start(0)),this.osc.frequency.value=e,this.filterGain.gain.value=.2}stopTone(){this.osc.stop(0),this.osc=null}};const r="\n// The common vertex shader used for the frequency and sonogram visualizations\nattribute vec3 gPosition;\nattribute vec2 gTexCoord0;\n\nvarying vec2 texCoord;\nvarying vec3 color;\n\nvoid main()\n{\n  gl_Position = vec4(gPosition.x, gPosition.y, gPosition.z, 1.0);\n  texCoord = gTexCoord0;\n  color = vec3(1.0);\n}",o="\n// Sonogram fragment shader\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvarying vec2 texCoord;\nvarying vec3 color;\n\nuniform sampler2D frequencyData;\nuniform vec4 foregroundColor;\nuniform vec4 backgroundColor;\nuniform float yoffset;\n\nvoid main()\n{\n    float x = pow(256.0, texCoord.x - 1.0);\n    float y = texCoord.y + yoffset;\n\n    vec4 sample = texture2D(frequencyData, vec2(x, y));\n    float k = sample.a;\n\n    // gl_FragColor = vec4(k, k, k, 1.0);\n    // Fade out the mesh close to the edges\n    float fade = pow(cos((1.0 - texCoord.y) * 0.5 * 3.1415926535), 0.5);\n    k *= fade;\n    gl_FragColor = backgroundColor + vec4(k * color, 1.0);\n}";var a=class{constructor(e,t,n){this.program=e.createProgram(),this.gl=e;var s=this.loadShader(this.gl.VERTEX_SHADER,t);if(null!=s){this.gl.attachShader(this.program,s),this.gl.deleteShader(s);var i=this.loadShader(this.gl.FRAGMENT_SHADER,n);if(null!=i){if(this.gl.attachShader(this.program,i),this.gl.deleteShader(i),this.gl.linkProgram(this.program),this.gl.useProgram(this.program),!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS)){var r=this.gl.getProgramInfoLog(this.program);return console.log("Error linking program:\n"+r),this.gl.deleteProgram(this.program),void(this.program=null)}for(var o=/(uniform|attribute)\s+\S+\s+(\S+)\s*;/g,a=null;null!=(a=o.exec(t+"\n"+n));){var l=a[2],h=l.replace(/_(.)/g,(function(e,t){return t.toUpperCase()}));"uniform"==a[1]?this[h+"Loc"]=this.getUniform(l):"attribute"==a[1]&&(this[h+"Loc"]=this.getAttribute(l))}}}}bind(){this.gl.useProgram(this.program)}loadShader(e,t){var n=this.gl.createShader(e);if(null==n)return null;if(this.gl.shaderSource(n,t),this.gl.compileShader(n),!this.gl.getShaderParameter(n,this.gl.COMPILE_STATUS)){var s=this.gl.getShaderInfoLog(n);return console.log("Error compiling shader:\n"+s),this.gl.deleteShader(n),null}return n}getAttribute(e){return this.gl.getAttribLocation(this.program,e)}getUniform(e){return this.gl.getUniformLocation(this.program,e)}};class l{constructor(){this.elements=Array(16),this.loadIdentity()}scale(e,t,n){return this.elements[0]*=e,this.elements[1]*=e,this.elements[2]*=e,this.elements[3]*=e,this.elements[4]*=t,this.elements[5]*=t,this.elements[6]*=t,this.elements[7]*=t,this.elements[8]*=n,this.elements[9]*=n,this.elements[10]*=n,this.elements[11]*=n,this}translate(e,t,n){return this.elements[12]+=this.elements[0]*e+this.elements[4]*t+this.elements[8]*n,this.elements[13]+=this.elements[1]*e+this.elements[5]*t+this.elements[9]*n,this.elements[14]+=this.elements[2]*e+this.elements[6]*t+this.elements[10]*n,this.elements[15]+=this.elements[3]*e+this.elements[7]*t+this.elements[11]*n,this}rotate(e,t,n,s){var i,r,o,a,h,c,d,u,g,m,f,y=Math.sqrt(t*t+n*n+s*s),v=Math.sin(e*Math.PI/180),p=Math.cos(e*Math.PI/180);y>0&&(i=(t/=y)*t,r=(n/=y)*n,o=(s/=y)*s,a=t*n,h=n*s,c=s*t,d=t*v,u=n*v,g=s*v,m=1-p,(f=new l).elements[0]=m*i+p,f.elements[1]=m*a-g,f.elements[2]=m*c+u,f.elements[3]=0,f.elements[4]=m*a+g,f.elements[5]=m*r+p,f.elements[6]=m*h-d,f.elements[7]=0,f.elements[8]=m*c-u,f.elements[9]=m*h+d,f.elements[10]=m*o+p,f.elements[11]=0,f.elements[12]=0,f.elements[13]=0,f.elements[14]=0,f.elements[15]=1,f=f.multiply(this),this.elements=f.elements);return this}frustum(e,t,n,s,i,r){var o,a=t-e,h=s-n,c=r-i;return i<=0||r<=0||a<=0||h<=0||c<=0||((o=new l).elements[0]=2*i/a,o.elements[1]=o.elements[2]=o.elements[3]=0,o.elements[5]=2*i/h,o.elements[4]=o.elements[6]=o.elements[7]=0,o.elements[8]=(t+e)/a,o.elements[9]=(s+n)/h,o.elements[10]=-(i+r)/c,o.elements[11]=-1,o.elements[14]=-2*i*r/c,o.elements[12]=o.elements[13]=o.elements[15]=0,o=o.multiply(this),this.elements=o.elements),this}perspective(e,t,n,s){var i=Math.tan(e/360*Math.PI)*n,r=i*t;return this.frustum(-r,r,-i,i,n,s)}ortho(e,t,n,s,i,r){var o=t-e,a=s-n,h=r-i,c=new l;return 0==o||0==a||0==h||(c.elements[0]=2/o,c.elements[12]=-(t+e)/o,c.elements[5]=2/a,c.elements[13]=-(s+n)/a,c.elements[10]=-2/h,c.elements[14]=-(i+r)/h,c=c.multiply(this),this.elements=c.elements),this}multiply(e){for(var t=new l,n=0;n<4;n++)t.elements[4*n+0]=this.elements[4*n+0]*e.elements[0]+this.elements[4*n+1]*e.elements[4]+this.elements[4*n+2]*e.elements[8]+this.elements[4*n+3]*e.elements[12],t.elements[4*n+1]=this.elements[4*n+0]*e.elements[1]+this.elements[4*n+1]*e.elements[5]+this.elements[4*n+2]*e.elements[9]+this.elements[4*n+3]*e.elements[13],t.elements[4*n+2]=this.elements[4*n+0]*e.elements[2]+this.elements[4*n+1]*e.elements[6]+this.elements[4*n+2]*e.elements[10]+this.elements[4*n+3]*e.elements[14],t.elements[4*n+3]=this.elements[4*n+0]*e.elements[3]+this.elements[4*n+1]*e.elements[7]+this.elements[4*n+2]*e.elements[11]+this.elements[4*n+3]*e.elements[15];return this.elements=t.elements,this}copy(){for(var e=new l,t=0;t<16;t++)e.elements[t]=this.elements[t];return e}get(e,t){return this.elements[4*e+t]}invert(){var e=this.get(2,2)*this.get(3,3),t=this.get(3,2)*this.get(2,3),n=this.get(1,2)*this.get(3,3),s=this.get(3,2)*this.get(1,3),i=this.get(1,2)*this.get(2,3),r=this.get(2,2)*this.get(1,3),o=this.get(0,2)*this.get(3,3),a=this.get(3,2)*this.get(0,3),l=this.get(0,2)*this.get(2,3),h=this.get(2,2)*this.get(0,3),c=this.get(0,2)*this.get(1,3),d=this.get(1,2)*this.get(0,3),u=this.get(2,0)*this.get(3,1),g=this.get(3,0)*this.get(2,1),m=this.get(1,0)*this.get(3,1),f=this.get(3,0)*this.get(1,1),y=this.get(1,0)*this.get(2,1),v=this.get(2,0)*this.get(1,1),p=this.get(0,0)*this.get(3,1),x=this.get(3,0)*this.get(0,1),b=this.get(0,0)*this.get(2,1),T=this.get(2,0)*this.get(0,1),E=this.get(0,0)*this.get(1,1),w=this.get(1,0)*this.get(0,1),S=e*this.get(1,1)+s*this.get(2,1)+i*this.get(3,1)-(t*this.get(1,1)+n*this.get(2,1)+r*this.get(3,1)),A=t*this.get(0,1)+o*this.get(2,1)+h*this.get(3,1)-(e*this.get(0,1)+a*this.get(2,1)+l*this.get(3,1)),R=n*this.get(0,1)+a*this.get(1,1)+c*this.get(3,1)-(s*this.get(0,1)+o*this.get(1,1)+d*this.get(3,1)),C=r*this.get(0,1)+l*this.get(1,1)+d*this.get(2,1)-(i*this.get(0,1)+h*this.get(1,1)+c*this.get(2,1)),D=1/(this.get(0,0)*S+this.get(1,0)*A+this.get(2,0)*R+this.get(3,0)*C),_=D*S,L=D*A,B=D*R,F=D*C,I=D*(t*this.get(1,0)+n*this.get(2,0)+r*this.get(3,0)-(e*this.get(1,0)+s*this.get(2,0)+i*this.get(3,0))),P=D*(e*this.get(0,0)+a*this.get(2,0)+l*this.get(3,0)-(t*this.get(0,0)+o*this.get(2,0)+h*this.get(3,0))),q=D*(s*this.get(0,0)+o*this.get(1,0)+d*this.get(3,0)-(n*this.get(0,0)+a*this.get(1,0)+c*this.get(3,0))),U=D*(i*this.get(0,0)+h*this.get(1,0)+c*this.get(2,0)-(r*this.get(0,0)+l*this.get(1,0)+d*this.get(2,0))),k=D*(u*this.get(1,3)+f*this.get(2,3)+y*this.get(3,3)-(g*this.get(1,3)+m*this.get(2,3)+v*this.get(3,3))),M=D*(g*this.get(0,3)+p*this.get(2,3)+T*this.get(3,3)-(u*this.get(0,3)+x*this.get(2,3)+b*this.get(3,3))),O=D*(m*this.get(0,3)+x*this.get(1,3)+E*this.get(3,3)-(f*this.get(0,3)+p*this.get(1,3)+w*this.get(3,3))),G=D*(v*this.get(0,3)+b*this.get(1,3)+w*this.get(2,3)-(y*this.get(0,3)+T*this.get(1,3)+E*this.get(2,3))),H=D*(m*this.get(2,2)+v*this.get(3,2)+g*this.get(1,2)-(y*this.get(3,2)+u*this.get(1,2)+f*this.get(2,2))),z=D*(b*this.get(3,2)+u*this.get(0,2)+x*this.get(2,2)-(p*this.get(2,2)+T*this.get(3,2)+g*this.get(0,2))),N=D*(p*this.get(1,2)+w*this.get(3,2)+f*this.get(0,2)-(E*this.get(3,2)+m*this.get(0,2)+x*this.get(1,2))),Y=D*(E*this.get(2,2)+y*this.get(0,2)+T*this.get(1,2)-(b*this.get(1,2)+w*this.get(2,2)+v*this.get(0,2)));return this.elements[0]=_,this.elements[1]=L,this.elements[2]=B,this.elements[3]=F,this.elements[4]=I,this.elements[5]=P,this.elements[6]=q,this.elements[7]=U,this.elements[8]=k,this.elements[9]=M,this.elements[10]=O,this.elements[11]=G,this.elements[12]=H,this.elements[13]=z,this.elements[14]=N,this.elements[15]=Y,this}inverse(){return this.copy().invert()}transpose(){var e=this.elements[1];return this.elements[1]=this.elements[4],this.elements[4]=e,e=this.elements[2],this.elements[2]=this.elements[8],this.elements[8]=e,e=this.elements[3],this.elements[3]=this.elements[12],this.elements[12]=e,e=this.elements[6],this.elements[6]=this.elements[9],this.elements[9]=e,e=this.elements[7],this.elements[7]=this.elements[13],this.elements[13]=e,e=this.elements[11],this.elements[11]=this.elements[14],this.elements[14]=e,this}loadIdentity(){for(var e=0;e<16;e++)this.elements[e]=0;return this.elements[0]=1,this.elements[5]=1,this.elements[10]=1,this.elements[15]=1,this}}var h=l;var c=class{constructor(e){this.xRot=0,this.yRot=0,this.zRot=0,this.scaleFactor=3,this.dragging=!1,this.curX=0,this.curY=0,e&&(this.canvas_=e)}};var d=null,u=null,g=null;var m=class{constructor(e){this.analysisType=2,this.sonogram3DWidth=256,this.sonogram3DHeight=256,this.sonogram3DGeometrySize=9.5,this.TEXTURE_HEIGHT=256,this.yoffset=0,this.backgroundColor=[.08,.08,.08,1],this.foregroundColor=[0,.7,0,1],this.canvas=e,this.initGL()}getAvailableContext(e){if(e.getContext){try{const t=e.getContext("webgl2",{antialias:!0});if(null!==t)return t}catch(e){console.log(e.mesage)}try{const t=e.getContext("webgl",{antialias:!0});if(null!==t)return t}catch(e){console.log(e.mesage)}}return null}initGL(){d=new h,u=new h,g=new h;var e=this.sonogram3DWidth,t=this.sonogram3DHeight,n=this.sonogram3DGeometrySize,s=this.backgroundColor,i=this.canvas,l=this.getAvailableContext(i);this.gl=l,this.has3DVisualizer=l.getParameter(l.MAX_VERTEX_TEXTURE_IMAGE_UNITS)>0,this.has3DVisualizer||2!=this.analysisType||(this.analysisType=0);var m=new c(i);this.cameraController=m,m.xRot=-180,m.yRot=270,m.zRot=90,m.xT=0,m.yT=-2,m.zT=-2,l.clearColor(s[0],s[1],s[2],s[3]),l.enable(l.DEPTH_TEST);var f=new Float32Array([1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0]),y=new Float32Array([1,1,0,1,0,0,1,1,0,0,1,0]),v=f.byteLength;this.vboTexCoordOffset=v;var p=l.createBuffer();this.vbo=p,l.bindBuffer(l.ARRAY_BUFFER,p),l.bufferData(l.ARRAY_BUFFER,v+y.byteLength,l.STATIC_DRAW),l.bufferSubData(l.ARRAY_BUFFER,0,f),l.bufferSubData(l.ARRAY_BUFFER,v,y);var x=e*t;if(x>65536)throw"Sonogram 3D resolution is too high: can only handle 65536 vertices max";f=new Float32Array(3*x),y=new Float32Array(2*x);for(var b=0;b<t;b++)for(var T=0;T<e;T++)f[3*(e*b+T)+0]=n*(T-e/2)/e,f[3*(e*b+T)+1]=0,f[3*(e*b+T)+2]=n*(b-t/2)/t,y[2*(e*b+T)+0]=T/(e-1),y[2*(e*b+T)+1]=b/(t-1);var E=f.byteLength;this.vbo3DTexCoordOffset=E;var w=l.createBuffer();this.sonogram3DVBO=w,l.bindBuffer(l.ARRAY_BUFFER,w),l.bufferData(l.ARRAY_BUFFER,E+y.byteLength,l.STATIC_DRAW),l.bufferSubData(l.ARRAY_BUFFER,0,f),l.bufferSubData(l.ARRAY_BUFFER,E,y);var S=(e-1)*(t-1)*6;this.sonogram3DNumIndices=S-3600;var A=new Uint16Array(S),R=0;for(let n=0;n<t-1;n++)for(let t=0;t<e-1;t++)A[R++]=n*e+t,A[R++]=n*e+t+1,A[R++]=(n+1)*e+t+1,A[R++]=n*e+t,A[R++]=(n+1)*e+t+1,A[R++]=(n+1)*e+t;var C=l.createBuffer();this.sonogram3DIBO=C,l.bindBuffer(l.ELEMENT_ARRAY_BUFFER,C),l.bufferData(l.ELEMENT_ARRAY_BUFFER,A,l.STATIC_DRAW),this.frequencyShader=new a(l,r,"\n// Frequency fragment shader\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvarying vec2 texCoord;\nuniform sampler2D frequencyData;\nuniform vec4 foregroundColor;\nuniform vec4 backgroundColor;\nuniform float yoffset;\n\nvoid main()\n{\n    vec4 sample = texture2D(frequencyData, vec2(texCoord.x, yoffset));\n    if (texCoord.y > sample.a) {\n        // if (texCoord.y > sample.a + 1 || texCoord.y < sample.a - 1) {\n        discard;\n    }\n    float x = texCoord.y / sample.a;\n    x = x * x * x;\n    gl_FragColor = vec4(1.0); //mix(foregroundColor, backgroundColor, x);\n}"),this.waveformShader=new a(l,r,"\n// Waveform fragment shader\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nvarying vec2 texCoord;\nuniform sampler2D frequencyData;\nuniform vec4 foregroundColor;\nuniform vec4 backgroundColor;\nuniform float yoffset;\n\nvoid main()\n{\n    vec4 sample = texture2D(frequencyData, vec2(texCoord.x, yoffset));\n    if (texCoord.y > sample.a + 0.01 || texCoord.y < sample.a - 0.01) {\n        discard;\n    }\n    float x = (texCoord.y - sample.a) / 0.01;\n    x = x * x * x;\n    gl_FragColor = mix(foregroundColor, backgroundColor, x);\n}"),this.sonogramShader=new a(l,r,o),this.has3DVisualizer&&(this.sonogram3DShader=new a(l,"\n// The vertex shader used for the 3D sonogram visualization\nattribute vec3 gPosition;\nattribute vec2 gTexCoord0;\nuniform sampler2D vertexFrequencyData;\nuniform float vertexYOffset;\nuniform mat4 worldViewProjection;\nuniform float verticalScale;\n\nvarying vec2 texCoord;\nvarying vec3 color;\n\n\n\n/**\n * Conversion based on Wikipedia article\n * @see http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB\n */\nvec3 convertHSVToRGB(in float hue, in float saturation, in float lightness) {\n  float chroma = lightness * saturation;\n  float hueDash = hue / 60.0;\n  float x = chroma * (1.0 - abs(mod(hueDash, 2.0) - 1.0));\n  vec3 hsv = vec3(0.0);\n\n  if(hueDash < 1.0) {\n    hsv.r = chroma;\n    hsv.g = x;\n  } else if (hueDash < 2.0) {\n    hsv.r = x;\n    hsv.g = chroma;\n  } else if (hueDash < 3.0) {\n    hsv.g = chroma;\n    hsv.b = x;\n  } else if (hueDash < 4.0) {\n    hsv.g = x;\n    hsv.b = chroma;\n  } else if (hueDash < 5.0) {\n    hsv.r = x;\n    hsv.b = chroma;\n  } else if (hueDash < 6.0) {\n    hsv.r = chroma;\n    hsv.b = x;\n  }\n\n  return hsv;\n}\n\n\nvoid main()\n{\n    float x = pow(256.0, gTexCoord0.x - 1.0);\n    vec4 sample = texture2D(vertexFrequencyData, vec2(x, gTexCoord0.y + vertexYOffset));\n    vec4 newPosition = vec4(gPosition.x, gPosition.y + verticalScale * sample.a, gPosition.z, 1.0);\n    gl_Position = worldViewProjection * newPosition;\n    texCoord = gTexCoord0;\n\n    float hue = 360.0 - ((newPosition.y / verticalScale) * 360.0);\n    color = convertHSVToRGB(hue, 1.0, 1.0);\n}",o))}initByteBuffer(){var e=this.gl,t=this.TEXTURE_HEIGHT;if(!this.freqByteData||this.freqByteData.length!=this.analyser.frequencyBinCount){var n=new Uint8Array(this.analyser.frequencyBinCount);this.freqByteData=n,this.texture&&(e.deleteTexture(this.texture),this.texture=null);var s=e.createTexture();this.texture=s,e.bindTexture(e.TEXTURE_2D,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.REPEAT),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR);var i=new Uint8Array(n.length*t);e.texImage2D(e.TEXTURE_2D,0,e.ALPHA,n.length,t,0,e.ALPHA,e.UNSIGNED_BYTE,i)}}setAnalysisType(e){(this.has3DVisualizer||2!=e)&&(this.analysisType=e)}doFrequencyAnalysis(){var e=this.freqByteData;switch(this.analysisType){case 0:this.analyser.smoothingTimeConstant=.75,this.analyser.getByteFrequencyData(e);break;case 1:case 2:this.analyser.smoothingTimeConstant=0,this.analyser.getByteFrequencyData(e);break;case 3:this.analyser.smoothingTimeConstant=.1,this.analyser.getByteTimeDomainData(e)}this.drawGL()}drawGL(){var e=this.canvas,t=this.gl,n=this.vbo,s=this.vboTexCoordOffset,i=this.sonogram3DVBO,r=this.vbo3DTexCoordOffset,o=this.sonogram3DGeometrySize,a=this.sonogram3DNumIndices,l=this.sonogram3DHeight,c=this.freqByteData,m=this.texture,f=this.TEXTURE_HEIGHT,y=this.frequencyShader,v=this.waveformShader,p=this.sonogramShader,x=this.sonogram3DShader;t.bindTexture(t.TEXTURE_2D,m),t.pixelStorei(t.UNPACK_ALIGNMENT,1),1!=this.analysisType&&2!=this.analysisType&&(this.yoffset=0),t.texSubImage2D(t.TEXTURE_2D,0,0,this.yoffset,c.length,1,t.ALPHA,t.UNSIGNED_BYTE,c),1!=this.analysisType&&2!=this.analysisType||(this.yoffset=(this.yoffset+1)%f);var b,T,E,w,S,A,R,C=this.yoffset;switch(this.analysisType){case 0:case 3:t.bindBuffer(t.ARRAY_BUFFER,n),(R=0==this.analysisType?y:v).bind(),b=R.gPositionLoc,T=R.gTexCoord0Loc,E=R.frequencyDataLoc,w=R.foregroundColorLoc,S=R.backgroundColorLoc,t.uniform1f(R.yoffsetLoc,.5/(f-1)),A=s;break;case 1:t.bindBuffer(t.ARRAY_BUFFER,n),p.bind(),b=p.gPositionLoc,T=p.gTexCoord0Loc,E=p.frequencyDataLoc,w=p.foregroundColorLoc,S=p.backgroundColorLoc,t.uniform1f(p.yoffsetLoc,C/(f-1)),A=s;break;case 2:t.bindBuffer(t.ARRAY_BUFFER,i),x.bind(),b=x.gPositionLoc,T=x.gTexCoord0Loc,E=x.frequencyDataLoc,w=x.foregroundColorLoc,S=x.backgroundColorLoc,t.uniform1i(x.vertexFrequencyDataLoc,0);var D=this.yoffset/(f-1);t.uniform1f(x.yoffsetLoc,D);var _=Math.floor(D*(l-1))/(l-1);t.uniform1f(x.vertexYOffsetLoc,_),t.uniform1f(x.verticalScaleLoc,o/3.5),g.loadIdentity(),g.perspective(55,e.width/e.height,1,100),u.loadIdentity(),u.translate(0,0,-9),d.loadIdentity(),d.rotate(this.cameraController.xRot,1,0,0),d.rotate(this.cameraController.yRot,0,1,0),d.rotate(this.cameraController.zRot,0,0,1),d.translate(this.cameraController.xT,this.cameraController.yT,this.cameraController.zT);var L=new h;L.multiply(d),L.multiply(u),L.multiply(g),t.uniformMatrix4fv(x.worldViewProjectionLoc,!1,L.elements),A=r}E&&t.uniform1i(E,0),w&&t.uniform4fv(w,this.foregroundColor),S&&t.uniform4fv(S,this.backgroundColor),t.enableVertexAttribArray(b),t.vertexAttribPointer(b,3,t.FLOAT,!1,0,0),t.enableVertexAttribArray(T),t.vertexAttribPointer(T,2,t.FLOAT,!1,0,A),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),0==this.analysisType||3==this.analysisType||1==this.analysisType?t.drawArrays(t.TRIANGLES,0,6):2==this.analysisType&&t.drawElements(t.TRIANGLES,a,t.UNSIGNED_SHORT,0),t.disableVertexAttribArray(b),t.disableVertexAttribArray(T)}setAnalyserNode(e){this.analyser=e}getAnalysisType(){return this.analysisType}};const f=document.querySelector("#spectrogram"),y=document.querySelector("#legend"),v=19.86218362749959,p=.0003457334974465534,x={cxRot:90,prevX:0,isRendering:!1,player:null,analyserView:null,canvas:null,attached:function(){x.onResize_(),x.init_(),window.addEventListener("resize",x.onResize_.bind(x))},load:function(e){x.player.loadSrc(e)},stop:function(){x.player.stop()},isPlaying:function(){return!!this.player.source},stopRender:function(){x.isRendering=!1},startRender:function(){x.isRendering||(x.isRendering=!0,x.draw_())},loopChanged:function(e){x.player.setLoop(e)},play:function(){x.player.play()},live:function(){x.player.live()},init_:function(){var e=new i,t=e.getAnalyserNode(),n=new m(this.canvas);n.setAnalyserNode(t),n.initByteBuffer(),x.player=e,x.analyserView=n},onResize_:function(){x.canvas=f,f.width=window.innerWidth,f.height=window.innerHeight,y.width=window.innerWidth,y.height=window.innerHeight-158,x.drawLegend_()},draw_:function(){x.isRendering&&(x.analyserView.doFrequencyAnalysis(),requestAnimationFrame(x.draw_.bind(x)))},drawLegend_:function(){var e=y.getContext("2d"),t=y.width-10;e.fillStyle="#FFFFFF",e.font="14px Roboto",e.textAlign="right",e.textBaseline="middle",e.fillText("20,000 Hz -",t,y.height-x.freqToY(2e4)),e.fillText("2,000 Hz -",t,y.height-x.freqToY(2e3)),e.fillText("200 Hz -",t,y.height-x.freqToY(200)),e.fillText("20 Hz -",t,y.height-x.freqToY(20))},freqStart:20,freqEnd:2e4,padding:30,yToFreq:function(e){var t=x.padding,n=f.height;if(n<2*t||e<t||e>n-t)return null;var s=1-(e-t)/(n-t),i=x.freqStart+(x.freqEnd-x.freqStart)*s;return v*Math.exp(p*i)},freqToY:function(e){var t=Math.log(e/v)/p,n=f.height,s=x.padding,i=(t-x.freqStart)/(x.freqEnd-x.freqStart);return x.padding+i*(n-2*s)},easeInOutCubic:function(e,t,n,s){return(e/=s/2)<1?n/2*e*e*e+t:n/2*((e-=2)*e*e+2)+t},easeInOutQuad:function(e,t,n,s){return(e/=s/2)<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t},easeInOutQuint:function(e,t,n,s){return(e/=s/2)<1?n/2*e*e*e*e*e+t:n/2*((e-=2)*e*e*e*e+2)+t},easeInOutExpo:function(e,t,n,s){return 0==e?t:e==s?t+n:(e/=s/2)<1?n/2*Math.pow(2,10*(e-1))+t:n/2*(2-Math.pow(2,-10*--e))+t}};var b=x;var T;T=()=>{const e=document.getElementById("play-pause");let t=[],n=[],s=new Set,i=0;window.parent.postMessage("ready","*"),b.attached(),b.startRender(),b.loopChanged(!0);const r=function(){if(document.getElementById("progress-label").textContent=i+"/5",document.getElementById("progress").style.width=20*i+"%",b.stop(),e.classList.remove("playing"),5===i)return document.getElementById("blurred-background").style.display="block",void(document.getElementById("labeled-by-container").style.display="block");b.load(t[i].audioUrl),document.getElementById("timestamp").innerText=t[i].timestamp,document.getElementById("duration").innerText=t[i].duration+" seconds",document.getElementById("predicted-orca").innerText=t[i].orca?"One orca detected":"No orcas detected",document.getElementById("confidence").innerText=t[i].confidence.toFixed(2)+"% confidence",document.getElementById("location").innerText=t[i].location},o=function(){fetch("https://35.80.163.168:5000/uncertainties").then(e=>e.json()).then(e=>{t=e,console.log(t),s=new Set(t.map(e=>e.id)),r()}).catch(e=>console.error("Fetch Error!",e)),i=0,n=[]};o(),e.addEventListener("click",()=>{e.classList.contains("playing")?(e.classList.remove("playing"),b.stop()):(e.classList.add("playing"),b.play())});const a=function(){e.classList.remove("playing"),b.stop()};window.addEventListener("blur",(function(){a()})),document.addEventListener("visibilitychange",(function(){a()})),document.getElementById("view-details").addEventListener("click",()=>{const e=document.getElementById("details-container"),t=document.getElementById("expand-more"),n=document.getElementById("expand-less"),s=document.getElementById("view-details-text");""==e.style.maxHeight?(e.style.maxHeight="15rem",t.style.display="none",n.style.display="block",s.textContent="Hide Details"):(e.style.maxHeight="",t.style.display="block",n.style.display="none",s.textContent="View Details")});const l=function(e,o){n.push({id:t[i].id,audioUrl:t[i].audioUrl,orca:e,extraLabel:o||""}),s.delete(t[i].id),i+=1,r()},h=function(e,t){if(!e)return;const n=e.querySelector("label");n&&(t?e.classList.add("button-hovered"):e.classList.remove("button-hovered"),n.style.visibility=t?"visible":"hidden")};document.querySelectorAll(".expandable").forEach(e=>{let t="";e.addEventListener("touchstart",()=>{window.blockMenuHeaderScroll=!0,e.classList.add("hovered"),e.querySelector(".expanded-box").style.display="flex"}),e.addEventListener("touchmove",e=>{window.blockMenuHeaderScroll&&e.preventDefault();let n=e.touches[0].pageX,s=e.touches[0].pageY;const i=document.elementFromPoint(n,s);i.classList.contains("label-btn")&&t!==i&&(h(t,!1),h(i,!0),t=i)}),e.addEventListener("touchend",()=>{h(t,!1);let n=!1;"orca"===e.id&&(n=!0),l(n,t.id),e.querySelector(".expanded-box").style.display="none",e.classList.remove("hovered"),t=""})}),window.isMobile||document.querySelectorAll(".label-btn").forEach(e=>e.addEventListener("click",()=>{let t=!1;t="orca"===e.parentElement.parentElement.id||"orca"===e.parentElement.id,l(t,e.id)})),document.getElementById("skip").addEventListener("click",()=>{i+=1,r()}),document.getElementById("submit-form").addEventListener("click",()=>{const e=document.querySelector("input[name=labeled-by]:checked"),t={labels:n,expertiseLevel:e.value,unlabeled:[...s]};fetch("https://35.80.163.168:5000/labeledfiles",{method:"POST",body:JSON.stringify(t),headers:{"Content-Type":"application/json"}}).catch(e=>console.error("Fetch Error!",e)),document.getElementById("blurred-background").style.display="none",document.getElementById("labeled-by-container").style.display="none",o()}),document.getElementById("back-btn").addEventListener("click",()=>{window.location.href="."}),window.onunload=()=>{const e={labels:[],expertiseLevel:"",unlabeled:[...s]};navigator.sendBeacon("http://35.80.163.168:5000/labeledfiles",JSON.stringify(e))}},"loading"!=document.readyState?T():document.addEventListener("DOMContentLoaded",T)}]);
