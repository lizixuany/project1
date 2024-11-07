<?php
namespace app\index\controller;
use think\Controller;
use think\Db;   // 引用数据库操作类
use app\common\model\Term;
use app\common\model\Course;
use think\request;

class TermController extends Controller
{
    // 获取学期列表
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

            // 获取学期名称
            $name = $data['name'];

            if ($name !== null && $name !== '') {
                $condition['clazz.name'] = ['like', '%' . $name . '%'];
            }

            $list = Term::with('school')->where($condition)->page($page, $size)->select();
            $total = Term::with('school')->where($condition)->page($page, $size)->count();

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
    public function add() {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];

            // 将日期转换成时间戳，方便验证
            $startTime = strtotime($data['start_time']);  
            $endTime = strtotime($data['end_time']);

            // 获取相应账号的数据
            $result = Term::where('name', $data['name'])->where('school_id', $school['id'])->find();
            if ($result) {
                return json(['error' => '同名学期已存在'], 401);
            }

            $start = Term::where('start_time', $data['start_time'])->where('school_id', $school['id'])->find();
            if ($start) {
                return json(['error' => '相同开始时间的学期已存在'], 401);
            }

            $end = Term::where('end_time', $data['end_time'])->where('school_id', $school['id'])->find();
            if ($end) {
                return json(['error' => '相同结束时间的学期已存在'], 401);
            }

            $terms = Term::where('school_id', $school['id'])->find();
            // 检查是否查询到了数据  
            if ($terms) {  
                // 遍历查询结果集  
                foreach ($terms as $term) { 
                    if ($startTime <= strtotime($term->start_time) && $endTime <= strtotime($term->end_time)) {
                        return json(['error' => '相似时间的学期已存在'], 401);
                    }
                }
            } 

            // 验证必要字段
            if (!isset($data['name']) || empty($data['name'])){
                return json(['status' => 'error', 'message' => 'Term is required']);
            }
            if (!isset($school['id']) || empty($school['id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            if (!isset($data['start_time']) || empty($data['start_time'])){
                return json(['status' => 'error', 'message' => 'Start_time is required']);
            }
            if (!isset($data['end_time']) || empty($data['end_time'])){
                return json(['status' => 'error', 'message' => 'End_time is required']);
            }
            if ($startTime >= $endTime) {
                return json(['error' => '学期时间设置异常'], 401);
            }

            // 验证周数不得少于16周
           $startTime = strtotime($data['start_time']);
           $endTime = strtotime($data['end_time']);

           // 计算学期的总天数
           $semesterTotalDays = $endTime - $startTime;
           $totalDays = $semesterTotalDays / 86400;
           
           // 计算学期的总周数s
           $totalWeeks = (int)ceil($totalDays / 7);

           // 检查周数是否不少于16周
           if ($totalWeeks < 16) {
               return json(['error' => '学期的周数不得少于16周'], 401);
           }


            // 创建学期对象并保存
            $term = new Term();
            $term->name = $data['name'];
            $term->school_id = $school['id'];
            $term->start_time = $data['start_time'];
            $term->end_time = $data['end_time'];
            $term->save();
            return json(['status' => 'success', 'id' => $term->school_id]);
        } catch (Exception $e) {
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 删除学期
    public function delete()
    {
        try {
            $term = TermController::getTerm();
            if (!$term) {
                return json(['status' => 'error', 'message' => '学期不存在']);
            }

            $courses = Course::where('term_id', $term['id'])->select();
            if ($courses) {
                return json(['error' => '该学期仍有课程未清空'], 401); 
            }

            // 删除学期
            if ($term->delete()) {
                return json(['status' => 'success', 'message' => '删除成功']);
            } else {
                return json(['status' => 'error', 'message' => '删除失败']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public static function getTerm() {
        $request = Request::instance();
        $id = IndexController::getParamId($request);
        if (!$id) {
            return json(['success' => true, 'message' => 'id不存在']);
        }
        $term = Term::get($id);
        return $term;
    }

    // 编辑学期信息
    public function edit()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            $list = Term::with('school')->where('term.id', $data)->select();

            return json($list);
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 更新学期信息
    public function update()
    {
        try{
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);
            $school = $data['school'];
            // 将日期转换成时间戳，方便验证
            $startTime = strtotime($data['start_time']);  
            $endTime = strtotime($data['end_time']);

            $id = $data['id'];

            $term = Term::get($id);
            if (is_null($term)) {
                return $this->error('系统未找到ID为' . $id . '的记录');
            }

            // 获取相应账号的数据
            $results = Term::where('name', $data['name'])->where('school_id', $school['id'])->select();
            if ($results) {
                foreach ($results as $result) {
                    if ($result->id !== $data['id']) {
                        return json(['error' => '同名学期已存在'], 401);
                    } 
                }
            }

            $starts = Term::where('start_time', $data['start_time'])->where('school_id', $school['id'])->select();
            if ($starts) {
                foreach ($starts as $start) {
                    if ($start->id !== $data['id']) {
                        return json(['error' => '相同开始时间的学期已存在'], 401);
                    } 
                }
            }

            $ends = Term::where('end_time', $data['end_time'])->where('school_id', $school['id'])->select();
            if ($ends) {
                foreach ($ends as $end) {
                    if ($end->id !== $data['id']) {
                        return json(['error' => '相同结束时间的学期已存在'], 401);
                    } 
                }
            }

            $terms = Term::where('school_id', $school['id'])->select();
            $i = 0;
            // 检查是否查询到了数据  
            if ($terms) {  
                // 遍历查询结果集  
                foreach ($terms as $term) { 
                    if ($startTime <= strtotime($term->start_time) && $endTime <= strtotime($term->end_time)) {
                        if ($term->id !== $data['id']) {
                            return json(['error' => '相似时间的学期已存在'], 401);
                        } 
                    }
                }
            }

           // 验证必要字段
           if (!isset($data['name']) || empty($data['name'])){
               return json(['status' => 'error', 'message' => 'Term is required']);
           }
           if (!isset($school['id']) || empty($school['id'])){
               return json(['status' => 'error', 'message' => 'School is required']);
           }
           if (!isset($data['start_time']) || empty($data['start_time'])){
               return json(['status' => 'error', 'message' => 'Start_time is required']);
           }
           if (!isset($data['end_time']) || empty($data['end_time'])){
               return json(['status' => 'error', 'message' => 'End_time is required']);
           }
           if ($startTime >= $endTime) {
            return json(['error' => '学期时间设置异常'], 401);
           }

           // 验证周数不得少于16周
           $startTime = strtotime($data['start_time']);
           $endTime = strtotime($data['end_time']);

           // 计算学期的总天数
           $semesterTotalDays = $endTime - $startTime;
           $totalDays = $semesterTotalDays / 86400;
           
           // 计算学期的总周数s
           $totalWeeks = (int)ceil($totalDays / 7);

           // 检查周数是否不少于16周
           if ($totalWeeks < 16) {
               return json(['error' => '学期的周数不得少于16周'], 401);
           }

            // 创建学期对象并保存
            // $term = new Term();
            $term->name = $data['name'];
            $term->school_id = $school['id'];
            $term->start_time = $data['start_time'];
            $term->end_time = $data['end_time'];
            $term->save();

            return json(['status' => 'success', 'id' => $term->school_id]);

        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function getTerms() {
        $terms = Term::with('school')->select();

        return json($terms);
    }
}
