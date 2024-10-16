<?php
namespace app\index\controller;     //命名空间，也说明了文件所在的文件夹
use think\Db;   // 引用数据库操作类
use think\Controller;
use think\Request;
use app\common\model\User;

class PersonalcenterController extends Controller
{
    public function index() {
        try {
            
        } catch (\Exception $e) {
            return '系统错误' . $e->getMessage();
        }
    }
}
