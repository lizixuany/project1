<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\Clazz;
use app\common\model\School;

class ClazzController extends Controller
{
    public function index() {
        try {
            $page = $this->request->get('page', 1);
            $size = $this->request->get('size', 10);
          
            $list = Db::name('Clazz')->page($page, $size)->select();
            $total = Db::name('Clazz')->count();
          
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
}
