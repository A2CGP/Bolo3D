export const vertex = `#version 300 es
in vec3 position;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
void main() {
  vec4 clip = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position * 1.04, 1.0);
  gl_Position = vec4(clip);
}
`;

export const fragment = `#version 300 es
precision mediump float;
out vec4 outColor;
void main() {
  outColor = vec4(1.0, 0.63, 0.16, 1.0);
}
`;

export default { vertex, fragment };