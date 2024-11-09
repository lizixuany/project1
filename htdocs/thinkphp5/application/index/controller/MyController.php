<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\Lesson;
use app\common\model\Course;
use app\common\model\User;
use app\common\model\Term;

class MyController extends Controller
{
    public function index() {
        try {
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            // 定制查询信息
            $condition = [];

            // 获取学期ID
            $term_id = $data['term'];
            $school_id = $data['school'];
            $user_id = $data['user'];
            $week =$data['weekNumber'];

            if ($term_id !== null && $term_id !== '') {
                $condition['course.term_id'] = $term_id;
            }
            if ($school_id !== null && $school_id !== '') {
                $condition['course.school_id'] = $school_id;
            }
            if ($user_id === null && $user_id === '') {
                return json(['error' => '未存在用户信息'], 401);
            }

            $courses = Course::with(['term', 'school'])
                                ->where($condition)
                                ->select();
            $result = [];
            foreach ($courses as $course) {
                $courseWeeks = json_decode($course['week'], true);
                if ($week !== null && !in_array($week, $courseWeeks)) {
                    continue;
                }
                $day = $course['day'];
                $period = $course['period'];

                if (isset($course['name'])) {
                $result[] = [
                    'name' => $course['name'],
                    'day' => $day,
                    'period' => $period,
                    'course_id' => $course['id'] // 课程ID
                ];
               }
            }

            // 已经有了$result数组，其中包含了需要的course_id
             foreach ($result as &$item) {
                 $lessons = Lesson::where('course_id', $item['course_id'])
                            ->where('user_id', $user_id)  // 确保只获取当前用户的课程
                            ->select();
                 $item['users'] = [];
                 foreach ($lessons as $lesson) {
                     $user = User::get($lesson['user_id']); // 获取用户信息
                     if ($user) {
                         $item['users'][] = [
                             'name' => $user['name']
                         ];
                     }
                 }
             }
            return json(['status' => 'success', 'data' => $result]);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }
}
