<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\Clazz;
use app\common\model\School;
use app\common\model\User;
use think\Route;

class ClazzController extends Controller
{
    public function index() {
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            // 定制查询信息
            $condition = [];
            
            // 获取学校ID
            $school_id = $data['school'];

            if ($school_id !== null && $school_id !== '') {
                $condition['school.id'] = $school_id;
            }

            // 获取班级名称
            $name = $data['name'];

            if ($name !== null && $name !== '') {
                $condition['clazz.name'] = ['like', '%' . $name . '%'];
            }
           
            $list = Clazz::with('school')->where($condition)->page($page, $size)->select();
            $total = Clazz::with('school')->where($condition)->page($page, $size)->count();
          
            $pageData = [
              'content' => $list,
              'number' => $page, // ThinkPHP的分页参数是从1开始的
              'size' => $size,
              'totalPages' => ceil($total / $size),
              'numberOfElements' => $total,
            ];
          
            return json($pageData);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    public function add() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
           
            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($school['id']) || empty($school['id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }

            // 获取相应账号的数据
            $clazz = Clazz::where('name', $data['name'])->where('school_id', $school['id'])->find();

            if ($clazz) {
                return json(['error' => '班级已存在'], 401);
            }

            
            // 创建班级对象并保存
            $clazz = new Clazz();
            $clazz->school_id = $school['id'];
            $clazz->name = $data['name'];
            
            $clazz->save();

            return json(['status' => 'success', 'id' => $clazz->school_id]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function edit() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = Clazz::with('school')->where('clazz.id', $data)->select();
            
            return json($list);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function update() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
            
            $id = $data['id'];
            
            // 获取传入的班级信息
            $clazz = Clazz::get($id);
            if (is_null($clazz)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $result = Clazz::where('name', $data['name'])->where('school_id', $school['id'])->select();

            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '班级已存在'], 401);
                    } 
                }
            }

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($school['id']) || empty($school['id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            
            // 创建学期对象并保存
            $clazz->school_id = $school['id'];
            $clazz->name = $data['name'];
            
            $clazz->save();

            return json(['status' => 'success', 'id' => $clazz->school_id]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除班级
    public function delete()
    {
        try {
            $clazz = ClazzController::getClazz();
            if (!$clazz) {
                return json(['status' => 'error', 'message' => '班级不存在']);
            }

            $users = User::where('clazz_id', $clazz['id'])->select();
            if ($users) {
                return json(['error' => '该班级仍有用户未清空'], 401); 
            }

            

            // 删除班级
            if ($clazz->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getClazz() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $clazz = Clazz::get($id);
        return $clazz;
    }
}
