<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\Clazz;
use app\common\model\School;
use think\Route;

class ClazzController extends Controller
{
    public function index() {
        try {
            $page = $this->request->get('page', 1);
            $size = $this->request->get('size', 10);
          
            $list = Clazz::with('school')->page($page, $size)->select();
            $total = Db::name('Clazz')->count();
          
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
            if (!isset($school['school_id']) || empty($school['school_id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            
            // 创建学期对象并保存
            $clazz = new Clazz();
            $clazz->school_id = $school['school_id'];
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
            
            $list = Clazz::with('school')->where('clazz_id', $data)->select();
            
            return json($list);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function updata() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
            var_dump($data['name']);
            var_dump($data['clazz_id']);
            var_dump($school['school_id']);
            
            $id = $data['clazz_id'];
            
            // 获取传入的班级信息
            $clazz = Clazz::get($id);
            if (is_null($clazz)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($school['school_id']) || empty($school['school_id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            
            // 创建学期对象并保存
            // $clazz = new Clazz();
            $clazz->school_id = $school['school_id'];
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
