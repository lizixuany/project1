<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\Lesson;
use app\common\model\Course;
use app\common\model\User;

class LessonController extends Controller
{
    public function index() {
        try {
            $page = $this->request->get('page', 1);
            $size = $this->request->get('size', 10);
            $request = Request::instance()->getContent();
            $data = json_decode($request, true);

            $list = Lesson::with(['user', 'course'])->page($page, $size)->select();
            $total = Lesson::with(['user', 'course'])->page($page, $size)->count();

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
}
