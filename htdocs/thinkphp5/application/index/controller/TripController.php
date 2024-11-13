<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\Lesson;
use app\common\model\Course;
use app\common\model\User;
use app\common\model\Term;

class TripController extends Controller
{
    public function index() {
        try {
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            $school_id =$data['school'];
            $clazz_id =$data['clazz'];
            $term_id =$data['term'];
            $week =$data['weekNumber'];

            $condition = [];
            if ($school_id !== null) {
                $condition['school.id'] =$school_id;
            }
            if ($clazz_id !== null) {
                $condition['clazz.id'] =$clazz_id;
            }
            if ($term_id !== null) {
                $condition['term.id'] =$term_id;
            }

           $courses = Course::with(['term', 'clazz', 'school'])
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
               $lessons = Lesson::where('course_id', $item['course_id'])->select();
               $item['users'] = [];
               foreach ($lessons as $lesson) {
                   $user = User::get($lesson['user_id']); // 获取用户信息
                   if ($user) {
                       $item['users'][] = [
                           'user_id' => $user['id'],
                           'name' => $user['name'],
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
