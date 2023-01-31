import EditMesh from './EditMesh';
import Geometry from './Geometry';

/**
 * 对象模式下的Mesh结构，只包含必要数据
 * Mesh的仿射变换、材质等等，通过SceneMesh结构定义
 */
class Mesh {
  // 编辑模式下的Mesh结构
  public editMesh: Nullable<EditMesh> = null;

  /**
   * 构造Mesh
   * @param geometry Mesh的几何数据
   */
  constructor(public geometry: Geometry) { }
}

export default Mesh;