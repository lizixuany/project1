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
                $course['day'] = $this->getDayOfWeek($course['day']); // 将数字转换为周几的字符串
                $course['period'] = $this->getPeriod($course['period']); // 将数字转换为第几节课的字符串
                $course['week'] = json_decode($course['week']); // 获取周数
            }

            return json($pageData);
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }

    // 定义日和节的转换方法
    protected function getDayOfWeek($days)
    {
        $daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        $daysArray = json_decode($days, true);
        return array_map(function($day) use ($daysOfWeek) {
            return $daysOfWeek[$day];
        }, $daysArray);
    }

    protected function getPeriod($periods)
    {
        $periodArray = json_decode($periods, true);
        return array_map(function($period) {
            return "第" . $period . "大节";
        }, $periodArray);
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

            // 获取相应账号的数据
            $course = Course::where('name', $data['name'])
                            ->where('school_id', $school['id'])
                            ->where('clazz_id', $clazz['id'])
                            ->where('term_id', $term['id'])
                            ->find();

            if ($course) {
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
            if (isset($data['day'])) {
                $data['day'] = json_encode($data['day']);
            } else {
               $data['day'] = json_encode([]);
            }
            if (isset($data['period'])) {
                $data['period'] = json_encode($data['period']);
            } else {
                $data['period'] = json_encode([]);
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
                $course['day'] = json_decode($course['day']); // 将数字转换为周几的字符串
                $course['period'] = json_decode($course['period']); // 将数字转换为第几节课的字符串
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

            $id = $data['id'];

            $course = Course::get($id);
            if (is_null($course)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            // 获取相应账号的数据
            $courses = Course::where('name', $data['name'])
                            ->where('school_id', $school['id'])
                            ->where('clazz_id', $clazz['id'])
                            ->where('term_id', $term['id'])
                            ->find();

            if ($courses) {
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
           if (isset($data['day'])) {
               $data['day'] = json_encode($data['day']);
           } else {
              $data['day'] = json_encode([]);
           }
           if (isset($data['period'])) {
               $data['period'] = json_encode($data['period']);
           } else {
               $data['period'] = json_encode([]);
           }

            // 创建课表对象并保存
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
}
