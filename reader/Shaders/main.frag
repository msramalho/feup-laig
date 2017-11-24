#ifdef GL_ES
precision highp float;
#endif

varying vec4 coords;
varying vec4 normal;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float timeFactor;
uniform float timeFactorInverted;
varying vec4 goalColor;
varying vec4 saturatedColor;

void main() {
	vec4 color;// = texture2D(uSampler, vTextureCoord);

	//the new color is a factor of the saturated and the goal colors, since timeFactor is varying between 0 and 1, and timeFactorInverted between 1 and 0, this should give the resulting match of colors:
	color = timeFactor * saturatedColor + timeFactorInverted * goalColor;

	//however it is not working. Furthermore even simply doing:
	// gl_FragColor = saturatedColor;
	// or even
	// gl_FragColor = goalColor;
	// has no effect and i cannot seem to understang why, there are plenty of examples for instance the sepia.frag file which uses the texture3.vert, and a simple copy+paste of those two files into our main.* does not seem to work :(


	gl_FragColor = color;
	gl_FragColor.a = 1.0;
}