<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\Lesson;
use app\common\model\Course;
use app\common\model\User;
use app\common\model\Term;

class LessonController extends Controller
{
    public function index() {
        try {
            $page = (int)$this->request->get('page', 1);
            $size = (int)$this->request->get('size', 5);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            // 定制查询信息
            $condition = [];

            // 获取学期ID
            $term_id = $data['term'];

            if ($term_id !== null && $term_id !== '') {
                $condition['course.term_id'] = $term_id;
            }

            $school_id = $data['school'];

            if ($school_id !== null && $school_id !== '') {
                $condition['course.school_id'] = $school_id;
            }

            $clazz_id = $data['clazz'];

            if ($clazz_id !== null && $clazz_id !== '') {
                $condition['course.clazz_id'] = $clazz_id;
            }

            // 获取课程ID
            $course_name = $data['course'];

            if ($course_name !== null && $course_name !== '') {
                $condition['course.name'] = ['like', '%' . $course_name . '%'];
            }

            $course_sory = $data['sory'];

            if ($course_sory !== null && $course_sory !== '') {
                $condition['course.sory'] = ['like', '%' . $course_sory . '%'];
            }
            
            // 获取用户ID
            $user_id = $data['userId'];

            if ($user_id === null && $user_id === '') {
                return json(['error' => '未存在用户信息'], 401);
            }

            // 获取用户
            $list = Lesson::with('course')
                    ->where('user_id', $user_id)
                    ->where($condition)
                    ->select();
            $total = Lesson::with('course')
                    ->where('user_id', $user_id)
                    ->where($condition)
                    ->count();
            
            $term = Term::with('school')->select();

            $pageData = [
                'content' => array_merge([$list], [$term]),
                'number' => $page, // ThinkPHP的分页参数是从1开始的
                'size' => $size,
                'totalPages' => ceil($total / $size),
                'numberOfElements' => $total
            ];

            foreach ($list as $lesson) {
                $lesson->course['week'] = json_decode($lesson->course['week']); // 获取周数
            }

            return json($pageData);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    public function add() {
        try {
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            $lessons = lesson::where('user_id', $data['user_id'])
                        ->where('course_id', $data['course_id'])
                        ->select();
            if($lessons) {
                return json(['error' => '课程已存在'], 401);
            }

            // 验证必要字段
            if (!isset($data['user_id']) || empty($data['user_id'])){
                return json(['status' => 'error', 'message' => 'user is required']);
            }
            if (!isset($data['course_id']) || empty($data['course_id'])){
                return json(['status' => 'error', 'message' => 'course is required']);
            }

            // 创建课程对象并保存
            $lesson = new Lesson();
            $lesson->course_id = $data['course_id'];
            $lesson->user_id = $data['user_id'];

            $lesson->save();
        return json(['status' => 'success', 'id' => $lesson->id]);
        } catch (Exception $e) {
            return json(['error' => '课程不存在'], 401);
        }
    }

    public function delete()
    {
        try {
            $lesson = LessonController::getLesson();
            if (!$lesson) {
                return json(['error' => '课程不存在'], 401);
            }

            // 删除课表
            if ($lesson->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getLesson() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $lesson = Lesson::get($id);
        return $lesson;
    }

    public function addLesson() {
        try {
            $request = Request::instance();
            $courseId = $request->param('courseId');
            $userId = $request->param('userId');

            $lessons = lesson::where('user_id', $userId)
                            ->where('course_id', $courseId)
                            ->select();
            if($lessons) {
                return json(['error' => '课程已存在'], 401);
            }

            // 验证必要字段
            if (!isset($userId) || empty($userId)){
                return json(['status' => 'error', 'message' => 'user is required']);
            }
            if (!isset($courseId) || empty($courseId)){
                return json(['status' => 'error', 'message' => 'course is required']);
            }

            // 创建课程对象并保存
            $lesson = new Lesson();
            $lesson->course_id = $courseId;
            $lesson->user_id = $userId;

            $lesson->save();
            return json(['status' => 'success', 'message' => '删除成功']);
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }       
    }
}
