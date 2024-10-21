<?php
namespace app\index\controller;
use think\Controller;
use think\Db;   // 引用数据库操作类
use app\common\model\Course;
use think\request;

class CourseController extends Controller
{
    // 获取课程列表
    public function index()
    {
        try {
            $page = $this->request->get('page', 1);
            $size = $this->request->get('size', 10);

            $list = Course::with(['clazz', 'term'])->page($page, $size)->select();
            $total = Db::name('course')->count();

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