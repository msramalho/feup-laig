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
	//gl_FragColor.rgb = abs(coords.xyz)/3.0;
	//gl_FragColor.a = 1.0;
	vec4 color = texture2D(uSampler, vTextureCoord);

	gl_FragColor.rgb = timeFactor * saturatedColor.rgb + timeFactorInverted * goalColor.rgb;

	// color.r = saturatedColor.r * timeFactor + goalColor.r * timeFactorInverted;
	// color.g = saturatedColor.g * timeFactor + goalColor.g * timeFactorInverted;
	// color.b = saturatedColor.b * timeFactor + goalColor.b * timeFactorInverted;

	// gl_FragColor = color;
	gl_FragColor.a = 1.0;
}

/*
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {

	vec4 color = texture2D(uSampler, vTextureCoord);

	color.r = color.r * 0.393 + color.g *0.769 + color.b * 0.189;
	color.g = color.r * 0.349 + color.g *0.686 + color.b * 0.168;
	color.b = color.r * 0.272 + color.g *0.534 + color.b * 0.131;

	gl_FragColor = color;
}



*/