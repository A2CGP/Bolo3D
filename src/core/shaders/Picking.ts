export const vertex = `#version 300 es
in vec3 position;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(position, 1.0);
}
`;

export const fragment = `#version 300 es
precision mediump float;
uniform vec4 uColor;
out vec4 outColor;
void main() {
  outColor = uColor;
}
`;

export default { vertex, fragment };