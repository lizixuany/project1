<?php
namespace app\index\controller;
use think\Controller;
use think\Db;   // 引用数据库操作类
use app\common\model\Term;
use think\request;

class TermController extends Controller
{
    // 获取学期列表
    public function index()
    {
        try {
            $page = $this->request->get('page', 1);
            $size = $this->request->get('size', 10);

            $list = Term::with('school')->page($page, $size)->select();
            $total = Db::name('Term')->count();

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
            // 验证必要字段
            if (!isset($data['term']) || empty($data['term'])){
                return json(['status' => 'error', 'message' => 'Term is required']);
            }
            if (!isset($data['school_id']) || empty($data['school_id'])){
                return json(['status' => 'error', 'message' => 'School is required']);
            }
            if (!isset($data['start_time']) || empty($data['start_time'])){
                return json(['status' => 'error', 'message' => 'Start_time is required']);
            }
            if (!isset($data['end_time']) || empty($data['end_time'])){
                return json(['status' => 'error', 'message' => 'End_time is required']);
            }
            // 创建学期对象并保存
            $term = new Term();
            $term->term = $data['term'];
            $term->school_id = $data['school_id'];
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
            $id = Request::instance()->param('id'); // 从请求中获取id参数
            $term = Term::get($id);
            if ($term) {
                // 将学期信息返回给前端编辑表单
                return json(['status' => 'success', 'data' => $term]);
            } else {
                return json(['status' => 'error', 'message' => 'School not found']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // 更新学期信息
    public function update()
    {
        try{
            $id = Request::instance()->param('id'); // 从请求中获取id参数
            $term = Request::instance()->param('term'); // 从请求中获取term参数
            $start_time = Request::instance()->param('start_time'); // 从请求中获取start_time参数
            $end_time = Request::instance()->param('end_time'); // 从请求中获取end_time参数
            $school_id = Request::instance()->param('school_id'); // 从请求中获取school_id参数
            $term = Term::get($id);
            if ($term) {
                // 数据验证
                if (!isset($term) || empty($term)) {
                    return json(['status' => 'error', 'message' => 'Name is required']);
                }
                if (!isset($start_time) || empty($start_time)) {
                    return json(['status' => 'error', 'message' => 'Start_time is required']);
                }
                if (!isset($end_time) || empty($end_time)) {
                    return json(['status' => 'error', 'message' => 'End_time is required']);
                }
                if (!isset($school_id) || empty($school_id)) {
                 return json(['status' => 'error', 'message' => 'School_id is required']);
                }

                $term->term = $term;
                $term->start_time = $start_time;
                $term->end_time = $end_time;
                $term->school_id = $school_id;
                $term->save();
                return json(['status' => 'success', 'id' => $term->id]);
            } else {
                return json(['status' => 'error', 'message' => 'Term not found']);
            }
        } catch (Exception $e) {
            // 异常处理
            return json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
