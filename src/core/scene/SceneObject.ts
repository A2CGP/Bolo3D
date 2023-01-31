import { Matrix4 } from '@/math/Matrix';
import { Vector3 } from '@/math/Vector';
import { Color3 } from '@/math/Color';
import { PrimitiveMode } from '@/core/classes/Primitive';
import Mesh from '@/core/classes/Mesh';

export enum ShadeMode {
  Flat,
  Smooth,
}

/**
 * 所有可以添加到Scene中的对象的基类
 */
abstract class SceneObject {
  public static nextId = 1;
  
  public displayName: string;
  public id = SceneObject.nextId++;
  public primitiveMode = PrimitiveMode.Triangles;
  public shadeMode = ShadeMode.Flat;
  public selectable = true;
  public selected = false;

  public position = Vector3.zero();
  public scale = Vector3.one();

  public modelMatrix = Matrix4.identity();

  constructor() {
    this.displayName = `Object${this.id}`;
  }
}

export class SceneMesh extends SceneObject {
  public color = new Color3(0.8, 0.8, 0.8);

  public item: Mesh;

  constructor(mesh: Mesh) {
    super();
    this.item = mesh;
    this.displayName = `Mesh${this.id}`;
  }
}

export default SceneObject;