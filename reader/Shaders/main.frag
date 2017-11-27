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

uniform float saturated_r;
uniform float saturated_g;
uniform float saturated_b;


uniform float timeFactor;
uniform float timeFactorInverted;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);

	vec4 goalColor = vec4(goal_r, goal_g, goal_b, 1);
	vec4 saturatedColor = vec4(saturated_r, saturated_g, saturated_b, 1);

	color.rgb = timeFactor * saturatedColor.rgb + timeFactorInverted * goalColor.rgb;

	gl_FragColor = color;
}