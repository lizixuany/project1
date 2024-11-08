<?php
namespace app\index\controller;
use think\Controller;
use think\Db;   // 引用数据库操作类
use app\common\model\Course;
use app\common\model\Clazz;
use app\common\model\Term;
use app\common\model\Lesson;
use app\common\model\User;
use think\request;

class CourseController extends Controller
{
    // 获取课程列表
    public function index()
    {
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

            // 获取班级ID
            $clazz_id = $data['clazz'];

            if ($clazz_id !== null && $clazz_id !== '') {
                $condition['clazz.id'] = $clazz_id;
            }

            // 获取学期ID
            $term_id = $data['term'];

            if ($term_id !== null && $term_id !== '') {
                $condition['term.id'] = $term_id;
            }

            // 获取课程名称
            $name = $data['name'];

            if ($name !== null && $name !== '') {
                $condition['course.name'] = ['like', '%' . $name . '%'];
            }

            $list = Course::with(['term', 'clazz', 'school'])->where($condition)->page($page, $size)->select();
            $total = Course::with(['term', 'clazz', 'school'])->where($condition)->page($page, $size)->count();

            $pageData = [
                'content' => $list,
                'number' => $page, // ThinkPHP的分页参数是从1开始的
                'size' => $size,
                'totalPages' => ceil($total / $size),
                'numberOfElements' => $total
            ];

            foreach ($list as $course) {
                $course['week'] = json_decode($course['week']); // 获取周数
            }

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

    // 新增呢个课表
    public function add() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
            $clazz = $data['clazz'];
            $term = $data['term'];
            $day = $data['day'];
            $period = $data['period'];
            
            // 获取相应账号的数据
            $courses = Course::where('name', $data['name'])
                            ->where('school_id', $school['id'])
                            ->where('clazz_id', $clazz['id'])
                            ->select();

            if ($courses) {               
                return json(['error' => '课程已存在'], 401);                   
            }

            $times = Course::where('school_id', $school['id'])
                            ->where('clazz_id', $clazz['id'])
                            ->where('term_id', $term['id'])
                            ->where('day', $data['day'])
                            ->where('period', $data['period'])
                            ->select();
            
            if ($times) {      
                foreach ($times as $time) {
                    // 将string '[1, 2]' 转化为 array [1, 2]
                    $timeWeek = explode(', ', trim($time->week, '[]'));
                    $intWeek = array_map('intval', $timeWeek);
                    // 判断是否有相同元素
                    $sameData = array_intersect($data['week'], $intWeek);
                    if (!empty($sameData)) {
                        return json(['error' => '与已有课程的时间冲突']);
                    }
                }         
                return json(['error' => '课程已存在'], 401);                   
            }

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'name is required']);
            }
            if (!isset($school['id']) || empty($school['id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            if (!isset($term['id']) || empty($term['id'])){
                return json(['status' => 'error', 'message' => 'Term is required']);
            }
            if (!isset($clazz['id']) || empty($clazz['id'])){
                 return json(['status' => 'error', 'message' => 'Clazz is required']);
            }
            if (isset($data['week'])) {
                $data['week'] = json_encode($data['week']);
            } else {
                $data['week'] = json_encode([]);
            }

            // 创建课程对象并保存
            $course = new Course();
            $course->school_id = $school['id'];
            $course->clazz_id = $clazz['id'];
            $course->term_id = $term['id'];
            $course->name = $data['name'];
            $course->sory = $data['sory'];
            $course->week = $data['week'];
            $course->day = $data['day'];
            $course->period = $data['period'];

            $course->save();

            $courseId = Course::where('name', $data['name'])
                                ->where('school_id', $school['id'])
                                ->where('clazz_id', $clazz['id'])
                                ->where('term_id', $term['id'])
                                ->where('sory', $data['sory'])
                                ->where('day', $data['day'])
                                ->where('period', $data['period'])
                                ->select();
                                               
            if ($courseId) {               
                foreach ($courseId as $newCourse) {               
                    if ((int)$course->id === $newCourse->id) {
                        if ($data['sory'] === 0) {
                            $lesson = new Lesson();
                            $lesson->course_id = $course->id;
                            $lesson->user_id = $data['user'];
                            $lesson->save();
                        } elseif ($data['sory'] === 1) {
                            $users = User::where('school_id', $school['id'])->where('clazz_id', $clazz['id'])->select();
                            foreach ($users as $user) {
                                $lesson = new Lesson();
                                $lesson->course_id = $course->id;
                                $lesson->user_id = $user->id;
                                $lesson->save();
                            }                  
                        } 
                    }
                }
            }

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

            foreach ($list as $course) {
                $course['week'] = json_decode($course['week']); // 获取周数
            }
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
            $day = $data['day'];
            $period = $data['period'];

            $id = $data['id'];

            $course = Course::get($id);
            if (is_null($course)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            $courses = Course::where('name', $data['name'])
                            ->where('school_id', $school['id'])
                            ->where('clazz_id', $clazz['id'])
                            ->select();

            if ($courses) {               
                foreach ($courses as $course) {
                    if ($data['id'] !== $course->id) {
                        return json(['error' => '课程已存在'], 401);
                    } 
                }                
            }

            $times = Course::where('school_id', $school['id'])
                            ->where('clazz_id', $clazz['id'])
                            ->where('term_id', $term['id'])
                            ->where('day', $data['day'])
                            ->where('period', $data['period'])
                            ->select();
            
            if ($times) {      
                foreach ($times as $time) {
                    // 将string '[1, 2]' 转化为 array [1, 2]
                    $timeWeek = explode(', ', trim($time->week, '[]'));
                    $intWeek = array_map('intval', $timeWeek);
                    // 判断是否有相同元素
                    $sameData = array_intersect($data['week'], $intWeek);
                    if (!empty($sameData) && $data['id'] !== $course->id) {
                        return json(['error' => '与已有课程的时间冲突'], 401);
                    }
                }         
                return json(['error' => '课程已存在'], 401);                   
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
           if (isset($data['week'])) {
               $data['week'] = json_encode($data['week']);
           } else {
               $data['week'] = json_encode([]);
           }

            // 编辑对象并保存
            $course->name = $data['name'];
            $course->week = $data['week'];
            $course->school_id = $school['id'];
            $course->clazz_id = $clazz['id'];
            $course->term_id = $term['id'];
            $course->sory = $data['sory'];
            $course->week = $data['week'];
            $course->day = $data['day'];
            $course->period = $data['period'];
            $course->save();

            $deleteLessons = Lesson::where('course_id', $course->id)->select();
            foreach ($deleteLessons as $lesson) {
                $lesson->delete();
            }

            $courseId = Course::where('name', $data['name'])
                                        ->where('school_id', $school['id'])
                                        ->where('clazz_id', $clazz['id'])
                                        ->where('term_id', $term['id'])
                                        ->where('sory', $data['sory'])
                                        ->where('day', $data['day'])
                                        ->where('period', $data['period'])
                                        ->select();
                                               
            if ($courseId) {
                foreach ($courseId as $newCourse) {
                    if ((int)$course->id === $newCourse->id) {
                        if ($data['sory'] === 0) {
                            $lesson = new Lesson();
                            $lesson->course_id = $course->id;
                            $lesson->user_id = $data['user'];
                            $lesson->save();
                        } elseif ($data['sory'] === 1) {
                            $users = User::where('school_id', $school['id'])->where('clazz_id', $clazz['id'])->select();
                            foreach ($users as $user) {
                                $lesson = new Lesson();
                                $lesson->course_id = $course->id;
                                $lesson->user_id = $user->id;
                                $lesson->save();
                            }                  
                        } 
                    }
                }
            }

            return json(['status' => 'success', 'id' => $course->id]);

        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function getClazzBySchoolId() {
        $request = Request::instance();
        $schoolId = $request->param('schoolId');

        // 使用 school_id 获取班级列表
        $clazzes = Clazz::where('school_id', $schoolId)->select();
        return json($clazzes);
    }

    public function getTermsBySchoolId() {
        $request = Request::instance();
        $schoolId = $request->param('schoolId');

        // 检查 school_id 是否存在
        if (empty($schoolId)) {
            return json(['error' => 'School_id is required'], 400);
        }

        // 使用 school_id 获取学期列表
        $terms = Term::where('school_id', $schoolId)->select();
        return json($terms);
    }

    public function getTerm() {
        $request = Request::instance();
        $termId = $request->param('termId');

        // 检查 term_id 是否存在
        if (empty($termId)) {
            return json(['error' => 'term_id is required'], 400);
        }

        // 使用 term_id 获取学期
        $terms = Term::where('id', $termId)->select();
        return json($terms);
    }

    public function getCoursesByTermId() {
        $request = Request::instance();
        $termId = $request->param('termId');

        // 检查 term_id 是否存在
        if (empty($termId)) {
            return json(['error' => 'term_id is required'], 400);
        }

        // 使用 term_id 获取学期
        $courses = Course::where('term_id', $termId)->select();
        return json($courses);
    }

    public function getCoursesByTermIdWithClazzId() {
        $request = Request::instance();
        $termId = $request->param('termId');
        $clazzId = $request->param('clazzId');

        if (empty($termId)) {
            return json(['error' => 'term_id is required'], 400);
        }

        if (empty($clazzId)) {
            return json(['error' => 'clazz_id is required'], 400);
        }

        $courses = Course::where('term_id', $termId)->where('clazz_id', $clazzId)->where('sory', 1)->select();
        return json($courses);
    }

    public function getCoursesByTermIdWithoutClazzId() {
        $request = Request::instance();
        $termId = $request->param('termId');

        if (empty($termId)) {
            return json(['error' => 'term_id is required'], 400);
        }

        $courses = Course::where('term_id', $termId)->where('sory', 0)->select();
        return json($courses);
    }
}
