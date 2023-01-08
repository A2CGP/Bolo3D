export const vertex = `#version 300 es
in vec3 position;
in vec3 normal;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
out vec3 vPosition;
out vec3 vNormal;
void main() {
  vec4 positionInWorld = uModelMatrix * vec4(position, 1.0);
  vPosition = positionInWorld.xyz;
  vNormal =  normal;
  gl_Position = uProjectionMatrix * uViewMatrix * positionInWorld;
}
`;

export const fragment = `#version 300 es
precision mediump float;
in vec3 vPosition;
in vec3 vNormal;
uniform vec3 uEye;
uniform vec3 uColor;
out vec4 outColor;
void main() {
  vec3 lightColor = vec3(1.0);
  vec3 lightPosition = vec3(10.0, 10.0, -5.0);
  float ambient = 0.5;
  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightPosition - vPosition);
  vec3 V = normalize(uEye - vPosition);
  float diffuse = 0.5 * max(dot(L, N), 0.0);
  float k = max(dot(normalize(L + V), N), 0.0);
  float specular = 0.2 * pow(k, 40.0);
  outColor = vec4(uColor * (ambient + diffuse) + lightColor * specular, 1.0);
}
`;

export default { vertex, fragment };