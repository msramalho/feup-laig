#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float colorr;
uniform float colorg;
uniform float colorb;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);

	color =  vec4(colorr, colorg, colorb, 1);

	gl_FragColor = color;
}


