<?php
namespace app\index\controller;
use think\Controller;
use app\common\model\Term;
use think\request;

class TermController extends Controller
{
    // 获取学期列表
    public function index()
    {
        $terms = Term::with('school')->select();
        return json($terms);
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
        $term_id = IndexController::getParamId($request);
        if (!$term_id) {
            return json(['success' => true, 'message' => 'term_id不存在']);
        }
        $term = Term::get($term_id);
        return $term;
    }
}
