<?php
namespace app\index\controller;
use think\Controller;
use think\Db;   // 引用数据库操作类
use app\common\model\Course;
use app\common\model\Clazz;
use app\common\model\Term;
use think\request;

class CourseController extends Controller
{
    // 获取课程列表
    public function index()
    {
        try {
            $page = $this->request->get('page', 1);
            $size = $this->request->get('size', 10);

            $list = Course::with(['term', 'clazz', 'school'])->page($page, $size)->select();
            $total = Db::name('course')->count();

            $pageData = [
                'content' => $list,
                'number' => $page, // ThinkPHP的分页参数是从1开始的
                'size' => $size,
                'totalPages' => ceil($total / $size),
                'numberOfElements' => $total
            ];

            return json($pageData);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    // 删除课表
    public function delete()
    {
        try {
            $course = CourseController::getCourse();
            if (!$course) {
                return json(['status' => 'error', 'message' => '班级不存在']);
            }

            // 删除课表
            if ($course->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getCourse() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $course = Course::get($id);
        return $course;
    }
}
