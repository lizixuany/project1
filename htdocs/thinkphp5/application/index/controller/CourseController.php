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
            $total = Course::with(['term', 'clazz', 'school'])->page($page, $size)->count();

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

    // 删除课表
    public function add() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
            $clazz = $data['clazz'];
            $term = $data['term'];

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($data['week']) || empty($data['week'])){
                return json(['status' => 'error', 'message' => 'week is required']);
            }
            if (!isset($school['id']) || empty($school['id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            if (!isset($term['id']) || empty($term['id'])){
                return json(['status' => 'error', 'message' => 'Clazz is required']);
            }if (!isset($clazz['id']) || empty($clazz['id'])){
                 return json(['status' => 'error', 'message' => 'Term is required']);
            }

            // 创建课程对象并保存
            $course = new Course();
            $course->school_id = $school['id'];
            $course->clazz_id = $clazz['id'];
            $course->term_id = $term['id'];
            $course->name = $data['name'];
            $course->week = $data['week'];

            $course->save();

            return json(['status' => 'success', 'id' => $course->id]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 编辑课表
    public function edit()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            $list = Course::with(['term', 'clazz', 'school'])->where('course.id', $data)->select();

            return json($list);
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 更新课表信息
    public function update()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
            $term = $data['term'];
            $clazz = $data['clazz'];

            $id = $data['id'];

            $course = Course::get($id);
            if (is_null($course)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

           // 验证必要字段
           if (!isset($data['name']) || empty($data['name'])){
               return json(['status' => 'error', 'message' => 'Course is required']);
           }
            if (!isset($data['week']) || empty($data['week'])){
               return json(['status' => 'error', 'message' => 'Week is required']);
            }
           if (!isset($school['id']) || empty($school['id'])){
               return json(['status' => 'error', 'message' => 'School is required']);
           }
           if (!isset($clazz['id']) || empty($clazz['id'])){
               return json(['status' => 'error', 'message' => 'Clazz is required']);
           }
           if (!isset($term['id']) || empty($term['id'])){
               return json(['status' => 'error', 'message' => 'Term is required']);
           }

            // 创建课表对象并保存
            $course->name = $data['name'];
            $course->week = $data['week'];
            $course->school_id = $school['id'];
            $course->clazz_id = $clazz['id'];
            $course->term_id = $term['id'];
            $course->save();

            return json(['status' => 'success', 'id' => $course->id]);

        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
