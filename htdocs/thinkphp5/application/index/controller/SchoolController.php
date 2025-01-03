<?php
namespace app\index\controller;
use think\Controller;
use think\Db;   // 引用数据库操作类
use app\common\model\School;
use app\common\model\Term;
use app\common\model\Clazz;
use think\request;

class SchoolController extends Controller
{
    // 获取学校列表
    public function index()
    {
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
             
            // 定制查询信息
            $condition = [];

            // 获取学校名称
            $name = $data['name'];

            if ($name !== null && $name !== '') {
                $condition['name'] = ['like', '%' . $name . '%'];
            }
            $list = School::where($condition)
                    ->page($page, $size)
                    ->select();
            $total = School::where($condition)
                    ->page($page, $size)
                    ->count();

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

    // 新增学校
    public function add()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'Name is required']);
            }

            // 获取相应账号的数据
            $school = School::where('name', $data['name'])->find();

            if ($school) {
                return json(['error' => '学校已存在'], 401);
            }

            // 创建学校对象并保存
            $school = new School();
            $school->name = $data['name'];

            $school->save();

            return json(['status' => 'success', 'id' => $school->id]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 编辑学校信息
    public function edit()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
        
            $list = Db::name('school')->where('id', $data)->select();

            return json($list);

        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 更新学校信息
    public function update()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            
            $id = $data['id'];
            
            // 获取传入的班级信息
            $school = School::get($id);
            if (is_null($school)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $results = School::where('name', $data['name'])->select();

            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '学校已存在'], 401);
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
            $school->id = $data['id'];
            $school->name = $data['name'];
            
            $school->save();

            return json(['status' => 'success', 'id' => $school->id]);
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除学校
    public function delete()
    {
        try {
            $school = SchoolController::getSchool();
            if (!$school) {
                return json(['status' => 'error', 'message' => '学校不存在']);
            }

            $clazzes = Clazz::where('school_id', $school['id'])->select();
            if ($clazzes) {
                return json(['error' => '该学校仍有班级未清空'], 401); 
            }

            $terms = Term::where('school_id', $school['id'])->select();
            if ($terms) {
                return json(['error' => '该学校仍有学期未清空'], 401); 
            }

            // 删除学校
            if ($school->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getSchool() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $school = School::get($id);

        return $school;
    }
}
