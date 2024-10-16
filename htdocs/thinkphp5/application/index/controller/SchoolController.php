<?php
namespace app\index\controller;
use think\Controller;
use app\common\model\School;
use think\request;

class SchoolController extends Controller
{
    // 获取学校列表
    public function index()
    {
        $schools = School::all();
        return json($schools);
    }

    // 新增学校
    public function add()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'Name is required']);
            }
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
            $id = Request::instance()->param('id'); // 从请求中获取id参数
            $school = School::get($id);
            if ($school) {
                // 将学校信息返回给前端编辑表单
                return json(['status' => 'success', 'data' => $school]);
            } else {
                return json(['status' => 'error', 'message' => 'School not found']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 更新学校信息
    public function update()
    {
        try{
            $id = Request::instance()->param('id'); // 从请求中获取id参数
            $name = Request::instance()->param('name'); // 从请求中获取name参数
            $school = School::get($id);
            if ($school) {
                // 数据验证
                if (!isset($name) || empty($name)) {
                    return json(['status' => 'error', 'message' => 'Name is required']);
                }

                $school->name = $name;
                $school->save();
                return json(['status' => 'success', 'id' => $school->id]);
            } else {
                return json(['status' => 'error', 'message' => 'School not found']);
            }
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
