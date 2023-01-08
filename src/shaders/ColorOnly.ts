export const vertex = `#version 300 es
in vec3 position;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
out vec3 vPosition;
void main() {
  vec4 positionInWorld = uModelMatrix * vec4(position, 1.0);
  vPosition = positionInWorld.xyz;
  gl_Position = uProjectionMatrix * uViewMatrix * positionInWorld;
}
`;

export const fragment = `#version 300 es
precision mediump float;
in vec3 vPosition;
uniform vec3 uColor;
out vec4 outColor;
void main() {
  vec4 fogColor = vec4(0);
  float alpha = 1.0 - exp(-0.005 * length(vPosition));
  outColor = mix(vec4(uColor, 1.0), fogColor, alpha);
}
`;

export default { vertex, fragment };