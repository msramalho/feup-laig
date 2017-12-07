#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float goal_r;
uniform float goal_g;
uniform float goal_b;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);

	color =  vec4(goal_r, goal_g, goal_b, 1);

	gl_FragColor = color;
}


